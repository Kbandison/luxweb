-- Secure RLS policies that work with current authentication setup
-- This maintains security while allowing proper admin access

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Enable all access for service role" ON clients;
DROP POLICY IF EXISTS "Enable all access for service role" ON contact_submissions;
DROP POLICY IF EXISTS "Enable all access for service role" ON projects;
DROP POLICY IF EXISTS "Enable all access for service role" ON project_milestones;
DROP POLICY IF EXISTS "Enable all access for service role" ON invoices;
DROP POLICY IF EXISTS "Enable all access for service role" ON payments;
DROP POLICY IF EXISTS "Enable all access for service role" ON client_communications;
DROP POLICY IF EXISTS "Enable all access for service role" ON project_files;
DROP POLICY IF EXISTS "Enable all access for service role" ON contracts;
DROP POLICY IF EXISTS "Enable all access for service role" ON client_questionnaires;
DROP POLICY IF EXISTS "Enable all access for service role" ON notifications;

-- Create secure policies that work with our authentication system
-- Admin access through service role (server-side API calls only)
-- Service role automatically bypasses RLS, so we don't need explicit policies for it

-- For authenticated admin users (when using regular client)
CREATE POLICY "Admin access via service role" ON clients FOR ALL 
USING (current_setting('role') = 'service_role')
WITH CHECK (current_setting('role') = 'service_role');

CREATE POLICY "Admin access via service role" ON contact_submissions FOR ALL 
USING (current_setting('role') = 'service_role')
WITH CHECK (current_setting('role') = 'service_role');

CREATE POLICY "Admin access via service role" ON projects FOR ALL 
USING (current_setting('role') = 'service_role')
WITH CHECK (current_setting('role') = 'service_role');

CREATE POLICY "Admin access via service role" ON project_milestones FOR ALL 
USING (current_setting('role') = 'service_role')
WITH CHECK (current_setting('role') = 'service_role');

CREATE POLICY "Admin access via service role" ON invoices FOR ALL 
USING (current_setting('role') = 'service_role')
WITH CHECK (current_setting('role') = 'service_role');

CREATE POLICY "Admin access via service role" ON payments FOR ALL 
USING (current_setting('role') = 'service_role')
WITH CHECK (current_setting('role') = 'service_role');

CREATE POLICY "Admin access via service role" ON client_communications FOR ALL 
USING (current_setting('role') = 'service_role')
WITH CHECK (current_setting('role') = 'service_role');

CREATE POLICY "Admin access via service role" ON project_files FOR ALL 
USING (current_setting('role') = 'service_role')
WITH CHECK (current_setting('role') = 'service_role');

CREATE POLICY "Admin access via service role" ON contracts FOR ALL 
USING (current_setting('role') = 'service_role')
WITH CHECK (current_setting('role') = 'service_role');

CREATE POLICY "Admin access via service role" ON client_questionnaires FOR ALL 
USING (current_setting('role') = 'service_role')
WITH CHECK (current_setting('role') = 'service_role');

CREATE POLICY "Admin access via service role" ON notifications FOR ALL 
USING (current_setting('role') = 'service_role')
WITH CHECK (current_setting('role') = 'service_role');

-- Client portal access (restrictive - clients can only see their own data)
CREATE POLICY "Clients see own data" ON clients FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND client_id = clients.id AND role = 'client')
);

CREATE POLICY "Clients see own projects" ON projects FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND client_id = projects.client_id AND role = 'client')
);

CREATE POLICY "Clients see own files" ON project_files FOR SELECT USING (
  is_public = true AND 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND client_id = project_files.client_id AND role = 'client')
);

-- Public access for contact form submissions (from website)
CREATE POLICY "Allow contact form submissions" ON contact_submissions FOR INSERT 
WITH CHECK (true);

-- This ensures only these specific access patterns are allowed:
-- 1. Service role (server-side admin operations) - full access
-- 2. Client portal users - only their own data
-- 3. Public - only contact form submissions