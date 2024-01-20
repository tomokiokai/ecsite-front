"use client";
import { useSession, SessionProvider } from "next-auth/react";
import { Auth } from '../components/Auth';

export default function Home() {
  return (
    <SessionProvider>
      <MainComponent />
    </SessionProvider>
  );
}

function MainComponent() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) {
    return <div>Loading...</div>;
  }

  const jwtToken = typeof session?.jwt === 'string' ? session.jwt : "";


  return (
    <main>
      <Auth token={jwtToken} />
    </main>
  );
}