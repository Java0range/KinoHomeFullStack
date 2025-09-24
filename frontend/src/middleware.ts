import { NextRequest, NextResponse } from "next/server";

const userPermissions = ["USER", "MODERATOR", "ADMIN"] as const;
const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";
const ME_URL = `${BACKEND_URL}/users/me`;
const REFRESH_URL = `${BACKEND_URL}/users/refresh`;


export async function middleware(request: NextRequest) {
    const cookieHeader = request.headers.get("cookie") ?? "";

    try {
        let meRes = await fetch(ME_URL, {
            headers: { cookie: cookieHeader },
            cache: "no-store",
        });

        if (meRes.ok) {
            const { permissions } = (await meRes.json()) as { permissions: string };
            if (permissions && userPermissions.includes(permissions as any)) {
                return NextResponse.next();
            }
            return redirectToAuth(request);
        }

        if (meRes.status === 401 || meRes.status === 403) {
            const refreshRes = await fetch(REFRESH_URL, {
                method: "POST",
                headers: { cookie: cookieHeader },
                cache: "no-store",
            });

            if (!refreshRes.ok) {
                return redirectToAuth(request);
            }

            const res = NextResponse.next();
            const refreshedCookies = getSetCookieArray(refreshRes.headers);
            refreshedCookies.forEach((c) => res.headers.append("set-cookie", c));

            const cookieForRetry = mergeCookieHeader(cookieHeader, refreshedCookies);
            meRes = await fetch(ME_URL, {
                headers: { cookie: cookieForRetry },
                cache: "no-store",
            });

            if (meRes.ok) {
                const { permissions } = (await meRes.json()) as { permissions: string };
                if (permissions && userPermissions.includes(permissions as any)) {
                    return res; // пускаем дальше, уже с обновлёнными куками на клиенте
                }
            }

            return redirectToAuth(request);
        }

        return redirectToAuth(request);
    } catch (e) {
        console.error(e);
        return redirectToAuth(request);
    }
}

export const config = {
    matcher: ["/", "/films", "/serials"],
};

function redirectToAuth(request: NextRequest) {
    const url = new URL("/auth", request.url);
    return NextResponse.redirect(url);
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