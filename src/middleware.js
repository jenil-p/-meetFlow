// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// // Define protected API routes
// const protectedRoutes = ["/api/permissions", "/api/sessions", "/api/conferences" ,"/api/papers" ,"/api/registrations" ,"/api/resources" ,"/api/rooms" ,"/api/review"];

// export async function middleware(req) {
//     const { pathname } = req.nextUrl;
//     // Apply middleware only to protected routes
//     if (protectedRoutes.some(route => pathname.startsWith(route))) {
//         const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//         // Check if user is authenticated
//         if (!token || !token.name) {
//             return NextResponse.json({ message: "Access denied" }, { status: 404 });
//         }

//         // Restrict access based on role
//         const allowedRoles = ["Jenil Sakriya"];
//         if (!allowedRoles.includes(token.name)) {
//             console.log("YOU ARE NOT ADMIN BROTHER...")
//             return NextResponse.json({ message: "Access denied" }, { status: 404 });
//         }
//     }

//     return NextResponse.next();
// }

// // Apply middleware only to API routes
// export const config = {
//     matcher: "/api/:path*",
// };













import { NextResponse } from "next/server";

const allowedOrigins = [
    "http://localhost:3000",
];

export function middleware(req) {
    const origin = req.headers.get("origin");

    console.log("Request Origin:", origin);

    // Allow same-origin requests (when Origin is null)
    if (!origin || allowedOrigins.includes(origin)) {
        return NextResponse.next();
    }

    console.log("❌ Access Denied: Unauthorized Origin");
    return NextResponse.json({ message: "Access denied" }, { status: 403 });
}
// Apply middleware to all API routes
export const config = {
    matcher: "/api/:path*",
};
