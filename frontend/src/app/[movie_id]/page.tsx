import MoviePageComponent from "@/components/MoviePage/MoviePageComponent";



type Params = { movie_id: string }



export default async function MoviePage({ params }: { params: Promise<Params> }) {
    const { movie_id } = await params;
    return (
        <MoviePageComponent movie_id={movie_id}/>
    )
}