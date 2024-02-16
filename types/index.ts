export type Task = {
  id: number;
  title: string;
  created_at: Date;
  updated_at: Date;
}

export type Blog = {
  id: number;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  user_id: number;
}

export type CsrfToken = {
  csrf_token: string;
}

export type Credential = {
  email: string;
  password: string;
  name?: string;
}

export type Shop = {
  id: number;
  imageUrl: string;
  name: string;
  description: string;
  area: string;
  address: string;
  genre: string;
  reservationDate?: string;
  // onClick: (id: number) => void;
};

export type BookType = {
  id: number;
  title: string;
  price: number;
  content: string;
  image: { url: string };
  created_at: string;
  updated_at: string;
};

export type Purchase = {
  id: string;
  userId: string;
  bookId: string;
  sessionId: string;
  createdAt: string;
};

export interface CustomUser {
  id: string; // または必要に応じて他の識別子
  name: string;
  email: string;
  jwtToken: string; // カスタムプロパティ
  // その他必要に応じて追加するプロパティ
}

import "next-auth";
import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    id?: string | number; // 'id' プロパティをオプショナルとして追加
  }
}

declare module "next-auth" {
  /**
   * ユーザー型の拡張。
   */
  interface User {
    id?: string | number;
    jwt: string;
  }

  /**
   * セッション型の拡張。
   */
  interface Session {
    user: User;
    jwt: JWT;
  }

  /**
   * JWTトークン型の拡張。
   */
  interface JWT {
    jwt?: string;
    id?: string | number;
  }
}