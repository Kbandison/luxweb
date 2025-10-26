-- Deploy Missing Tables for Email Templates and Client Communications
-- Run this script in Supabase SQL Editor

-- Create users table for role-based authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client')),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
DO $$
BEGIN
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- RLS Policies for Users
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view own record') THEN
    CREATE POLICY "Users can view own record" ON users
    FOR SELECT TO authenticated
    USING (auth.uid()::text = id::text);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Service role can manage users') THEN
    CREATE POLICY "Service role can manage users" ON users
    FOR ALL TO service_role
    USING (true);
  END IF;
END $$;

-- Create or update email_templates table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_templates') THEN
    CREATE TABLE email_templates (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      subject TEXT NOT NULL,
      template_content TEXT NOT NULL,
      template_type TEXT NOT NULL CHECK (template_type IN ('invoice', 'proposal', 'follow_up', 'welcome', 'reminder', 'custom')),
      placeholder_fields JSONB NOT NULL,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  ELSE
    -- Add unique constraint on name if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_name = 'email_templates' 
      AND constraint_type = 'UNIQUE' 
      AND constraint_name = 'email_templates_name_key'
    ) THEN
      ALTER TABLE email_templates ADD CONSTRAINT email_templates_name_key UNIQUE (name);
    END IF;
  END IF;
END $$;

-- Create or update packages table
DO $$
BEGIN
  -- Create packages table if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'packages') THEN
    CREATE TABLE packages (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name TEXT NOT NULL UNIQUE CHECK (name IN ('starter', 'growth', 'complete', 'enterprise')),
      display_name TEXT NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      features JSONB,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  ELSE
    -- Add missing columns if table exists
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'packages' AND column_name = 'display_name'
    ) THEN
      ALTER TABLE packages ADD COLUMN display_name TEXT;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'packages' AND column_name = 'description'
    ) THEN
      ALTER TABLE packages ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'packages' AND column_name = 'features'
    ) THEN
      ALTER TABLE packages ADD COLUMN features JSONB;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'packages' AND column_name = 'is_active'
    ) THEN
      ALTER TABLE packages ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'packages' AND column_name = 'created_at'
    ) THEN
      ALTER TABLE packages ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add unique constraint on name if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_name = 'packages' 
      AND constraint_type = 'UNIQUE' 
      AND constraint_name = 'packages_name_key'
    ) THEN
      ALTER TABLE packages ADD CONSTRAINT packages_name_key UNIQUE (name);
    END IF;
  END IF;
END $$;

-- Update client_communications table structure if needed
DO $$
BEGIN
  -- Check if the column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'client_communications' 
    AND column_name = 'communication_type'
  ) THEN
    -- If table exists but has wrong column name, rename it
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'client_communications' 
      AND column_name = 'type'
    ) THEN
      ALTER TABLE client_communications RENAME COLUMN type TO communication_type;
    END IF;
  END IF;
  
  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'client_communications' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE client_communications ADD COLUMN status TEXT DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'scheduled', 'completed', 'cancelled'));
  END IF;
END $$;

-- Enable RLS (ignore if already enabled)
DO $$
BEGIN
  ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN
  NULL; -- Ignore if already enabled
END $$;

DO $$
BEGIN
  ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN
  NULL; -- Ignore if already enabled
END $$;

-- RLS Policies for Email Templates (create if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_templates' AND policyname = 'Admin can manage email templates') THEN
    CREATE POLICY "Admin can manage email templates" ON email_templates
    FOR ALL TO authenticated
    USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_templates' AND policyname = 'Service role can manage email templates') THEN
    CREATE POLICY "Service role can manage email templates" ON email_templates
    FOR ALL TO service_role
    USING (true);
  END IF;
END $$;

-- RLS Policies for Packages (create if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'packages' AND policyname = 'Everyone can view packages') THEN
    CREATE POLICY "Everyone can view packages" ON packages
    FOR SELECT TO authenticated, anon
    USING (is_active = true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'packages' AND policyname = 'Admin can manage packages') THEN
    CREATE POLICY "Admin can manage packages" ON packages
    FOR ALL TO authenticated
    USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'packages' AND policyname = 'Service role can manage packages') THEN
    CREATE POLICY "Service role can manage packages" ON packages
    FOR ALL TO service_role
    USING (true);
  END IF;
END $$;

-- Insert or update default packages
INSERT INTO packages (name, display_name, description, price, features, is_active) VALUES 
(
  'starter',
  'Starter Package',
  'Perfect for new businesses getting online',
  1500.00,
  '["Professional single-page website", "Mobile-responsive design", "Basic SEO optimization", "Contact form integration", "1 week delivery", "30-day support"]'::jsonb,
  true
),
(
  'growth',
  'Growth Package',
  'Ideal for established businesses ready to scale',
  2200.00,
  '["Multi-page custom website", "Advanced SEO setup", "Analytics integration", "Social media integration", "Blog setup (optional)", "2 weeks delivery", "60-day support"]'::jsonb,
  true
),
(
  'complete',
  'Complete Package',
  'Full-service solution for serious growth',
  2800.00,
  '["Custom web application", "Database integration", "User authentication", "Payment processing", "Advanced functionality", "2+ weeks delivery", "90-day support"]'::jsonb,
  true
),
(
  'enterprise',
  'Enterprise Package',
  'Custom solution for complex business needs',
  3500.00,
  '["Fully custom development", "API integrations", "Advanced security", "Performance optimization", "Dedicated support", "Custom timeline", "6-month support"]'::jsonb,
  true
)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  features = EXCLUDED.features,
  is_active = EXCLUDED.is_active;

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
)
ON CONFLICT (name) DO NOTHING;