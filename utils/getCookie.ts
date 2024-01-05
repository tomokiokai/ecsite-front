import { cookies,headers  } from 'next/headers';

export const getSpecificCookies = (): { token: string | null, csrfToken: string | null } => {
  const requestHeaders = headers();
  console.log("requestHeaders:", requestHeaders);
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();
  console.log("allCookies:", allCookies);
  // 特定のクッキーの値を取得
  const token = allCookies.find(cookie => cookie.name === 'token')?.value || null;
  const csrfToken = allCookies.find(cookie => cookie.name === '_csrf')?.value || null;

  return { token, csrfToken };
};