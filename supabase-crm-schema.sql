-- LuxWeb Studio CRM Database Schema
-- This builds on the existing contact_submissions table to create a full CRM system

-- 1. Admin Users Table (for CRM access)
CREATE TABLE admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- 2. Clients Table (converted leads become clients)
CREATE TABLE clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contact_submission_id UUID REFERENCES contact_submissions(id), -- Link to original lead
  company_name TEXT,
  primary_contact TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  website_url TEXT,
  brand_colors JSONB, -- For client portal theming {"primary": "#123456", "secondary": "#789abc"}
  communication_preferences JSONB, -- {"email": true, "sms": false, "preferred_time": "morning"}
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Projects Table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  project_type TEXT NOT NULL CHECK (project_type IN ('starter', 'growth', 'complete', 'enterprise', 'custom')),
  description TEXT,
  total_value DECIMAL(10,2),
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled')),
  start_date DATE,
  target_completion DATE,
  actual_completion DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Project Tasks/Milestones
CREATE TABLE project_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  task_order INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  requires_client_action BOOLEAN DEFAULT false,
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Invoices Table
CREATE TABLE invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  invoice_name TEXT NOT NULL,
  invoice_number TEXT UNIQUE, -- INV-2025-001, etc.
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  payment_link TEXT,
  payment_method TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Contract Templates
CREATE TABLE contract_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  template_content TEXT NOT NULL, -- HTML/markdown content with placeholders like {{client_name}}
  placeholder_fields JSONB NOT NULL, -- {"client_name": "text", "project_price": "currency", "start_date": "date"}
  service_type TEXT, -- Maps to project_type
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Generated Contracts (filled templates)
CREATE TABLE contracts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  template_id UUID REFERENCES contract_templates(id),
  contract_content TEXT NOT NULL, -- Final filled contract
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'expired')),
  sent_at TIMESTAMP WITH TIME ZONE,
  signed_at TIMESTAMP WITH TIME ZONE,
  signature_data JSONB, -- Store signature info if needed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Project Files
CREATE TABLE project_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Supabase storage path
  file_type TEXT NOT NULL, -- image, document, logo, etc.
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by TEXT NOT NULL CHECK (uploaded_by IN ('admin', 'client')),
  is_approved BOOLEAN DEFAULT false,
  version INTEGER DEFAULT 1,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Client Communications Log
CREATE TABLE communications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'call', 'meeting', 'note')),
  subject TEXT,
  content TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  sent_by TEXT DEFAULT 'admin', -- admin, system, client
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  replied BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Client Questionnaires
CREATE TABLE questionnaire_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  questionnaire_type TEXT NOT NULL, -- 'onboarding', 'brand_discovery', etc.
  responses JSONB NOT NULL, -- {"question_1": "answer", "question_2": "answer"}
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Client Portal Sessions (for secure access)
CREATE TABLE client_portal_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_tasks_project_id ON project_tasks(project_id);
CREATE INDEX idx_project_tasks_status ON project_tasks(status);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_project_files_project_id ON project_files(project_id);
CREATE INDEX idx_communications_client_id ON communications(client_id);
CREATE INDEX idx_client_portal_sessions_token ON client_portal_sessions(session_token);

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_portal_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Admin Users
CREATE POLICY "Admin users can manage own account" ON admin_users
FOR ALL TO authenticated
USING (auth.uid()::text = id::text);

-- RLS Policies for Clients (Admin can see all, clients can see their own)
CREATE POLICY "Admin can manage all clients" ON clients
FOR ALL TO authenticated
USING (true);

CREATE POLICY "Service role can manage clients" ON clients
FOR ALL TO service_role
USING (true);

-- RLS Policies for Projects
CREATE POLICY "Admin can manage all projects" ON projects
FOR ALL TO authenticated
USING (true);

CREATE POLICY "Service role can manage projects" ON projects
FOR ALL TO service_role
USING (true);

-- RLS Policies for Project Tasks
CREATE POLICY "Admin can manage all tasks" ON project_tasks
FOR ALL TO authenticated
USING (true);

CREATE POLICY "Service role can manage tasks" ON project_tasks
FOR ALL TO service_role
USING (true);

-- RLS Policies for Invoices
CREATE POLICY "Admin can manage all invoices" ON invoices
FOR ALL TO authenticated
USING (true);

CREATE POLICY "Service role can manage invoices" ON invoices
FOR ALL TO service_role
USING (true);

