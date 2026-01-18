import { useState, useEffect, useCallback, useRef, RefObject } from 'react';

interface UseFullPageScrollOptions {
    sectionsCount: number;
    scrollDuration?: number;
    scrollThreshold?: number;
}

interface UseFullPageScrollReturn {
    containerRef: RefObject<HTMLDivElement | null>;  // ✅ Добавил | null
    currentSection: number;
    scrollToSection: (index: number) => void;
    isScrolling: boolean;
}

export function useFullPageScroll({
                                      sectionsCount,
                                      scrollDuration = 800,
                                      scrollThreshold = 50,
                                  }: UseFullPageScrollOptions): UseFullPageScrollReturn {
    const [currentSection, setCurrentSection] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);  // Оставляем так
    const touchStartY = useRef(0);
    const accumulatedDelta = useRef(0);

    // Скролл к определенной секции
    const scrollToSection = useCallback((index: number) => {
        if (index < 0 || index >= sectionsCount || isScrolling) return;

        setIsScrolling(true);
        setCurrentSection(index);

        const container = containerRef.current;
        if (container) {
            const sections = container.querySelectorAll('[data-section]');
            const targetSection = sections[index] as HTMLElement;

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }

        setTimeout(() => {
            setIsScrolling(false);
            accumulatedDelta.current = 0;
        }, scrollDuration);
    }, [sectionsCount, isScrolling, scrollDuration]);

    // Обработчик wheel события
    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();

        if (isScrolling) return;

        accumulatedDelta.current += e.deltaY;

        if (Math.abs(accumulatedDelta.current) >= scrollThreshold) {
            if (accumulatedDelta.current > 0 && currentSection < sectionsCount - 1) {
                scrollToSection(currentSection + 1);
            } else if (accumulatedDelta.current < 0 && currentSection > 0) {
                scrollToSection(currentSection - 1);
            }
            accumulatedDelta.current = 0;
        }
    }, [currentSection, isScrolling, scrollToSection, sectionsCount, scrollThreshold]);

    // Обработчики touch событий
    const handleTouchStart = useCallback((e: TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    }, []);

    const handleTouchEnd = useCallback((e: TouchEvent) => {
        if (isScrolling) return;

        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchStartY.current - touchEndY;

        if (Math.abs(deltaY) > 50) {
            if (deltaY > 0 && currentSection < sectionsCount - 1) {
                scrollToSection(currentSection + 1);
            } else if (deltaY < 0 && currentSection > 0) {
                scrollToSection(currentSection - 1);
            }
        }
    }, [currentSection, isScrolling, scrollToSection, sectionsCount]);

    // Обработчик клавиатуры
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (isScrolling) return;

        switch (e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                scrollToSection(currentSection + 1);
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                scrollToSection(currentSection - 1);
                break;
            case 'Home':
                e.preventDefault();
                scrollToSection(0);
                break;
            case 'End':
                e.preventDefault();
                scrollToSection(sectionsCount - 1);
                break;
        }
    }, [currentSection, isScrolling, scrollToSection, sectionsCount]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchend', handleTouchEnd, { passive: true });
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleWheel, handleTouchStart, handleTouchEnd, handleKeyDown]);

    return {
        containerRef,
        currentSection,
        scrollToSection,
        isScrolling,
    };
}