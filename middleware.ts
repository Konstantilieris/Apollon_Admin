export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/main/:path*",
    "/form/:path*",

    "/createbooking/:path*",
    "/logistics/:path*",
    "/calendar/:path*",
    "/clients/:path*",
    "/training/:path*",

    "/expenses/:path*",
  ],
};
