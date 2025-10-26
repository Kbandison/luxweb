import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

async function isClientUser(supabase: any, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .eq('role', 'client')
    .single()

  return !!data
}

export async function middleware(request: NextRequest) {
  console.log('🔥 MIDDLEWARE RUNNING - Path:', request.nextUrl.pathname)

  // Skip middleware for static files and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next()
  }

  // Handle portal routes
  if (request.nextUrl.pathname.startsWith('/portal')) {
    return await handlePortalRoutes(request)
  }

  // Only handle admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  console.log('🔥 MIDDLEWARE - Processing admin route:', request.nextUrl.pathname)

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log('🔥 MIDDLEWARE - User:', user?.email || 'Not authenticated')

    // Handle login page
    if (request.nextUrl.pathname === '/admin/login') {
      if (user) {
        console.log('🔥 MIDDLEWARE - Redirecting authenticated user to dashboard')
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
      console.log('🔥 MIDDLEWARE - Allowing access to login page')
      return supabaseResponse
    }

    // Handle setup page
    if (request.nextUrl.pathname === '/admin/setup') {
      console.log('🔥 MIDDLEWARE - Allowing access to setup page')
      return supabaseResponse
    }

    // Protect all other admin routes
    if (!user) {
      console.log('🔥 MIDDLEWARE - Redirecting unauthenticated user to login')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    console.log('🔥 MIDDLEWARE - Allowing authenticated access to:', request.nextUrl.pathname)
    return supabaseResponse

  } catch (error) {
    console.error('🔥 MIDDLEWARE ERROR:', error)
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}

async function handlePortalRoutes(request: NextRequest) {
  console.log('🔥 MIDDLEWARE - Processing portal route:', request.nextUrl.pathname)

  // TEMPORARILY BYPASS PORTAL AUTH FOR TESTING
  // TODO: Re-enable once users table is properly set up
  console.log('🔥 MIDDLEWARE - Allowing portal access (auth bypassed for testing)')
  return NextResponse.next()

  /* 
  // Original auth code - commented out for testing
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log('🔥 MIDDLEWARE - Portal User:', user?.email || 'Not authenticated')

    // Handle login page
    if (request.nextUrl.pathname === '/portal/login') {
      if (user && await isClientUser(supabase, user.id)) {
        console.log('🔥 MIDDLEWARE - Redirecting authenticated client to dashboard')
        return NextResponse.redirect(new URL('/portal/dashboard', request.url))
      }
      console.log('🔥 MIDDLEWARE - Allowing access to portal login page')
      return supabaseResponse
    }

    // Protect all other portal routes
    if (!user || !(await isClientUser(supabase, user.id))) {
      console.log('🔥 MIDDLEWARE - Redirecting unauthenticated user to portal login')
      return NextResponse.redirect(new URL('/portal/login', request.url))
    }

    console.log('🔥 MIDDLEWARE - Allowing authenticated client access to:', request.nextUrl.pathname)
    return supabaseResponse

  } catch (error) {
    console.error('🔥 MIDDLEWARE PORTAL ERROR:', error)
    return NextResponse.redirect(new URL('/portal/login', request.url))
  }
  */
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}