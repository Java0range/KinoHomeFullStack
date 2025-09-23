


type Params = { movie_id: string }


export default async function MoviePage({ params }: { params: Promise<Params> }) {
    const { movie_id } = await params;
    return (
        <div>
            {movie_id}
        </div>
    )
}