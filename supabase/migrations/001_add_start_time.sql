-- Add start_time column to todos table
ALTER TABLE public.todos ADD COLUMN IF NOT EXISTS start_time TEXT DEFAULT NULL;
