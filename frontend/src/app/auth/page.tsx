"use client";



import Image from "next/image";
import {useState} from "react";
import {useRouter} from "next/navigation";
import AuthService from "@/services/AuthService";
import {ErrorToast} from "@/components/AuthPage/ErrorToast";
import {AxiosError, AxiosResponse} from "axios";



export default function LoginPage() {
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const [show, setShow] = useState<boolean>(false);
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const loginFetch = async () => {
    setIsLoading(true);
        await AuthService.login(login, password).then((data) => {
            if (data.status === 200 && data.data === null) {
                setIsLoading(false);
                router.push('/');
            }
        }).catch((error: AxiosError<{ detail: string}>) => {
            const errorMessage = error.response?.data?.detail || "Неизвестная ошибка";
            setOpen(true);
            setError(errorMessage);
            setIsLoading(false);
        });
    }
    return (
        <main className="relative min-h-[100dvh] w-full overflow-hidden bg-neutral-950 text-white selection:bg-red-600/30">
            <ErrorToast
                open={open}
                onClose={() => setOpen(false)}
                title="Что-то пошло не так"
                message={error}
                duration={6000}
                position="bottom-right"
                action={{
                    label: "Закрыть",
                    onClick: () => {
                        setOpen(false);
                    },
                }}
            />
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-red-600/20 blur-[140px]" />
                <div className="absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-red-600/10 blur-[120px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/60 via-neutral-950/80 to-black/90" />
                <div className="absolute inset-0 opacity-[.35] bg-[linear-gradient(110deg,rgba(220,38,38,.18)_0%,transparent_35%,rgba(220,38,38,.18)_70%,transparent_100%)] bg-[length:200%_200%] animate-bg-pan" />
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute left-10 top-10 h-64 w-64 rounded-full bg-red-600/18 blur-3xl animate-float-slow" />
                    <div className="absolute bottom-12 right-12 h-72 w-72 rounded-full bg-red-600/14 blur-3xl animate-float-slow" style={{ animationDelay: '2s' }} />
                </div>
            </div>

            <header className="relative z-10">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
                    <div className="group inline-flex items-center gap-3">
                        <Image
                            className="inline-flex h-8 w-8 items-center justify-center rounded bg-red-600 shadow-[0_0_24px_-6px_rgba(220,38,38,.8)]"
                            src="/KinoHomeLogo.png"
                            alt="logo"
                            width={42}
                            height={42}
                        />
                        <span className="text-2xl font-extrabold tracking-tight">
                            Кино<span className="text-red-600 transition-colors duration-300">Дом</span>
                        </span>
                    </div>
                    <div className="max-sm:text-center text-sm text-neutral-400/80">Смотрите фильмы без ограничений</div>
                </div>
            </header>

            <section className="relative z-10 mx-auto flex min-h-[calc(100dvh-88px)] max-w-7xl items-center justify-center px-6 pb-16">
                <div className="w-full max-w-md">
                    <div className="group relative overflow-hidden rounded-2xl border border-neutral-800/60 bg-black/60 p-8 shadow-2xl shadow-black/50 backdrop-blur-md animate-fade-in-up">
                        <div aria-hidden className="pointer-events-none absolute inset-[1px] rounded-2xl bg-gradient-to-b from-white/5 to-transparent" />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -inset-1 rounded-3xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                            style={{ background: 'radial-gradient(60% 60% at 50% 0%, rgba(220,38,38,0.25), transparent 70%)' }}
                        />

                        <h1 className="relative z-10 text-3xl font-extrabold">Вход в КиноДом</h1>
                        <p className="relative z-10 mt-2 text-neutral-400">Продолжайте смотреть любимые фильмы и сериалы</p>
                        <div className="relative z-10 mt-4 h-px w-20 origin-left bg-gradient-to-r from-red-600 to-transparent animate-grow-x" />

                        <div className="relative z-10 mt-8 space-y-6">

                            <div className="group/input relative">
                                <svg aria-hidden className="pointer-events-none absolute left-4 top-[18px] h-5 w-5 text-neutral-500 transition-colors duration-200 group-focus-within/input:text-red-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5Zm0 2c-4 0-8 2-8 6v1c0 .6.4 1 1 1h14c.6 0 1-.4 1-1v-1c0-4-4-6-8-6Z" />
                                </svg>
                                <input
                                    onChange={(e) => setLogin(e.target.value)}
                                    value={login}
                                    id="login"
                                    name="login"
                                    type="text"
                                    autoComplete="username"
                                    placeholder=" "
                                    className="peer w-full rounded-lg border border-neutral-800/80 bg-neutral-900/70 px-11 py-4 text-[15px] text-white outline-none ring-0 transition-all duration-200 placeholder:text-transparent hover:border-neutral-700 focus:border-red-600 focus:bg-neutral-900/80 focus:shadow-[0_0_0_3px_rgba(220,38,38,.15)]"
                                    required
                                />
                                <label
                                    htmlFor="login"
                                    className="pointer-events-none absolute left-11 top-2 translate-y-0 text-xs text-neutral-400 transition-all duration-200
                             peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                             peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-red-400"
                                >
                                    Логин
                                </label>
                            </div>

                            <div className="group/input relative">
                                <svg
                                    aria-hidden
                                    className="pointer-events-none absolute left-4 top-[18px] h-5 w-5 text-neutral-500 transition-colors duration-200 group-focus-within/input:text-red-500"
                                    viewBox="0 0 24 24" fill="currentColor"
                                >
                                    <path
                                        d="M17 9h-1V7A4 4 0 0 0 7 7v2H6a1 1 0 0 0-1 1v10c0 .6.4 1 1 1h11a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1Zm-8-2a3 3 0 0 1 6 0v2H9V7Zm6 11H7v-6h8v6Z"/>
                                </svg>

                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    id="password"
                                    name="password"
                                    type={show ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    placeholder=" "
                                    className="peer w-full rounded-lg border border-neutral-800/80 bg-neutral-900/70 px-11 py-4 text-[15px] text-white outline-none ring-0 transition-all duration-200 placeholder:text-transparent hover:border-neutral-700 focus:border-red-600 focus:bg-neutral-900/80 focus:shadow-[0_0_0_3px_rgba(220,38,38,.15)]"
                                    required
                                />

                                <label
                                    htmlFor="password"
                                    className="pointer-events-none absolute left-11 top-2 translate-y-0 text-xs text-neutral-400 transition-all duration-200
                   peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                   peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-red-400"
                                >
                                    Пароль
                                </label>

                                <button
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()} // сохраняем фокус на инпуте
                                    onClick={() => setShow((s) => !s)}
                                    aria-label={show ? 'Скрыть пароль' : 'Показать пароль'}
                                    aria-pressed={show}
                                    title={show ? 'Скрыть пароль' : 'Показать пароль'}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-neutral-500 transition-colors hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-red-600/60"
                                >
                                    {show ? <EyeOffIcon/> : <EyeIcon/>}
                                </button>
                            </div>

                            <button
                                onClick={loginFetch}
                                disabled={isLoading}
                                type="submit"
                                className="group relative mt-2 w-full overflow-hidden rounded-lg bg-red-600 px-4 py-3.5 text-center font-semibold text-white shadow-[0_10px_30px_-10px_rgba(220,38,38,.7)] transition-all duration-300 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600/60"
                            >
                                <span className="relative z-10">Войти</span>
                                <span
                                    className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(120deg,transparent,rgba(255,255,255,.25),transparent)] transition-transform duration-700 group-hover:translate-x-full"/>
                            </button>
                            <p className="text-center text-sm text-neutral-500">
                                Нажимая «Войти», вы соглашаетесь с правилами использования КиноДом
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-xs text-neutral-500">
                        © {new Date().getFullYear()} КиноДом. Все права защищены.
                    </div>
                </div>
            </section>
        </main>
    )
}


function EyeIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_0_6px_rgba(0,0,0,.2)]">
            <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Z"
                  stroke="currentColor" strokeWidth="1.6"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/>
        </svg>
    )
}

function EyeOffIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_0_6px_rgba(0,0,0,.2)]">
            <path
                d="M3 3l18 18M10.58 10.58A3 3 0 0 0 12 15a3 3 0 0 0 2.42-4.42M9.88 5.09A10.8 10.8 0 0 1 12 5c5 0 9.27 3.11 11 7-.66 1.48-1.68 2.83-2.95 3.95M6.1 6.1A11.26 11.26 0 0 0 1 12c.66 1.48 1.68 2.83 2.95 3.95A12 12 0 0 0 12 19c1.06 0 2.08-.14 3.04-.41"
                stroke="currentColor" strokeWidth="1.6"/>
        </svg>
    )
}