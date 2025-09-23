import { type NextRequest, NextResponse} from "next/server";



const userPermissions = ["USER", "MODERATOR", "ADMIN"]
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000'



export async function middleware(request: NextRequest) {
    try {
        const userResponse = await fetch(`${BACKEND_URL}/users/me`, {
            headers: {
                cookie: request.headers.get('cookie') ?? '',
            },
            cache: 'no-store'
        })
        if (!userResponse.ok) {
            return redirectToAuth(request)
        }

        const { permissions } = (await userResponse.json()) as { permissions?: string }

        if (permissions && userPermissions.includes(permissions)) {
            return NextResponse.next();
        } else {
            return redirectToAuth(request);
        }
    } catch (err) {
        console.log(err);
        return redirectToAuth(request);
    }
}


export const config = {
    matcher: ["/", "/films", "/serials"]
}


function redirectToAuth(request: NextRequest) {
    const url = new URL('/auth', request.url)
    return NextResponse.redirect(url)
}