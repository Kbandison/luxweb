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

-- 2. Service Packages
CREATE TABLE packages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL CHECK (name IN ('starter', 'growth', 'complete', 'enterprise')),
  display_name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  features JSONB, -- Array of features
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Clients Table (converted leads become clients)
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

-- 4. Projects Table
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

-- 5. Project Tasks/Milestones
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

-- 6. Invoices Table
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

-- 7. Contract Templates
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

-- 8. Generated Contracts (filled templates)
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

-- 9. Email Templates
CREATE TABLE email_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_content TEXT NOT NULL, -- HTML/markdown content with placeholders like {{client_name}}
  template_type TEXT NOT NULL CHECK (template_type IN ('invoice', 'proposal', 'follow_up', 'welcome', 'reminder', 'custom')),
  placeholder_fields JSONB NOT NULL, -- {"client_name": "text", "project_name": "text", "custom_message": "text"}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Project Milestones (alias for project_tasks for API compatibility)
CREATE VIEW project_milestones AS 
SELECT 
  id,
  project_id,
  title as milestone_name,
  description,
  status,
  due_date,
  completed_at,
  created_at
FROM project_tasks;

-- 11. Project Files
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

-- 12. Client Communications Log
CREATE TABLE client_communications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  communication_type TEXT NOT NULL CHECK (communication_type IN ('email', 'sms', 'call', 'meeting', 'note')),
  subject TEXT,
  content TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  status TEXT DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'scheduled', 'completed', 'cancelled')),
  sent_by TEXT DEFAULT 'admin', -- admin, system, client
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  replied BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Client Questionnaires
CREATE TABLE questionnaire_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  questionnaire_type TEXT NOT NULL, -- 'onboarding', 'brand_discovery', etc.
  responses JSONB NOT NULL, -- {"question_1": "answer", "question_2": "answer"}
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Client Portal Sessions (for secure access)
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
CREATE INDEX idx_communications_client_id ON client_communications(client_id);
CREATE INDEX idx_client_portal_sessions_token ON client_portal_sessions(session_token);

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_portal_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Admin Users
CREATE POLICY "Admin users can manage own account" ON admin_users
FOR ALL TO authenticated
USING (auth.uid()::text = id::text);

-- RLS Policies for Packages
CREATE POLICY "Everyone can view packages" ON packages
FOR SELECT TO authenticated, anon
USING (is_active = true);

CREATE POLICY "Admin can manage packages" ON packages
FOR ALL TO authenticated
USING (true);

CREATE POLICY "Service role can manage packages" ON packages
FOR ALL TO service_role
USING (true);

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

-- RLS Policies for Email Templates
CREATE POLICY "Admin can manage email templates" ON email_templates
FOR ALL TO authenticated
USING (true);

CREATE POLICY "Service role can manage email templates" ON email_templates
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

-- RLS Policies for Client Communications
CREATE POLICY "Admin can manage all communications" ON client_communications
FOR ALL TO authenticated
USING (true);

CREATE POLICY "Service role can manage communications" ON client_communications
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

-- Insert default packages
INSERT INTO packages (name, display_name, description, price, features) VALUES 
(
  'starter',
  'Starter Package',
  'Perfect for new businesses getting online',
  1500.00,
  '["Professional single-page website", "Mobile-responsive design", "Basic SEO optimization", "Contact form integration", "1 week delivery", "30-day support"]'
),
(
  'growth',
  'Growth Package',
  'Ideal for established businesses ready to scale',
  2200.00,
  '["Multi-page custom website", "Advanced SEO setup", "Analytics integration", "Social media integration", "Blog setup (optional)", "2 weeks delivery", "60-day support"]'
),
(
  'complete',
  'Complete Package',
  'Full-service solution for serious growth',
  2800.00,
  '["Custom web application", "Database integration", "User authentication", "Payment processing", "Advanced functionality", "2+ weeks delivery", "90-day support"]'
),
(
  'enterprise',
  'Enterprise Package',
  'Custom solution for complex business needs',
  3500.00,
  '["Fully custom development", "API integrations", "Advanced security", "Performance optimization", "Dedicated support", "Custom timeline", "6-month support"]'
);

-- Insert default email templates
INSERT INTO email_templates (name, subject, template_content, template_type, placeholder_fields) VALUES 
(
  'Invoice Follow-up',
  'Invoice Due: {{invoice_number}}',
  '<p>Dear {{client_name}},</p>
  <p>This is a friendly reminder that your invoice {{invoice_number}} for ${{invoice_amount}} is due on {{due_date}}.</p>
  <p>Project: {{project_name}}</p>
  <p>If you have any questions, please don''t hesitate to reach out.</p>
  <p>Best regards,<br>LuxWeb Studio Team</p>',
  'invoice',
  '{"client_name": "text", "invoice_number": "text", "invoice_amount": "currency", "due_date": "date", "project_name": "text"}'
),
(
  'Project Proposal',
  'Your Web Development Proposal - {{project_name}}',
  '<p>Dear {{client_name}},</p>
  <p>Thank you for your interest in working with LuxWeb Studio. We''re excited to present our proposal for {{project_name}}.</p>
  <p><strong>Project Summary:</strong></p>
  <p>{{project_description}}</p>
  <p><strong>Investment:</strong> ${{project_price}}</p>
  <p><strong>Timeline:</strong> {{timeline}}</p>
  <p>We look forward to bringing your vision to life!</p>
  <p>Best regards,<br>LuxWeb Studio Team</p>',
  'proposal',
  '{"client_name": "text", "project_name": "text", "project_description": "text", "project_price": "currency", "timeline": "text"}'
),
(
  'Welcome Email',
  'Welcome to LuxWeb Studio - {{client_name}}',
  '<p>Dear {{client_name}},</p>
  <p>Welcome to LuxWeb Studio! We''re thrilled to have you as a client and can''t wait to start working on {{project_name}}.</p>
  <p>Here''s what happens next:</p>
  <ul>
    <li>You''ll receive access to your client portal within 24 hours</li>
    <li>We''ll schedule a discovery call to dive deep into your project requirements</li>
    <li>Our team will begin the planning and design process</li>
  </ul>
  <p>If you have any questions, feel free to reply to this email.</p>
  <p>Best regards,<br>LuxWeb Studio Team</p>',
  'welcome',
  '{"client_name": "text", "project_name": "text"}'
),
(
  'Project Milestone Update',
  'Project Update: {{milestone_name}} Complete',
  '<p>Dear {{client_name}},</p>
  <p>Great news! We''ve completed another milestone for {{project_name}}.</p>
  <p><strong>Completed:</strong> {{milestone_name}}</p>
  <p><strong>Progress:</strong> {{progress_percentage}}% complete</p>
  <p><strong>Next Steps:</strong> {{next_steps}}</p>
  <p>You can view the latest updates in your client portal.</p>
  <p>Best regards,<br>LuxWeb Studio Team</p>',
  'follow_up',
  '{"client_name": "text", "project_name": "text", "milestone_name": "text", "progress_percentage": "number", "next_steps": "text"}'
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