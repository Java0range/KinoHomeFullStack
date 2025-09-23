import Header from "@/components/HomePage/Header";
import AllSerialsWindow from "@/components/SerialsPage/AllSerialsWindow";
import {Metadata} from "next";



export const metadata: Metadata = {
    title: "Сериалы",
}



export default function SerialsPage() {
    return (
        <div>
            <div className="bg-zinc-900 fixed h-full w-full flex justify-center overflow-y-auto">
                <div className="container">
                    <div className="flex flex-col items-center pt-8">
                        <Header/>
                        <AllSerialsWindow/>
                    </div>
                </div>
            </div>
        </div>
    );
};