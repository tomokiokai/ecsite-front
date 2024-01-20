import type { NextAuthOptions } from "next-auth"
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
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.jwt) {
        token.jwt = user.jwt; // カスタムJWTトークンをセッショントークンに追加
      }
      return token;
    },
    async session({ session, token }) {
      if (token.jwt) {
        session.jwt = token.jwt; // カスタムJWTトークンをセッションオブジェクトに追加
      }
      return session;
    },
  },
  // その他のオプションが必要な場合はここに追加
};
