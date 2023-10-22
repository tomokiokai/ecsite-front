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

