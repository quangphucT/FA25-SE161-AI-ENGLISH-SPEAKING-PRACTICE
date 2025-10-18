import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const pathName = request.nextUrl.pathname;

  // Nếu không có token và đang truy cập dashboard → redirect về login
  if (!accessToken && pathName.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (accessToken) {
    try {
      const base64 = accessToken.split(".")[1];
      const decodedPayload = JSON.parse(
        Buffer.from(base64, "base64").toString()
      );
      const role =
        decodedPayload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      console.log("Role:", role);

      // Nếu có token mà vẫn truy cập auth pages → redirect dashboard
      if (["/sign-in", "/sign-up", "/forgot-password"].includes(pathName)) {
        return NextResponse.redirect(
          new URL(`/dashboard-${role?.toLowerCase()}-layout`, request.url)
        );
      }

      // Check role với dashboard route
      if (pathName.startsWith("/dashboard-admin-layout") && role !== "ADMIN") {
        return NextResponse.redirect(
          new URL(`/dashboard-${role?.toLowerCase()}-layout`, request.url)
        );
      }

      if (
        pathName.startsWith("/dashboard-reviewer-layout") &&
        role !== "REVIEWER"
      ) {
        return NextResponse.redirect(
          new URL(`/dashboard-${role?.toLowerCase()}-layout`, request.url)
        );
      }

      if (pathName.startsWith("/dashboard-learner-layout") && role !== "LEARNER") {
        return NextResponse.redirect(
          new URL(`/dashboard-${role?.toLowerCase()}-layout`, request.url)
        );
      }
    } catch (err) {
      // Nếu token bị malformed → redirect login
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/dashboard-admin-layout/:path*",
    "/dashboard-reviewer-layout/:path*",
    "/dashboard-learner-layout/:path*",
  ],
};
