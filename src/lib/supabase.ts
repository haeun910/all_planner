import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !key) {
  throw new Error(
    '.env 파일에 VITE_SUPABASE_URL 과 VITE_SUPABASE_ANON_KEY 를 설정해 주세요.\n' +
    '.env.example 파일을 참고하세요.'
  );
}

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// ────────────────────────────────────────────────
// DB 타입 (Supabase 반환 행 기준)
// ────────────────────────────────────────────────
export interface DbCategory {
  id: string;
  user_id: string;
  name: string;
  color: string;
  is_default: boolean;
  sort_order: number;
  created_at: string;
}

export interface DbSubtask {
  id: string;
  todo_id: string;
  title: string;
  completed: boolean;
  sort_order: number;
  created_at: string;
}

export interface DbTodo {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  category_id: string | null;
  date: string | null;
  start_time: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  subtasks?: DbSubtask[];
}

export interface DbNote {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface DbMonthlyGoal {
  id: string;
  user_id: string;
  month: string;
  title: string;
  completed: boolean;
  sort_order: number;
  created_at: string;
}

export interface DbDDay {
  id: string;
  user_id: string;
  title: string;
  target_date: string;
  created_at: string;
}

export interface DbSettings {
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  default_screen: 'today' | 'calendar' | 'all' | 'notes';
  notifications: boolean;
  updated_at: string;
}
