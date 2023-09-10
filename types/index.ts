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
}

