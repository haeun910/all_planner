import { supabase } from './supabase';
import type { DbCategory, DbTodo, DbSubtask, DbNote, DbSettings, DbMonthlyGoal, DbDDay } from './supabase';

// ────────────────────────────────────────────────
// Categories
// ────────────────────────────────────────────────
export async function fetchCategories(userId: string): Promise<DbCategory[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

export async function createCategory(userId: string, name: string, color: string, sortOrder = 0): Promise<DbCategory> {
  const { data, error } = await supabase
    .from('categories')
    .insert({ user_id: userId, name, color, sort_order: sortOrder })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, updates: Partial<Pick<DbCategory, 'name' | 'color' | 'sort_order'>>): Promise<void> {
  const { error } = await supabase.from('categories').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// ────────────────────────────────────────────────
// Todos (with subtasks joined)
// ────────────────────────────────────────────────
export async function fetchTodos(userId: string): Promise<DbTodo[]> {
  const { data, error } = await supabase
    .from('todos')
    .select('*, subtasks(*)')
    .eq('user_id', userId)
    .order('sort_order')
    .order('created_at', { referencedTable: 'subtasks', ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createTodo(
  userId: string,
  fields: { title: string; completed?: boolean; category_id?: string | null; date?: string | null; start_time?: string | null; notes?: string }
): Promise<DbTodo> {
  const { data, error } = await supabase
    .from('todos')
    .insert({ user_id: userId, ...fields })
    .select('*, subtasks(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function updateTodo(
  id: string,
  updates: Partial<Pick<DbTodo, 'title' | 'completed' | 'category_id' | 'date' | 'start_time' | 'notes' | 'sort_order'>>
): Promise<void> {
  const { error } = await supabase.from('todos').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteTodo(id: string): Promise<void> {
  const { error } = await supabase.from('todos').delete().eq('id', id);
  if (error) throw error;
}

// ────────────────────────────────────────────────
// Subtasks
// ────────────────────────────────────────────────
export async function createSubtask(todoId: string, title: string): Promise<DbSubtask> {
  const { data, error } = await supabase
    .from('subtasks')
    .insert({ todo_id: todoId, title })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSubtask(id: string, updates: Partial<Pick<DbSubtask, 'title' | 'completed'>>): Promise<void> {
  const { error } = await supabase.from('subtasks').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteSubtask(id: string): Promise<void> {
  const { error } = await supabase.from('subtasks').delete().eq('id', id);
  if (error) throw error;
}

export async function replaceSubtasks(todoId: string, subtasks: { title: string; completed: boolean }[]): Promise<DbSubtask[]> {
  await supabase.from('subtasks').delete().eq('todo_id', todoId);
  if (subtasks.length === 0) return [];
  const rows = subtasks.map((s, i) => ({ todo_id: todoId, title: s.title, completed: s.completed, sort_order: i }));
  const { data, error } = await supabase.from('subtasks').insert(rows).select();
  if (error) throw error;
  return data ?? [];
}

// ────────────────────────────────────────────────
// Notes
// ────────────────────────────────────────────────
export async function fetchNotes(userId: string): Promise<DbNote[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createNote(userId: string, title: string, content: string): Promise<DbNote> {
  const { data, error } = await supabase
    .from('notes')
    .insert({ user_id: userId, title, content })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateNote(id: string, updates: Partial<Pick<DbNote, 'title' | 'content'>>): Promise<void> {
  const { error } = await supabase.from('notes').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw error;
}

// ────────────────────────────────────────────────
// Settings
// ────────────────────────────────────────────────
export async function fetchSettings(userId: string): Promise<DbSettings | null> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data ?? null;
}

export async function upsertSettings(userId: string, updates: Partial<Pick<DbSettings, 'theme' | 'default_screen' | 'notifications'>>): Promise<void> {
  const { error } = await supabase
    .from('user_settings')
    .upsert({ user_id: userId, ...updates }, { onConflict: 'user_id' });
  if (error) throw error;
}

// ────────────────────────────────────────────────
// Monthly Goals
// ────────────────────────────────────────────────
export async function fetchMonthlyGoals(userId: string): Promise<DbMonthlyGoal[]> {
  const { data, error } = await supabase
    .from('monthly_goals')
    .select('*')
    .eq('user_id', userId)
    .order('month')
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

export async function createMonthlyGoal(userId: string, month: string, title: string): Promise<DbMonthlyGoal> {
  const { data, error } = await supabase
    .from('monthly_goals')
    .insert({ user_id: userId, month, title })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateMonthlyGoal(id: string, updates: Partial<Pick<DbMonthlyGoal, 'title' | 'completed'>>): Promise<void> {
  const { error } = await supabase.from('monthly_goals').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteMonthlyGoal(id: string): Promise<void> {
  const { error } = await supabase.from('monthly_goals').delete().eq('id', id);
  if (error) throw error;
}

// ────────────────────────────────────────────────
// D-Days
// ────────────────────────────────────────────────
export async function fetchDDays(userId: string): Promise<DbDDay[]> {
  const { data, error } = await supabase
    .from('ddays')
    .select('*')
    .eq('user_id', userId)
    .order('target_date');
  if (error) throw error;
  return data ?? [];
}

export async function createDDay(userId: string, title: string, targetDate: string): Promise<DbDDay> {
  const { data, error } = await supabase
    .from('ddays')
    .insert({ user_id: userId, title, target_date: targetDate })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDDay(id: string): Promise<void> {
  const { error } = await supabase.from('ddays').delete().eq('id', id);
  if (error) throw error;
}
