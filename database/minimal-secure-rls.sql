-- Minimal, secure RLS approach
-- Service role bypasses RLS automatically, so we only need policies for client access

-- Drop all existing policies to start clean
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
DROP POLICY IF EXISTS "Admin access via service role" ON clients;
DROP POLICY IF EXISTS "Admin access via service role" ON contact_submissions;
DROP POLICY IF EXISTS "Admin access via service role" ON projects;
DROP POLICY IF EXISTS "Admin access via service role" ON project_milestones;
DROP POLICY IF EXISTS "Admin access via service role" ON invoices;
DROP POLICY IF EXISTS "Admin access via service role" ON payments;
DROP POLICY IF EXISTS "Admin access via service role" ON client_communications;
DROP POLICY IF EXISTS "Admin access via service role" ON project_files;
DROP POLICY IF EXISTS "Admin access via service role" ON contracts;
DROP POLICY IF EXISTS "Admin access via service role" ON client_questionnaires;
DROP POLICY IF EXISTS "Admin access via service role" ON notifications;
DROP POLICY IF EXISTS "Clients see own data" ON clients;
DROP POLICY IF EXISTS "Clients see own projects" ON projects;
DROP POLICY IF EXISTS "Clients see own files" ON project_files;

-- Update client status default to "lead" instead of "active"
ALTER TABLE clients ALTER COLUMN status SET DEFAULT 'lead';

-- Update the status constraint to include "lead"
ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_status_check;
ALTER TABLE clients ADD CONSTRAINT clients_status_check 
CHECK (status IN ('lead', 'active', 'inactive', 'archived'));

-- ==========================================
-- SECURE APPROACH: 
-- 1. Service role bypasses RLS (admin access through API)
-- 2. Only create policies for client portal access (future)
-- 3. Allow public contact form submissions
-- ==========================================

-- Allow public contact form submissions from website
CREATE POLICY "Allow public contact submissions" ON contact_submissions 
FOR INSERT WITH CHECK (true);

-- Client portal policies (for future implementation)
-- Clients can only see their own data when logged in through client portal
CREATE POLICY "Clients read own data" ON clients 
FOR SELECT USING (
  auth.jwt() ->> 'role' = 'client' AND 
  id IN (SELECT client_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Clients read own projects" ON projects 
FOR SELECT USING (
  auth.jwt() ->> 'role' = 'client' AND 
  client_id IN (SELECT client_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Clients read own public files" ON project_files 
FOR SELECT USING (
  is_public = true AND
  auth.jwt() ->> 'role' = 'client' AND 
  client_id IN (SELECT client_id FROM users WHERE id = auth.uid())
);

-- No other policies needed!
-- Service role (used by admin API) automatically bypasses all RLS
-- This means:
-- ✅ Admin operations work through server-side API calls
-- ✅ Client portal users can only see their own data  
-- ✅ Public users can only submit contact forms
-- ❌ No unauthorized access to any sensitive data