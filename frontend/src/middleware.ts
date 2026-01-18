import { NextRequest, NextResponse } from "next/server";

const ROLES = ["USER", "MODERATOR", "ADMIN"] as const;
type Role = typeof ROLES[number];

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";
const ME_URL = `${BACKEND_URL}/users/me`;
const REFRESH_URL = `${BACKEND_URL}/users/refresh`;

export async function middleware(request: NextRequest) {
    const { pathname } = new URL(request.url);
    const cookieHeader = request.headers.get("cookie") ?? "";

    const isAuthPage = pathname === "/auth";
    const isAdminPage = pathname.startsWith("/admin"); // покрывает /admin и вложенные роуты
    const protectedPages = new Set<string>(["/", "/films", "/serials"]);
    const isProtected = protectedPages.has(pathname);
    const isMoviePage = isTopLevelMoviePage(pathname); // например "/123"

    // Если страница не требует проверки — пропускаем без вызова /me
    if (!isAuthPage && !isAdminPage && !isProtected && !isMoviePage) {
        return NextResponse.next();
    }

    const { authorized, role, refreshedCookies } = await getAuthState(cookieHeader);

    // /auth — не пускаем авторизованных
    if (isAuthPage) {
        if (authorized) {
            const res = NextResponse.redirect(new URL("/", request.url));
            appendSetCookies(res, refreshedCookies);
            return res;
        }
        return NextResponse.next();
    }

    // /admin — только MODERATOR и ADMIN
    if (isAdminPage) {
        if (!authorized) {
            return redirectToAuthWithCookies(request, refreshedCookies);
        }
        if (role !== "MODERATOR" && role !== "ADMIN") {
            const res = NextResponse.redirect(new URL("/", request.url));
            appendSetCookies(res, refreshedCookies);
            return res;
        }
        const res = NextResponse.next();
        appendSetCookies(res, refreshedCookies);
        return res;
    }

    // Защищённые страницы (/, /films, /serials) и страница фильма /[movie_id]
    if (isProtected || isMoviePage) {
        if (!authorized) {
            return redirectToAuthWithCookies(request, refreshedCookies);
        }
        const res = NextResponse.next();
        appendSetCookies(res, refreshedCookies);
        return res;
    }

    // fallback
    return NextResponse.next();
}

export const config = {
    // Глобально отсекаем статику и API, остальное пускаем через middleware,
    // а уже внутри решаем — нужна проверка или нет.
    matcher: ["/((?!_next|api|.*\\..*).*)"],
};

function isTopLevelMoviePage(pathname: string): boolean {
    // Ожидаем корневой путь вида "/123" (числовой ID).
    // Исключаем известные верхнеуровневые роуты.
    if (!/^\/[^/]+$/.test(pathname)) return false;
    const segment = pathname.slice(1);
    const exclude = new Set(["auth", "admin", "films", "serials"]);
    if (exclude.has(segment)) return false;
    return /^\d+$/.test(segment); // при необходимости поменяй на свою схему ID/slug
}

async function getAuthState(cookieHeader: string): Promise<{
    authorized: boolean;
    role: Role | null;
    refreshedCookies: string[];
}> {
    try {
        // 1) Пробуем /me
        let meRes = await fetch(ME_URL, {
            headers: { cookie: cookieHeader },
            cache: "no-store",
        });

        if (meRes.ok) {
            const { permissions } = (await meRes.json()) as { permissions?: string };
            const role = ROLES.includes(permissions as Role) ? (permissions as Role) : null;
            return { authorized: !!role, role, refreshedCookies: [] };
        }

        // 2) Если 401/403 — пробуем refresh, затем повторяем /me
        if (meRes.status === 401 || meRes.status === 403) {
            const refreshRes = await fetch(REFRESH_URL, {
                method: "POST",
                headers: { cookie: cookieHeader },
                cache: "no-store",
            });

            if (!refreshRes.ok) {
                return { authorized: false, role: null, refreshedCookies: [] };
            }

            const refreshedCookies = getSetCookieArray(refreshRes.headers);
            const mergedCookieHeader = mergeCookieHeader(cookieHeader, refreshedCookies);

            meRes = await fetch(ME_URL, {
                headers: { cookie: mergedCookieHeader },
                cache: "no-store",
            });

            if (meRes.ok) {
                const { permissions } = (await meRes.json()) as { permissions?: string };
                const role = ROLES.includes(permissions as Role) ? (permissions as Role) : null;
                return { authorized: !!role, role, refreshedCookies };
            }
        }

        return { authorized: false, role: null, refreshedCookies: [] };
    } catch (e) {
        console.error(e);
        return { authorized: false, role: null, refreshedCookies: [] };
    }
}

function appendSetCookies(res: NextResponse, setCookies: string[]) {
    setCookies.forEach((c) => res.headers.append("set-cookie", c));
}

function redirectToAuthWithCookies(request: NextRequest, setCookies: string[]) {
    const res = NextResponse.redirect(new URL("/auth", request.url));
    appendSetCookies(res, setCookies);
    return res;
}

function getSetCookieArray(headers: Headers): string[] {
    const anyHeaders = headers as any;
    if (typeof anyHeaders.getSetCookie === "function") {
        return anyHeaders.getSetCookie() as string[];
    }
    const single = headers.get("set-cookie");
    return single ? [single] : [];
}

function mergeCookieHeader(originalCookie: string, setCookies: string[]) {
    const map = new Map<string, string>();

    if (originalCookie) {
        originalCookie.split(";").forEach((pair) => {
            const [name, ...rest] = pair.trim().split("=");
            if (!name) return;
            map.set(name, rest.join("="));
        });
    }

    setCookies.forEach((sc) => {
        const [nameValue] = sc.split(";"); // "name=value"
        const [name, ...rest] = nameValue.split("=");
        if (!name) return;
        map.set(name.trim(), rest.join("="));
    });

    return Array.from(map.entries())
        .map(([k, v]) => `${k}=${v}`)
        .join("; ");
}