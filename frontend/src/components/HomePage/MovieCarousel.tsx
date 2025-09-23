'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
    motion,
    useMotionTemplate,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
    type Transition,
} from 'framer-motion';

export interface IRating {
    kp: number;
    imdb: number;
}

export type Movie = {
    id: string;
    name: string;
    poster: string; // 600x900
    rating?: IRating;
    year?: number;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(n, min));

function circularDelta(i: number, c: number, len: number) {
    // кратчайшее расстояние по кольцу
    let d = i - c;
    if (d > len / 2) d -= len;
    if (d < -len / 2) d += len;
    return d;
}

function useResizeObserver<T extends HTMLElement>(
    ref: React.RefObject<T | null> | React.MutableRefObject<T | null>
) {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const ro = new ResizeObserver((entries) => {
            const cr = entries[0].contentRect;
            setSize({ width: cr.width, height: cr.height });
        });

        ro.observe(node);
        return () => ro.disconnect();
    }, [ref]);

    return size;
}

export default function MovieCarousel({
                                          movies,
                                          autoplay = true,
                                          interval = 3500,
                                          className,
                                      }: {
    movies: Movie[];
    autoplay?: boolean;
    interval?: number;
    className?: string;
}) {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const [interactive, setInteractive] = useState(false); // навели мышь или фокус внутри слайдера
    const containerRef = useRef<HTMLDivElement>(null);
    const { width } = useResizeObserver(containerRef);

    const baseLen = movies?.length || 0;
    const isSingle = baseLen === 1;

    // Для 2–4 фильмов заполняем «виртуальное» кольцо до 6 слотов, чтобы сохранить симметрию и 3D-глубину
    const minRing = 6;
    const displayLen = baseLen <= 1 ? 1 : Math.ceil(minRing / baseLen) * baseLen;

    const displayMovies = useMemo(() => {
        if (baseLen <= 1) return movies;
        const arr: Movie[] = [];
        for (let i = 0; i < displayLen; i++) arr.push(movies[i % baseLen]);
        return arr;
    }, [movies, baseLen, displayLen]);

    const cardWidth = clamp(width * 0.24, 180, 320);
    const spacing = cardWidth * 0.72;
    const maxVisible = baseLen >= 7 ? 4 : baseLen <= 1 ? 0 : 2;

    // Автоплей — только если реальных фильмов > 1
    useEffect(() => {
        if (!autoplay || paused || baseLen <= 1) return;
        const id = setInterval(() => setCurrent((c) => (c + 1) % displayLen), interval);
        return () => clearInterval(id);
    }, [autoplay, paused, interval, baseLen, displayLen]);

    // Навигация стрелками: слушаем window только при наведении/фокусе внутри слайдера
    useEffect(() => {
        if (!interactive || baseLen <= 1) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                setCurrent((c) => (c + 1) % displayLen);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setCurrent((c) => (c - 1 + displayLen) % displayLen);
            }
        };

        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [interactive, baseLen, displayLen]);

    const goTo = useCallback(
        (idx: number) => setCurrent(((idx % displayLen) + displayLen) % displayLen),
        [displayLen]
    );
    const next = useCallback(() => goTo(current + 1), [goTo, current]);
    const prev = useCallback(() => goTo(current - 1), [goTo, current]);

    const realIndex = baseLen ? (current % baseLen) + 1 : 0;

    if (!baseLen) {
        return <div className="text-center text-zinc-400">Нет фильмов для отображения</div>;
    }

    const height = window.innerHeight

    return (
        <div
            ref={containerRef}
            className={`relative mx-auto select-none outline-none ${className || ''}`}
            // ВАЖНО: без tabIndex — слайдер сам не попадёт в фокус
            onPointerEnter={() => {
                setPaused(true);
                setInteractive(true);
            }}
            onPointerLeave={() => {
                setPaused(false);
                setInteractive(false);
            }}
            onFocusCapture={() => {
                // если фокус перешёл на внутренние кнопки — считаем слайдер интерактивным
                setPaused(true);
                setInteractive(true);
            }}
            onBlurCapture={(e) => {
                // если фокус ушёл за пределы контейнера — снимаем интерактив
                const next = e.relatedTarget as Node | null;
                if (!next || !e.currentTarget.contains(next)) {
                    setPaused(false);
                    setInteractive(false);
                }
            }}
        >
            <div className={`relative ${height <= 510 ? "h-[330px]" : "h-[500px] sm:h-[520px] md:h-[560px] lg:h-[600px]"} w-full`}>
                <div className="absolute inset-0 [perspective:1400px]">
                    {displayMovies.map((m, i) => (
                        <Slide
                            key={`${m.id}__${i}`}
                            movie={m}
                            index={i}
                            current={current}
                            len={displayLen}
                            cardWidth={cardWidth}
                            spacing={spacing}
                            maxVisible={maxVisible}
                            onClick={() => goTo(i)}
                            onPrev={prev}
                            onNext={next}
                            single={isSingle}
                        />
                    ))}
                </div>

                {baseLen > 1 && (
                    <>
                        <button
                            aria-label="Предыдущий"
                            onClick={prev}
                            className="group absolute left-2 md:left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 hover:bg-black/60 text-white p-2 md:p-3 backdrop-blur transition focus:outline-none focus:ring-2 focus:ring-white/60"
                        >
                            <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" />
                        </button>
                        <button
                            aria-label="Следующий"
                            onClick={next}
                            className="group absolute right-2 md:right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 hover:bg-black/60 text-white p-2 md:p-3 backdrop-blur transition focus:outline-none focus:ring-2 focus:ring-white/60"
                        >
                            <ChevronRight className="h-6 w-6 md:h-7 md:w-7" />
                        </button>
                    </>
                )}
            </div>

            {/* Индикаторы по реальным фильмам */}
            <div className="mt-4 flex items-center justify-center gap-3">
                <div className="text-sm text-zinc-300">
                    {realIndex} / {baseLen}
                </div>
                {autoplay && baseLen > 1 && <AutoplayProgress paused={paused} interval={interval} key={current} />}
            </div>
        </div>
    );
}

