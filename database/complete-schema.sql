-- LuxWeb Studio CRM - Complete Database Schema
-- This replaces your existing partial schema with a comprehensive one

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================
-- CORE BUSINESS TABLES
-- ================================

-- Contact form submissions (leads)
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  project_type TEXT CHECK (project_type IN ('starter', 'growth', 'complete')) NOT NULL,
  project_goals TEXT,
  budget_range TEXT CHECK (budget_range IN ('under-1k', '1k-3k', '3k-5k', '5k-10k', '10k-plus', 'discuss')),
  additional_details TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service packages offered
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- 'Starter', 'Growth', 'Complete'
  price DECIMAL(10,2) NOT NULL,
  retainer_price DECIMAL(10,2) DEFAULT 0,
  description TEXT,
  features JSONB, -- Array of features included
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients (converted leads)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_submission_id UUID REFERENCES contact_submissions(id),
  company_name TEXT NOT NULL,
  primary_contact TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  website_url TEXT,
  brand_colors JSONB, -- {primary: "#hex", secondary: "#hex", accent: "#hex"}
  communication_preferences JSONB, -- {email: bool, sms: bool, preferred_time: string}
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  engagement_score INTEGER DEFAULT 100,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id),
  project_name TEXT NOT NULL,
  project_type TEXT CHECK (project_type IN ('starter', 'growth', 'complete', 'custom')) NOT NULL,
  description TEXT,
  total_value DECIMAL(10,2),
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled')),
  start_date DATE,
  target_completion DATE,
  actual_completion DATE,
  retainer_active BOOLEAN DEFAULT false,
  project_phases JSONB, -- Custom milestone system
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project milestones
CREATE TABLE project_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  milestone_order INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  requires_client_action BOOLEAN DEFAULT false,
  client_approved BOOLEAN DEFAULT false,
  notification_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- FINANCIAL MANAGEMENT
-- ================================

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  client_id UUID REFERENCES clients(id),
  invoice_number TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  invoice_data JSONB, -- Line items, descriptions, etc.
  payment_terms TEXT DEFAULT '30 days',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('bank_transfer', 'credit_card', 'paypal', 'stripe', 'check', 'cash')),
  transaction_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- COMMUNICATION & FILES
-- ================================

-- Client communications
CREATE TABLE client_communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'call', 'meeting', 'chat')),
  direction TEXT DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
  subject TEXT,
  content TEXT,
  sent_by TEXT, -- 'admin', 'system', 'client'
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  replied BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- File management with versioning
CREATE TABLE project_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Storage path/URL
  file_type TEXT,
  file_size INTEGER,
  version INTEGER DEFAULT 1,
  approved BOOLEAN DEFAULT false,
  uploaded_by TEXT, -- 'admin' or 'client'
  is_public BOOLEAN DEFAULT false, -- Visible in client portal
  tags JSONB, -- Array of tags for organization
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- TEMPLATES & CONTRACTS
-- ================================

-- Contract/Proposal templates
CREATE TABLE contract_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  template_type TEXT CHECK (template_type IN ('contract', 'proposal', 'sow')) NOT NULL,
  template_content TEXT NOT NULL, -- Markdown with placeholders
  placeholder_fields JSONB, -- Dynamic field definitions
  service_type TEXT,
  package_type TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated contracts for projects
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  template_id UUID REFERENCES contract_templates(id),
  contract_data JSONB, -- Filled template data
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'expired')),
  sent_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  signature_data JSONB, -- Digital signature info
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questionnaire templates
CREATE TABLE questionnaire_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  questions JSONB NOT NULL, -- Array of question objects
  project_type TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client questionnaire responses
CREATE TABLE client_questionnaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  template_id UUID REFERENCES questionnaire_templates(id),
  responses JSONB, -- Client answers
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'reviewed')),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- USER MANAGEMENT & PORTAL
-- ================================

-- System users (admin) and client portal users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client portal settings
CREATE TABLE client_portal_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE UNIQUE,
  theme_settings JSONB, -- Custom branding/colors
  enabled_features JSONB, -- Which portal features are enabled
  custom_domain TEXT,
  welcome_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- SYSTEM CONFIGURATION
-- ================================

-- System configuration settings
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- NOTIFICATIONS & AUTOMATION
-- ================================

-- System notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  client_id UUID REFERENCES clients(id),
  project_id UUID REFERENCES projects(id),
  type TEXT NOT NULL, -- 'milestone_due', 'payment_received', 'contract_signed', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT, -- Deep link to relevant page
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation workflows
CREATE TABLE workflow_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL, -- 'project_created', 'milestone_completed', etc.
  trigger_conditions JSONB,
  actions JSONB, -- Array of actions to perform
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow execution log
CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_template_id UUID REFERENCES workflow_templates(id),
  project_id UUID REFERENCES projects(id),
  client_id UUID REFERENCES clients(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  execution_data JSONB,
  error_message TEXT,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- INDEXES FOR PERFORMANCE
-- ================================

-- Contact submissions
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at);

