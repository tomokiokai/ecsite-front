import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const userInfoObj = cookieStore.get("userInfo");

  console.log("userInfo : ", userInfoObj);
  
  const userInfo = userInfoObj?.value;

  return NextResponse.json({ userInfo: userInfo });
}
