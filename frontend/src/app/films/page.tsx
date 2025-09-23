import Header from "@/components/HomePage/Header";
import AllFilmsWindow from "@/components/FilmsPage/AllFilmsWindow";
import {Metadata} from "next";



export const metadata: Metadata = {
    title: "Фильмы",
}



export default function FilmsPage() {
    return (
        <div>
            <div className="bg-zinc-900 fixed h-full w-full flex justify-center overflow-y-auto">
                <div className="container">
                    <div className="flex flex-col items-center pt-8">
                        <Header/>
                        <AllFilmsWindow/>
                    </div>
                </div>
            </div>
        </div>
    );
};