-- Clients
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_email ON clients(email);

-- Projects
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);

-- Communications
CREATE INDEX idx_communications_client_id ON client_communications(client_id);
CREATE INDEX idx_communications_project_id ON client_communications(project_id);
CREATE INDEX idx_communications_created_at ON client_communications(created_at);

-- Files
CREATE INDEX idx_project_files_project_id ON project_files(project_id);
CREATE INDEX idx_project_files_client_id ON project_files(client_id);

-- Invoices
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ================================
-- TRIGGERS FOR AUTO-UPDATES
-- ================================

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply timestamp triggers
CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- ROW LEVEL SECURITY (RLS)
-- ================================

-- Enable RLS on all tables
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Admin can see everything (only kbandison@gmail.com)
CREATE POLICY "Admin full access" ON contact_submissions FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin' AND email = 'kbandison@gmail.com')
);
CREATE POLICY "Admin full access" ON clients FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin' AND email = 'kbandison@gmail.com')
);
CREATE POLICY "Admin full access" ON projects FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin' AND email = 'kbandison@gmail.com')
);
CREATE POLICY "Admin full access" ON project_milestones FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin' AND email = 'kbandison@gmail.com')
);
CREATE POLICY "Admin full access" ON invoices FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin' AND email = 'kbandison@gmail.com')
);
CREATE POLICY "Admin full access" ON payments FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin' AND email = 'kbandison@gmail.com')
);
CREATE POLICY "Admin full access" ON client_communications FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin' AND email = 'kbandison@gmail.com')
);
CREATE POLICY "Admin full access" ON project_files FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin' AND email = 'kbandison@gmail.com')
);
CREATE POLICY "Admin full access" ON contracts FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin' AND email = 'kbandison@gmail.com')
);
CREATE POLICY "Admin full access" ON client_questionnaires FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin' AND email = 'kbandison@gmail.com')
);
CREATE POLICY "Admin full access" ON notifications FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin' AND email = 'kbandison@gmail.com')
);

-- Client portal users can only see their own data
CREATE POLICY "Clients see own data" ON clients FOR SELECT USING (
  auth.uid() IN (SELECT id FROM users WHERE client_id = clients.id)
);
CREATE POLICY "Clients see own projects" ON projects FOR SELECT USING (
  client_id IN (SELECT client_id FROM users WHERE id = auth.uid())
);
-- Add similar policies for other client-accessible tables...

-- ================================
-- SEED DATA
-- ================================

-- Insert packages matching your actual data/packages.ts file
INSERT INTO packages (name, price, retainer_price, description, features) VALUES
('Starter Package', 1500.00, 0.00, 'Perfect for new businesses getting online', 
 '["Professional single-page website", "Mobile-responsive design", "Basic SEO optimization", "Contact form integration", "1 week delivery", "30-day support"]'),
('Growth Package', 2200.00, 0.00, 'Ideal for established businesses ready to scale',
 '["2 - 10 page custom website", "Advanced SEO setup", "Analytics integration", "Social media integration", "Blog setup (optional)", "2 weeks delivery", "60-day support"]'),
('Complete Package', 2800.00, 0.00, 'Full-service solution for serious growth',
 '["10-30 Pages", "Database integration", "User authentication", "Payment processing", "Advanced functionality", "2+ weeks delivery", "90-day support"]'),
('Enterprise Package', 3500.00, 0.00, 'Premium solution for maximum results',
 '["Custom enterprise web application", "Advanced database architecture", "Multi-user authentication system", "Payment gateway integration", "Advanced analytics dashboard", "API development", "Priority support", "3+ weeks delivery", "6-month support"]');

-- Create admin user for your personal email (you'll set up Supabase auth separately)
-- Replace with your actual email
INSERT INTO users (email, role) VALUES ('kbandison@gmail.com', 'admin');

-- Insert system configuration
INSERT INTO system_settings (key, value, description) VALUES
('support_email', 'support@luxwebstudio.dev', 'Email address used for client communications'),
('admin_email', 'kbandison@gmail.com', 'Primary admin email address'),
('company_name', 'LuxWeb Studio', 'Company name for contracts and communications'),
('default_payment_terms', '30 days', 'Default payment terms for invoices'),
('invoice_prefix', 'LWS', 'Prefix for invoice numbers');

-- Insert sample workflow templates
INSERT INTO workflow_templates (name, trigger_type, trigger_conditions, actions, is_active) VALUES
('Welcome New Client', 'project_created', '{}', 
 '[{"type": "send_email", "template": "welcome_client", "from": "support@luxwebstudio.dev"}, {"type": "create_milestone", "title": "Discovery Call"}]', true),
('Payment Reminder', 'invoice_overdue', '{"days_overdue": 7}',
 '[{"type": "send_email", "template": "payment_reminder", "from": "support@luxwebstudio.dev"}, {"type": "create_notification", "message": "Invoice overdue"}]', true);