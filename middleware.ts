export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // Main Routes
    "/main/:path*",
    "/form/:path*",

    // Booking Routes
    "/booking/:path*",

    // Logistics Routes
    "/logistics/:path*",

    // Calendar Routes
    "/calendar/:path*",

    // Client Routes
    "/clients/:path*",

    // Training Routes
    "/training/:path*",
    // payments
    "/payments/:path*",
    // services
    "/services/:path*",
    // Expense Routes
    "/expenses/:path*",
  ],
};
