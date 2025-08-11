-- Add missing columns to project_files table for file management system

-- Add file_url column for storing public URLs from Supabase Storage
ALTER TABLE project_files ADD COLUMN IF NOT EXISTS file_url TEXT;

-- Add description column for file descriptions
ALTER TABLE project_files ADD COLUMN IF NOT EXISTS description TEXT;

-- Update file_path to be nullable in case we only have URLs
ALTER TABLE project_files ALTER COLUMN file_path DROP NOT NULL;

-- Create storage bucket policy for project-files bucket
-- Note: This would need to be run in Supabase SQL editor, not through the API

-- Create RLS policies for file access
CREATE POLICY "Users can view own files" ON project_files
  FOR SELECT USING (
    client_id IN (SELECT client_id FROM users WHERE id = auth.uid() AND role = 'client')
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Clients can upload files" ON project_files
  FOR INSERT WITH CHECK (
    client_id IN (SELECT client_id FROM users WHERE id = auth.uid() AND role = 'client')
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage all files" ON project_files
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_project_files_client_id ON project_files(client_id);
CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_project_files_is_public ON project_files(is_public);
CREATE INDEX IF NOT EXISTS idx_project_files_created_at ON project_files(created_at);
CREATE INDEX IF NOT EXISTS idx_project_files_file_type ON project_files(file_type);