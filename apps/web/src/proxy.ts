import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/login")) {
    if (accessToken || refreshToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!accessToken && !refreshToken) {
    return clearCookieAndRedirect(request.url);
  }

  try {
    const resMe = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (resMe.status !== 401) return NextResponse.next();

    const resRefresh = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (resRefresh.status === 401) {
      console.log("resRefresh.status 401");
      return clearCookieAndRedirect(request.url);
    }

    const response = NextResponse.next();

    const setCookie = resRefresh.headers.getSetCookie();
    if (setCookie && setCookie.length > 0) {
      setCookie.forEach((cookie) => {
        response.headers.append("Set-Cookie", cookie);
      });
    }

    return response;
  } catch (error) {}
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

function clearCookieAndRedirect(url: string) {
  const redirectResponse = NextResponse.redirect(new URL("/login", url));
  redirectResponse.cookies.delete("accessToken");
  redirectResponse.cookies.delete("refreshToken");
  return redirectResponse;
}
