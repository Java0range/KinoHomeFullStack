import { useEffect, useRef, useState, useCallback } from 'react';

export const useFullPageScroll = (sectionsCount: number) => {
    const [currentSection, setCurrentSection] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef(0);
    const lastScrollTime = useRef(0);

    const scrollToSection = useCallback((index: number) => {
        if (index < 0 || index >= sectionsCount || isScrolling) return;

        setIsScrolling(true);
        setCurrentSection(index);

        const container = containerRef.current;
        if (!container) return;

        const targetScrollTop = window.innerHeight * index;

        // Плавная анимация скролла
        container.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
        });

        // Блокируем скролл на время анимации
        setTimeout(() => {
            setIsScrolling(false);
        }, 800); // Длительность анимации
    }, [sectionsCount, isScrolling]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            const now = Date.now();
            if (now - lastScrollTime.current < 800) return; // Дебаунс
            lastScrollTime.current = now;

            if (e.deltaY > 0 && currentSection < sectionsCount - 1) {
                scrollToSection(currentSection + 1);
            } else if (e.deltaY < 0 && currentSection > 0) {
                scrollToSection(currentSection - 1);
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY.current = e.touches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY.current - touchEndY;

            if (Math.abs(diff) > 50) { // Минимальный свайп
                if (diff > 0 && currentSection < sectionsCount - 1) {
                    scrollToSection(currentSection + 1);
                } else if (diff < 0 && currentSection > 0) {
                    scrollToSection(currentSection - 1);
                }
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('touchstart', handleTouchStart);
        container.addEventListener('touchend', handleTouchEnd);

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [currentSection, sectionsCount, scrollToSection]);

    return {
        containerRef,
        currentSection,
        scrollToSection
    };
};