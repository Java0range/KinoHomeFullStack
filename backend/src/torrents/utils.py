def format_size(bytes_value: float) -> str:
    """
    Умное форматирование размера файла.

    Примеры:
        500 → "500 B"
        1536 → "1.5 KB"
        2621440 → "2.5 MB"
        5368709120 → "5.0 GB"
        1649267441664 → "1.5 TB"
    """
    if bytes_value == 0:
        return "0 B"

    units = ["B", "KB", "MB", "GB", "TB"]

    for unit in units:
        if abs(bytes_value) < 1024:
            # Убираем .0 для целых чисел
            if bytes_value == int(bytes_value):
                return f"{int(bytes_value)} {unit}"
            return f"{bytes_value:.1f} {unit}"
        bytes_value /= 1024

    return f"{bytes_value:.1f} PB"


def format_speed(bytes_per_sec: float) -> str:
    """
    Умное форматирование скорости загрузки.

    Примеры:
        0 → "0 B/s"
        512 → "512 B/s"
        1048576 → "1.0 MB/s"
        15728640 → "15.0 MB/s"
    """
    if bytes_per_sec == 0:
        return "0 B/s"

    units = ["B/s", "KB/s", "MB/s", "GB/s"]

    for unit in units:
        if abs(bytes_per_sec) < 1024:
            if bytes_per_sec == int(bytes_per_sec):
                return f"{int(bytes_per_sec)} {unit}"
            return f"{bytes_per_sec:.1f} {unit}"
        bytes_per_sec /= 1024

    return f"{bytes_per_sec:.1f} TB/s"