function Slide({
                   movie,
                   index,
                   current,
                   len,
                   cardWidth,
                   spacing,
                   maxVisible,
                   onClick,
                   onPrev,
                   onNext,
                   single,
               }: {
    movie: Movie;
    index: number;
    current: number;
    len: number; // длина виртуального кольца
    cardWidth: number;
    spacing: number;
    maxVisible: number;
    onClick: () => void;
    onPrev: () => void;
    onNext: () => void;
    single: boolean;
}) {
    const reduceMotion = useReducedMotion();
    const delta = circularDelta(index, current, len);
    const visible = Math.abs(delta) <= maxVisible;

    // Позиции/эффекты
    const x = single ? 0 : delta * spacing;
    const z = single || reduceMotion ? 0 : -Math.abs(delta) * 140;
    const rotateY = single || reduceMotion ? 0 : delta * -18;
    const scale = single ? 1 : 1 - Math.min(Math.abs(delta) * 0.08, 0.4);
    const opacity = single ? 1 : 1 - Math.min(Math.abs(delta) * 0.12, 0.7);

    const spring: Transition = { type: 'spring', stiffness: 220, damping: 24, mass: 0.6 };
    const springFast: Transition = { type: 'spring', stiffness: 340, damping: 30, mass: 0.5 };

    // Ховер-наклон и "блик"
    const cardRef = useRef<HTMLDivElement>(null);
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const rotateXTilt = useTransform(my, [-0.5, 0.5], [8, -8]);
    const rotateYTilt = useTransform(mx, [-0.5, 0.5], [-10, 10]);
    const shineX = useTransform(mx, (v) => `${(v + 0.5) * 100}%`);
    const shineY = useTransform(my, (v) => `${(v + 0.5) * 100}%`);
    const shineBg = useMotionTemplate`radial-gradient(300px circle at ${shineX} ${shineY}, rgba(255,255,255,0.24), rgba(255,255,255,0.06) 45%, transparent 60%)`;

    const onMoveTilt = (e: React.PointerEvent) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        mx.set(px - 0.5);
        my.set(py - 0.5);
    };
    const onLeaveTilt = () => {
        mx.set(0);
        my.set(0);
    };

    // Swipe-жест без физического перемещения карточки
    const downRef = useRef(false);
    const movedRef = useRef(false);
    const startXRef = useRef(0);
    const startTRef = useRef(0);

    const handlePointerDown = (e: React.PointerEvent) => {
        if (!(delta === 0) || reduceMotion || single) return; // свайпим только активную
        downRef.current = true;
        movedRef.current = false;
        startXRef.current = e.clientX;
        startTRef.current = performance.now();
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (delta === 0 && !reduceMotion && !single) onMoveTilt(e);
        if (!downRef.current) return;
        const dx = e.clientX - startXRef.current;
        if (Math.abs(dx) > 6) movedRef.current = true;
    };

    const finishSwipe = (e: React.PointerEvent) => {
        if (!downRef.current) return;
        const dx = e.clientX - startXRef.current;
        const dt = Math.max(1, performance.now() - startTRef.current);
        const vx = dx / dt; // px/ms

        const strongSwipe = Math.abs(dx) > 50 || Math.abs(vx) > 0.5;
        if (strongSwipe) {
            if (dx < 0) onNext();
            else onPrev();
        }

        if (movedRef.current) e.stopPropagation(); // не триггерим onClick контейнера
        downRef.current = false;
    };

    const isActive = delta === 0;

    // Выбор оценки: kp > 0 ? kp : imdb
    const rating =
        typeof movie.rating?.kp === 'number' && movie.rating.kp > 0
            ? movie.rating.kp
            : typeof movie.rating?.imdb === 'number'
                ? movie.rating.imdb
                : undefined;

    return (
        <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
            style={{
                zIndex: Math.round(1000 - Math.abs(delta) * 10),
                pointerEvents: visible ? 'auto' : 'none',
            }}
            onClick={onClick}
            role="group"
            aria-roledescription="slide"
            aria-label={movie.name}
        >
            <motion.div
                className="will-change-transform"
                initial={false}
                animate={{ x, z, rotateY, scale, opacity }}
                transition={spring}
            >
                <motion.div
                    ref={cardRef}
                    className={`
            group relative rounded-2xl overflow-hidden
            shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]
            border border-white/10 bg-zinc-900
            aspect-[2/3]
            touch-pan-y
            ${isActive && !single ? 'cursor-pointer' : 'cursor-pointer'}
          `}
                    style={{
                        width: cardWidth,
                        rotateX: isActive && !reduceMotion && !single ? rotateXTilt : 0,
                        rotateY: isActive && !reduceMotion && !single ? rotateYTilt : 0,
                    }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={(e) => {
                        finishSwipe(e);
                        if (isActive) onLeaveTilt();
                    }}
                    onPointerCancel={(e) => {
                        finishSwipe(e);
                        if (isActive) onLeaveTilt();
                    }}
                    onPointerLeave={() => {
                        if (!downRef.current) onLeaveTilt();
                    }}
                    transition={springFast}
                >
                    {/* Постер */}
                    <Image
                        src={movie.poster}
                        alt={movie.name}
                        fill
                        sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 320px"
                        className="object-cover"
                        priority={true}
                    />

                    {/* Блик при ховере */}
                    {!reduceMotion && (
                        <motion.div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: shineBg }} />
                    )}

                    {/* Градиентная подложка для читаемости */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Бейджи */}
                    <div className="absolute left-2 right-2 top-2 flex items-center justify-between text-white">
                        {typeof rating === 'number' && (
                            <div className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs font-semibold backdrop-blur">
                                <Star className="h-3.5 w-3.5 text-yellow-400" />
                                <span>{rating.toFixed(1)}</span>
                            </div>
                        )}
                        {movie.year && (
                            <div className="rounded-full bg-white/15 px-2 py-1 text-[11px] font-medium">{movie.year}</div>
                        )}
                    </div>

                    {/* Заголовок */}
                    <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 text-white">
                        <div className="truncate text-sm md:text-base font-semibold drop-shadow">{movie.name}</div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

function AutoplayProgress({ paused, interval }: { paused: boolean; interval: number }) {
    const progress = useMotionValue(0);
    const p = useSpring(progress, { stiffness: 120, damping: 18 });
    useEffect(() => {
        progress.set(0);
        if (paused) return;
        let start = performance.now();
        let raf = 0;
        const tick = (t: number) => {
            const dt = t - start;
            const v = Math.min(dt / interval, 1);
            progress.set(v);
            if (v < 1 && !paused) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [paused, interval, progress]);
    const width = useTransform(p, [0, 1], ['0%', '100%']);
    return (
        <div className="h-1 w-24 overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full bg-white/70" style={{ width }} />
        </div>
    );
}

// Иконки (inline SVG)
function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
    );
}
function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    );
}
function Star(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
    );
}