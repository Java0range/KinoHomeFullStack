import re
from contextlib import asynccontextmanager

import subprocess
import shutil
from pathlib import Path

from beanie import init_beanie
from faststream import FastStream, Logger, ContextRepo
from faststream.rabbit import RabbitBroker
from asyncio import run as async_run
from asyncio import create_subprocess_exec, subprocess, gather

from pymongo import AsyncMongoClient

from config import config
from documents import MovieDocument
from odm import AsyncMovieODM

broker = RabbitBroker(config.get_rabbitmq_url())

# Конфигурация путей
DOWNLOADS_DIR = Path("E:/Movies/downloads")
MEDIA_DIR = Path("E:/Movies/media")


@asynccontextmanager
async def lifespan(context: ContextRepo):
    client = AsyncMongoClient(config.get_mongo_url())
    await init_beanie(database=client.kinohome, document_models=[MovieDocument])
    yield


async def main():
    app = FastStream(broker, lifespan=lifespan)
    await app.run()


def extract_episode_number(filename: str) -> int:
    """Извлекает номер серии из имени файла (формат E##)"""
    match = re.search(r"E(\d{1,4})", filename, re.IGNORECASE)
    return int(match.group(1)) if match else None


async def convert_to_hls(
        input_path: Path,
        output_dir: Path,
        logger: Logger
):
    """Конвертирует видео в HLS с аппаратным ускорением без субтитров"""
    try:
        output_dir.mkdir(parents=True, exist_ok=True)
        playlist = output_dir / "index.m3u8"
        segment_pattern = output_dir / "segment_%03d.ts"

        logger.info(f"Starting conversion: {input_path}")

        # Формируем команду FFmpeg с аппаратным ускорением
        ffmpeg_cmd = [
            "ffmpeg",
            "-i", str(input_path),
            "-sn",
            "-codec:v", "h264_nvenc",  # Видео кодек (H.264)
            "-codec:a", "aac",  # Аудио кодек (AAC)
            "-ac", "2",  # 2 канала (стерео)
            "-hls_time", "10",  # Длительность сегментов в секундах
            "-hls_playlist_type", "vod",  # Тип плейлиста (VOD - Video on Demand)
            "-hls_segment_filename", str(segment_pattern),
            str(playlist)
        ]
        # ffmpeg_cmd = [
        #     "ffmpeg",
        #     "-hwaccel", "cuda",
        #     "-hwaccel_output_format", "cuda",
        #     "-i", str(input_path),
        #     "-map", "0",
        #     "-map_chapters", "-1",  # исключаем главы
        #     "-sn",  # отключаем субтитры
        #     "-c:v", "h264_nvenc",
        #     "-preset", "p6",
        #     "-tune", "hq",
        #     "-b:v", "5M",
        #     "-maxrate", "10M",
        #     "-bufsize", "12M",
        #     "-c:a", "aac",
        #     "-b:a", "192k",
        #     "-f", "hls",
        #     "-hls_time", "6",
        #     "-hls_playlist_type", "vod",
        #     "-hls_segment_type", "mpegts",
        #     "-hls_flags", "independent_segments",
        #     "-hls_segment_filename", str(segment_pattern),
        #     str(playlist)
        # ]

        # Запускаем процесс FFmpeg
        process = await create_subprocess_exec(
            *ffmpeg_cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        # Ждем завершения и логируем вывод
        stdout, stderr = await process.communicate()

        if process.returncode != 0:
            logger.error(f"FFmpeg error: {stderr.decode()}")
            return True

        logger.info(f"Conversion complete: {output_dir}")
        return True

    except Exception as e:
        logger.error(f"Conversion error: {str(e)}")
        return False


@broker.subscriber("hls_convertor")
async def handle_conversion(msg: dict, logger: Logger):
    """Обработчик сообщений из RabbitMQ"""
    media_id = msg["id"]
    rel_path = msg["path"].lstrip('/')

    input_path = DOWNLOADS_DIR / rel_path
    output_base = MEDIA_DIR / str(media_id)

    try:
        if not input_path.exists():
            logger.error(f"Path not found: {input_path}")
            return

        # Обработка фильма (единичный файл)
        if input_path.is_file():
            logger.info(f"Processing movie: ID={media_id}")
            if await convert_to_hls(input_path, output_base, logger):
                input_path.unlink()
                logger.info(f"Movie processed and source deleted: {input_path}")
                await AsyncMovieODM.change_movie_state(movie_id=media_id, series_count=1)

        # Обработка сериала (папка с эпизодами)
        elif input_path.is_dir():
            logger.info(f"Processing series: ID={media_id}")
            tasks = []

            for entry in input_path.iterdir():
                if not entry.is_file():
                    continue

                ep_num = extract_episode_number(entry.name)
                if ep_num is None:
                    logger.warning(f"Skipping {entry.name}: no episode number")
                    continue

                ep_dir = output_base / str(ep_num)
                tasks.append(convert_to_hls(entry, ep_dir, logger))

            # Параллельная обработка эпизодов
            results = await gather(*tasks)

            # Удаляем только успешно обработанные файлы
            for i, entry in enumerate(input_path.iterdir()):
                if entry.is_file() and results[i] is True:
                    entry.unlink()
                    logger.info(f"Deleted processed file: {entry}")

            # Удаляем пустую директорию
            if not any(input_path.iterdir()):
                shutil.rmtree(input_path)
                logger.info(f"Cleaned empty series directory: {input_path}")

            await AsyncMovieODM.change_movie_state(movie_id=media_id, series_count=len(results))

    except Exception as e:
        logger.error(f"Processing error: {str(e)}")


if __name__ == "__main__":
    async_run(main())