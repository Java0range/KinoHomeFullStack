import Image from "next/image";
import React from "react";
import {IMovie} from "@/models/MoviesModels";
import {useRouter} from "next/navigation";



interface IProps {
    movie: IMovie
}


const FilmCart = ({ movie }: IProps) => {
    const router = useRouter();
    return (
        <div onClick={() => {router.push(`/${movie._id}`)}} className="select-none rounded-2xl hover:shadow-[0_0_15px_rgb(255,255,255)] shadow-red-600 transition-shadow duration-400]">
            <Image
                className="opacity-75 rounded-2xl pointer-events-none"
                src={movie.poster}
                alt={movie.name}
                width={600}
                height={900}
            />
        </div>
    )
};


export default FilmCart;