import type { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';
import type { JWT, Session, User } from "next-auth";

// NextAuthの設定
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "string" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;
        try {
          // ログインリクエストをバックエンドの新しいエンドポイントに送信
          const loginResponse = await axios.post(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password
          }, {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          });
          
          const data = loginResponse.data;
          // console.log('loginResponseData:',data)
          if (data && data.jwt) {
            return { jwt: data.jwt, id: data.user.id, name: data.user.name, email: data.user.email };
          }
        } catch (error) {
          console.error('Authentication error:', error);
        }
        return null;
      }
    }),
    // GitHub OAuthプロバイダの追加
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // Google OAuthプロバイダの追加
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account!.provider === "github" || account!.provider === "google") {
        try {
          // ユーザー情報をバックエンドに送信して、新規登録または更新
          const response = await axios.post(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/auth/signup`, {
            email: user.email,
            name: user.name,
            // その他必要な情報
          });

          if (response.status === 200) {
            // バックエンドからの応答に基づいて、カスタムトークンを設定
            user.jwt = response.data.jwt;
            user.id = response.data.user.id;
            
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }

      // GitHub または Google 以外の認証方法の場合は、通常通り処理を続行
      return true;
    },
    async jwt({ token, user }) {
      if (user?.jwt) {
        token.jwt = user.jwt; // カスタムJWTトークンをセッショントークンに追加
        token.id = user.id; // ユーザーIDをセッショントークンに追加
        token.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
      }
      return token;
    },
    async session({ session, token }) {
    if (token.jwt) {
      session.jwt = token.jwt;
      if (token.id) { // トークンにidがある場合のみ、セッションのuserにidを追加
        session.user.id = token.id;
      }
      }
      return session;
    },
  },
  // その他のオプションが必要な場合はここに追加
};
