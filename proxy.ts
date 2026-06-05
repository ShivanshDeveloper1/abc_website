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
  "/api/(.*)" // This opens up all API endpoints like /api/quiz and /api/leaderboard
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect(); // Only protect dashboard or admin pages
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