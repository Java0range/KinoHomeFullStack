import HomePage from "@/components/HomePage/HomePage";
import {Metadata} from "next";


export const metadata: Metadata = {
    title: "Главная | КиноДом"
}



export default function MainAppPage() {
    return (
        <HomePage/>
    );
}