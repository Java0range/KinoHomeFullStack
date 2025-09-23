'use client'


import {usePathname, useRouter} from "next/navigation";
import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import AuthService from "@/services/AuthService";


const Header = () => {
    const pathname = usePathname();
    const router = useRouter();

    const [isOpenMenu, setIsOpenMenu] = useState(false);

    const width = window.innerWidth;

    const isPageActive = (action: string) => {
        if (pathname === "/" && action === "Главная") {
            return "text-lg cursor-pointer hover:-translate-y-1 transition-transform text-red-600"
        } if (pathname === "/films" && action === "Фильмы") {
            return "text-lg cursor-pointer hover:-translate-y-1 transition-transform text-red-600"
        } if (pathname === "/serials" && action === "Сериалы") {
            return "text-lg cursor-pointer hover:-translate-y-1 transition-transform text-red-600"
        } else {
            return "text-lg text-white cursor-pointer hover:-translate-y-1 transition-transform"
        }
    };

    const logout = async () => {
        await AuthService.logout();
        router.push("/auth");
    }

    const height = window.innerHeight;

    return (
        <div className={`select-none flex w-full ${height > 665 && "mb-18"} ${width >= 650 ? "justify-between" : "flex-col items-center"}`}>
            {
                width >= 650 ? (
                    <>
                        <div className="group inline-flex items-center gap-3">
                            <Image
                                className="inline-flex h-8 w-8 items-center justify-center rounded bg-red-600 shadow-[0_0_24px_-6px_rgba(220,38,38,.8)]"
                                src="/KinoHomeLogo.png"
                                alt="logo"
                                width={42}
                                height={42}
                            />
                            {/*<span className="inline-flex h-8 w-8 items-center justify-center rounded bg-red-600 shadow-[0_0_24px_-6px_rgba(220,38,38,.8)]" />*/}
                            <span className="text-white text-2xl font-extrabold tracking-tight">
                            Кино<span className="text-red-600 transition-colors duration-300">Дом</span>
                        </span>
                        </div>
                        <div className="flex gap-5">
                            <Link href={"/films"}>
                                <h3 className={isPageActive("Фильмы")}>Фильмы</h3>
                            </Link>
                            <Link href={"/"}>
                                <h3 className={isPageActive("Главная")}>Главная</h3>
                            </Link>
                            <Link href={"/serials"}>
                                <h3 className={isPageActive("Сериалы")}>Сериалы</h3>
                            </Link>
                        </div>
                        <div className="w-[141px] flex justify-center">
                            <button
                                onClick={logout}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full text-lg transition-colors">
                                Выйти
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-full flex justify-center items-center">
                            <div className="flex gap-2">
                                <div className="group inline-flex items-center gap-3">
                                    <Image
                                        className="inline-flex h-8 w-8 items-center justify-center rounded bg-red-600 shadow-[0_0_24px_-6px_rgba(220,38,38,.8)]"
                                        src="/KinoHomeLogo.png"
                                        alt="logo"
                                        width={42}
                                        height={42}
                                    />
                                    {/*<span className="inline-flex h-8 w-8 items-center justify-center rounded bg-red-600 shadow-[0_0_24px_-6px_rgba(220,38,38,.8)]" />*/}
                                    <span className="text-white text-2xl font-extrabold tracking-tight">
                            Кино<span className="text-red-600 transition-colors duration-300">Дом</span>
                        </span>
                                </div>
                                <svg onClick={() => setIsOpenMenu(!isOpenMenu)} xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="size-8 text-zinc-300">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                                </svg>
                            </div>
                        </div>
                    </>
                )
            }
            {
                isOpenMenu && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <Link href={"/films"}>
                            <div
                                className="animate-fade-in w-[81px] transition-all duration-500 ease-out select-none p-1.5 rounded-xl text-white bg-red-600 flex justify-center cursor-pointer"
                            >
                                <p>Фильмы</p>
                            </div>
                        </Link>
                        <Link href={"/"}>
                            <div
                                className="animate-fade-in w-[81px] transition-all duration-500 ease-out select-none p-1.5 rounded-xl text-white bg-red-600 flex justify-center cursor-pointer"
                            >
                                <p>Главная</p>
                            </div>
                        </Link>
                        <Link href={"/serials"}>
                            <div
                                className="delay-300 animate-fade-in-2 w-[81px] transition-all duration-500 ease-out select-none p-1.5 rounded-xl text-white bg-red-600 flex justify-center cursor-pointer"
                            >
                                <p>Сериалы</p>
                            </div>
                        </Link>
                        <div
                            onClick={logout}
                            className="delay-300 animate-fade-in-2 w-[81px] transition-all duration-500 ease-out select-none p-1.5 rounded-xl text-white bg-red-600 flex justify-center cursor-pointer"
                        >
                            <p>Выйти</p>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default Header;