-- RLS Policies for Contract Templates
CREATE POLICY "Admin can manage contract templates" ON contract_templates
FOR ALL TO authenticated
USING (true);

CREATE POLICY "Service role can manage contract templates" ON contract_templates
FOR ALL TO service_role
USING (true);

-- RLS Policies for Contracts
CREATE POLICY "Admin can manage all contracts" ON contracts
FOR ALL TO authenticated
USING (true);

CREATE POLICY "Service role can manage contracts" ON contracts
FOR ALL TO service_role
USING (true);

-- RLS Policies for Project Files
CREATE POLICY "Admin can manage all project files" ON project_files
FOR ALL TO authenticated
USING (true);

CREATE POLICY "Service role can manage project files" ON project_files
FOR ALL TO service_role
USING (true);

-- RLS Policies for Communications
CREATE POLICY "Admin can manage all communications" ON communications
FOR ALL TO authenticated
USING (true);

CREATE POLICY "Service role can manage communications" ON communications
FOR ALL TO service_role
USING (true);

-- RLS Policies for Questionnaire Responses
CREATE POLICY "Admin can view all questionnaire responses" ON questionnaire_responses
FOR ALL TO authenticated
USING (true);

CREATE POLICY "Service role can manage questionnaire responses" ON questionnaire_responses
FOR ALL TO service_role
USING (true);

-- RLS Policies for Client Portal Sessions
CREATE POLICY "Service role can manage portal sessions" ON client_portal_sessions
FOR ALL TO service_role
USING (true);

-- Insert some default contract templates
INSERT INTO contract_templates (name, template_content, placeholder_fields, service_type) VALUES 
(
  'Starter Package Contract',
  '<h1>Web Development Service Agreement</h1>
  <p><strong>Client:</strong> {{client_name}}</p>
  <p><strong>Company:</strong> {{company_name}}</p>
  <p><strong>Project:</strong> {{project_name}}</p>
  <p><strong>Total Investment:</strong> ${{project_price}}</p>
  <p><strong>Start Date:</strong> {{start_date}}</p>
  <p><strong>Completion Date:</strong> {{completion_date}}</p>
  
  <h2>Scope of Work</h2>
  <ul>
    <li>Professional single-page website</li>
    <li>Mobile-responsive design</li>
    <li>Basic SEO optimization</li>
    <li>Contact form integration</li>
    <li>1 week delivery</li>
    <li>30-day support</li>
  </ul>
  
  <h2>Terms & Conditions</h2>
  <p>Payment terms: {{payment_terms}}</p>
  <p>By signing below, both parties agree to the terms outlined in this agreement.</p>',
  '{"client_name": "text", "company_name": "text", "project_name": "text", "project_price": "currency", "start_date": "date", "completion_date": "date", "payment_terms": "text"}',
  'starter'
),
(
  'Growth Package Contract',
  '<h1>Web Development Service Agreement</h1>
  <p><strong>Client:</strong> {{client_name}}</p>
  <p><strong>Company:</strong> {{company_name}}</p>
  <p><strong>Project:</strong> {{project_name}}</p>
  <p><strong>Total Investment:</strong> ${{project_price}}</p>
  <p><strong>Start Date:</strong> {{start_date}}</p>
  <p><strong>Completion Date:</strong> {{completion_date}}</p>
  
  <h2>Scope of Work</h2>
  <ul>
    <li>Multi-page custom website</li>
    <li>Advanced SEO setup</li>
    <li>Analytics integration</li>
    <li>Social media integration</li>
    <li>Blog setup (optional)</li>
    <li>2 weeks delivery</li>
    <li>60-day support</li>
  </ul>
  
  <h2>Terms & Conditions</h2>
  <p>Payment terms: {{payment_terms}}</p>
  <p>By signing below, both parties agree to the terms outlined in this agreement.</p>',
  '{"client_name": "text", "company_name": "text", "project_name": "text", "project_price": "currency", "start_date": "date", "completion_date": "date", "payment_terms": "text"}',
  'growth'
);

-- Insert default project task templates
INSERT INTO project_tasks (project_id, title, task_order, requires_client_action) VALUES
-- These will be template tasks that get copied to new projects
(null, 'Discovery Call', 1, true),
(null, 'Brand Strategy/Identity', 2, true),
(null, 'First Stage Completion', 3, false),
(null, 'Second Stage Completion', 4, false),
(null, 'Third Stage Completion', 5, false),
(null, 'Fourth Stage Completion', 6, false),
(null, 'Final Review & Launch', 7, true);