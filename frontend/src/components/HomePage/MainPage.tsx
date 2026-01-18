"use client";

import FilmsWindow from "@/components/HomePage/FilmsWindow";
import { useGenres, useMainSlider } from "@/hooks/MoviesHooks";
import MovieCarousel from "@/components/HomePage/MovieCarousel";
import { useEffect, useState } from "react";
import Header from "@/components/HomePage/Header";
import SerialsWindow from "@/components/HomePage/SrialsWindow";

export default function Page() {
    const FilmsGenresQuery = useGenres("film");
    const SerialsGenresQuery = useGenres("serial");
    const MainSliderQuery = useMainSlider();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (FilmsGenresQuery.isSuccess && MainSliderQuery.isSuccess && SerialsGenresQuery.isSuccess) {
            setReady(true);
        }
    }, [FilmsGenresQuery.isSuccess, MainSliderQuery.isSuccess, SerialsGenresQuery.isSuccess]);

    if (!ready) {
        return (
            <section
                data-section="0"
                className="w-full h-[100svh] flex flex-col justify-center items-center gap-3"
            >
                <h3 className="text-white text-md font-bold">Загрузка...</h3>
                <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4
                               border-solid border-current border-e-transparent
                               text-red-600"
                    role="status"
                />
            </section>
        );
    }

    return (
        <>
            <section
                data-section="0"
                id="g1"
                className="w-full h-[100svh] pt-8"
            >
                <Header />
                <MovieCarousel movies={MainSliderQuery.data ?? []} />
            </section>

            <section
                data-section="1"
                id="g2"
                className="w-full h-[100svh] pt-8"
            >
                <FilmsWindow filmGenres={FilmsGenresQuery.data ?? []} />
            </section>

            <section
                data-section="2"
                id="g3"
                className="w-full h-[100svh] pt-8"
            >
                <SerialsWindow serialsGenres={SerialsGenresQuery.data ?? []} />
            </section>
        </>
    );
}