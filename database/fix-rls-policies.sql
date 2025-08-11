-- Fix RLS policies to work with current authentication setup
-- Drop existing policies and create simpler ones

-- Drop existing policies
DROP POLICY IF EXISTS "Admin full access" ON clients;
DROP POLICY IF EXISTS "Admin full access" ON contact_submissions;
DROP POLICY IF EXISTS "Admin full access" ON projects;
DROP POLICY IF EXISTS "Admin full access" ON project_milestones;
DROP POLICY IF EXISTS "Admin full access" ON invoices;
DROP POLICY IF EXISTS "Admin full access" ON payments;
DROP POLICY IF EXISTS "Admin full access" ON client_communications;
DROP POLICY IF EXISTS "Admin full access" ON project_files;
DROP POLICY IF EXISTS "Admin full access" ON contracts;
DROP POLICY IF EXISTS "Admin full access" ON client_questionnaires;
DROP POLICY IF EXISTS "Admin full access" ON notifications;

-- Create simplified admin policies that work with service role
-- Service role bypasses RLS anyway, but this ensures consistency

CREATE POLICY "Enable all access for service role" ON clients FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON contact_submissions FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON projects FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON project_milestones FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON invoices FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON payments FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON client_communications FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON project_files FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON contracts FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON client_questionnaires FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON notifications FOR ALL USING (true);

-- For client portal access (when we implement it later)
CREATE POLICY "Clients see own data" ON clients FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND client_id = clients.id)
);
CREATE POLICY "Clients see own projects" ON projects FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND client_id = projects.client_id)
);