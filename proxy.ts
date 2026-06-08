import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define all routes that Google and normal users should be able to see without logging in
const isPublicRoute = createRouteMatcher([
  "/",
  "/about-us(.*)",
  "/contact(.*)",
  "/courses(.*)",
  "/blog(.*)",
  "/test-series(.*)",
  "/neet(.*)",
  "/jee(.*)",
  "/login",
  "/register(.*)",
  "/academic(.*)",
  "/store(.*)",
  "/api/(.*)" ,// This opens up all API endpoints like /api/quiz and /api/leaderboard
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico"
]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // allow system files always
  if (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/favicon.ico"
  ) {
    return;
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};