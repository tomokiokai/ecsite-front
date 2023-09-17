import { Todo } from '../components/Todo';
import { cookies } from 'next/headers';

export default function TodoList() {
  const cookieStore = cookies();
  const csrfToken = cookieStore.get('csrfToken');  // 'csrfToken'という名前のCookieを取得
  
  return (
    <main>
      <Todo csrfToken={csrfToken?.value || ""} />
    </main>
  );
}

