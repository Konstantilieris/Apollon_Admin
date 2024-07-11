export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // Main Routes
    "/main/:path*",
    "/form/:path*",

    // Booking Routes
    "/createbooking/:path*",

    // Logistics Routes
    "/logistics/:path*",

    // Calendar Routes
    "/calendar/:path*",

    // Client Routes
    "/clients/:path*",

    // Training Routes
    "/training/:path*",

    // Expense Routes
    "/expenses/:path*",
  ],
};
