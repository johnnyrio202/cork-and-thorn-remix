import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isSecretMenuRoute = createRouteMatcher(['/secret-menu(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isSecretMenuRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|mp4|mov|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
