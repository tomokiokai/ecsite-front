import { cookies } from 'next/headers'
import { NextRequest } from "next/server";
 
export async function GET(request: NextRequest) {
  console.log("request:", request);
  console.log("request.cookies:", request.cookies);
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  const csrfToken = cookieStore.get('_csrf')

  const headers = new Headers();
headers.append('Set-Cookie', `token=${token?.value}`);
  headers.append('Set-Cookie', `_csrf=${csrfToken?.value}`);
  console.log("api_headers:", headers);
 
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: headers,
  })
}