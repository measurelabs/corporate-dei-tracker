import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const API_KEY = process.env.API_KEY || ''  // Server-side only, not NEXT_PUBLIC
const API_VERSION = 'v1'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await params
  return proxyRequest(request, proxy, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await params
  return proxyRequest(request, proxy, 'POST')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await params
  return proxyRequest(request, proxy, 'PUT')
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await params
  return proxyRequest(request, proxy, 'PATCH')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await params
  return proxyRequest(request, proxy, 'DELETE')
}

async function proxyRequest(
  request: NextRequest,
  proxyPath: string[],
  method: string
) {
  try {
    // Construct the target URL
    const path = proxyPath.join('/')
    const searchParams = request.nextUrl.searchParams.toString()
    const targetUrl = `${API_URL}/${API_VERSION}/${path}${searchParams ? `?${searchParams}` : ''}`

    console.log('Proxy request:', {
      method,
      path,
      targetUrl,
      hasApiKey: !!API_KEY
    })

    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Add API key if available (server-side only)
    if (API_KEY) {
      headers['X-API-Key'] = API_KEY
      console.log('Adding API key to request headers')
    } else {
      console.error('WARNING: No API_KEY found in environment variables!')
    }

    // Prepare request options
    const options: RequestInit = {
      method,
      headers,
    }

    // Add body for POST, PUT, PATCH requests
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        const body = await request.json()
        options.body = JSON.stringify(body)
      } catch {
        // No body or invalid JSON
      }
    }

    // Make the request to the backend API
    const response = await fetch(targetUrl, options)

    // Log details for debugging commitment/controversy issues
    if (path.includes('commitments') || path.includes('controversies')) {
      console.log('Special endpoint debug:', {
        path,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      })
    }

    // Get response data
    const data = await response.json()

    // Return response with appropriate status
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
