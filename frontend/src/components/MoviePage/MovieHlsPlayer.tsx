"use client";



import { MediaPlayer, MediaProvider, Controls } from '@vidstack/react';
import { PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr';
import {useEffect, useState} from "react";



interface Props {
    title: string,
    src: string,
    series_count: number
}



const MovieHlsPlayer = ( { title, src, series_count }: Props) => {
    const [selectSeries, setSelectSeries] = useState(1);
    const [srcUrl, setSrcUrl] = useState(`${src}/${selectSeries}/index.m3u8`);
    const [isSelectSeriesMenu, setIsSelectSeriesMenu] = useState(false);
    useEffect(() => {
        if (series_count === 0) {
            setSelectSeries(0);
        } else {
            setSelectSeries(1);
        }
        setSrcUrl(`${src}/${selectSeries}/index.m3u8`);
        console.log(selectSeries)
    }, [])

    useEffect(() => {
        setSrcUrl(`${src}/${selectSeries}/index.m3u8`);
        console.log(selectSeries)
    }, [selectSeries])
    return (
        <MediaPlayer className="releative mt-8 shadow-[0_0_14px_rgb(255,255,255)] shadow-red-600"
                     title={title} src={srcUrl}>
            {
                series_count != 0 && (
                    <Controls.Root className="data-[visible]:opacity-100 opacity-0 transition-opacity">
                        <Controls.Group>
                            <div className="absolute top-5 left-5 z-10">
                                <button onClick={() => setIsSelectSeriesMenu(!isSelectSeriesMenu)} className="text-white bg-red-600 hover:bg-red-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center transition-colors"
                                        type="button">Эпизоды <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true"
                                                                   xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                   viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="m1 1 4 4 4-4"/>
                                </svg>
                                </button>

                                <div
                                    className={`z-10 bg-zinc-900 divide-y divide-gray-100 rounded-lg shadow-sm w-44 overflow-y-auto max-h-[420px] transition-all duration-300 ${isSelectSeriesMenu ? "opacity-100 translate-y-2" : "opacity-0"}`}>
                                    <ul className="py-2 text-sm text-red-600"
                                        aria-labelledby="dropdownDefaultButton">
                                        {
                                            Array.from({length: series_count},
                                                (_, index) => index + 1).map(number => (
                                                <li onClick={() => {setSelectSeries(number)}} key={number}>
                                                    <p className="block px-4 py-2 hover:bg-zinc-800">Эпизод: {number}</p>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </Controls.Group>
                    </Controls.Root>
                )
            }
            <MediaProvider/>
            <PlyrLayout icons={plyrLayoutIcons}/>
        </MediaPlayer>
    );
}


export default MovieHlsPlayer;