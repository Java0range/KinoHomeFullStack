"use client";


import FilmsWindow from "@/components/HomePage/FilmsWindow";
import {useGenres, useMainSlider} from "@/hooks/MoviesHooks";
import MovieCarousel from "@/components/HomePage/MovieCarousel";
import {useEffect, useState} from "react";
import Header from "@/components/HomePage/Header";
import SerialsWindow from "@/components/HomePage/SrialsWindow";


export default function Page() {
    const FilmsGenresQuery = useGenres("film");
    const SerialsGenresQuery = useGenres("serial");
    const MainSliderQuery = useMainSlider();
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (FilmsGenresQuery.isSuccess && MainSliderQuery.isSuccess && SerialsGenresQuery.isSuccess) setReady(true);
    }, [FilmsGenresQuery.isSuccess, MainSliderQuery.isSuccess, SerialsGenresQuery.isSuccess]);
    return (
        <>
            {
                (ready) ? (
                    <>
                        <section id="g1" className="w-full h-[100svh] pt-8">
                            <Header/>
                            <MovieCarousel movies={MainSliderQuery.data == undefined ? [] : MainSliderQuery.data}/>
                        </section>
                        <section id="g2" className="w-full h-[100svh] pt-8">
                            <FilmsWindow
                                filmGenres={FilmsGenresQuery.data == undefined ? [] : FilmsGenresQuery.data}/>
                        </section>
                        <section id="g3" className="w-full h-[100svh] pt-8">
                            <SerialsWindow
                                serialsGenres={SerialsGenresQuery.data == undefined ? [] : SerialsGenresQuery.data}/>
                        </section>
                    </>
                ) : (
                    <div className="flex flex-col justify-center items-center w-full h-[600px] gap-3">
                        <h3 className="text-white text-md font-bold">Загрузка...</h3>
                        <div
                            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-red-600 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status">
                        <span
                            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                        >Loading...</span>
                        </div>
                    </div>
                )
            }
        </>
    );
}