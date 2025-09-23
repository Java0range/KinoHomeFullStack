'use client';



import { useFullPageScroll } from '@/hooks/useFullPageScroll';
import MainPage from "@/components/HomePage/MainPage";



export default function HomePage() {
    const sections = ['g1', 'g2', 'g3'];
    const { containerRef, currentSection, scrollToSection } = useFullPageScroll(sections.length);


    return (
        <div>
            <div
                ref={containerRef}
                className="m-0 bg-zinc-900 fixed h-full w-full flex justify-center overflow-y-auto overflow-x-hidden overscroll-none"
                style={{scrollBehavior: 'smooth'}}
            >
                <div className="container">
                    <div className="flex flex-col items-center">
                        <MainPage/>
                    </div>
                </div>
            </div>
        </div>
    );
}