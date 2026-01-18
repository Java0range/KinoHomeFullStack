'use client';

import { useFullPageScroll } from '@/hooks/useFullPageScroll';
import MainPage from "@/components/HomePage/MainPage";

export default function HomePage() {
    const { containerRef, currentSection, scrollToSection } = useFullPageScroll({
        sectionsCount: 3,
        scrollDuration: 800,
    });

    return (
        <div className="h-[100svh] overflow-hidden bg-zinc-900">
            {/* Навигационные точки */}
            <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
                {[0, 1, 2].map((index) => (
                    <button
                        key={index}
                        onClick={() => scrollToSection(index)}
                        className={`
                            w-3 h-3 rounded-full transition-all duration-300
                            ${currentSection === index
                            ? 'bg-red-600 scale-125'
                            : 'bg-white/50 hover:bg-white/80'}
                        `}
                        aria-label={`Go to section ${index + 1}`}
                    />
                ))}
            </nav>

            {/* Контейнер скролла */}
            <div
                ref={containerRef}
                className="h-full w-full overflow-hidden"
            >
                <div className="container mx-auto">
                    <MainPage />
                </div>
            </div>
        </div>
    );
}