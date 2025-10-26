-- Email Templates Table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_content TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('welcome', 'invoice', 'project_update', 'completion', 'follow_up', 'reminder', 'custom')),
  variables JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Email Templates
CREATE POLICY "Admin can manage email templates" ON email_templates
FOR ALL TO authenticated
USING (true);

CREATE POLICY "Service role can manage email templates" ON email_templates
FOR ALL TO service_role
USING (true);

-- Insert default email templates
INSERT INTO email_templates (name, subject, template_content, template_type, variables) VALUES
(
  'Welcome Email',
  'Welcome to LuxWeb Studio!',
  '<p>Dear {{client_name}},</p>

<p>Welcome to LuxWeb Studio! We''re excited to work with you on your project.</p>

<p>Here''s what you can expect:</p>
<ul>
  <li>Regular project updates</li>
  <li>Direct communication with your developer</li>
  <li>High-quality, modern web development</li>
</ul>

<p>If you have any questions, please don''t hesitate to reach out.</p>

<p>Best regards,<br>
LuxWeb Studio Team</p>',
  'welcome',
  '{"client_name": "text", "project_name": "text"}'
),
(
  'Invoice Notification',
  'Invoice {{invoice_number}} - Payment Due',
  '<p>Dear {{client_name}},</p>

<p>Your invoice {{invoice_number}} for {{invoice_amount}} is now ready.</p>

<p><strong>Project:</strong> {{project_name}}<br>
<strong>Due Date:</strong> {{due_date}}<br>
<strong>Amount:</strong> {{invoice_amount}}</p>

<p>You can view and pay your invoice online through your client portal.</p>

<p>Thank you for your business!</p>

<p>Best regards,<br>
LuxWeb Studio</p>',
  'invoice',
  '{"client_name": "text", "invoice_number": "text", "invoice_amount": "currency", "project_name": "text", "due_date": "date"}'
),
(
  'Project Update',
  'Project Update: {{project_name}}',
  '<p>Hi {{client_name}},</p>

<p>I wanted to give you a quick update on your project: <strong>{{project_name}}</strong></p>

<h3>Progress This Week:</h3>
<p>{{progress_update}}</p>

<h3>Next Steps:</h3>
<p>{{next_steps}}</p>

<h3>Timeline:</h3>
<p>{{timeline_update}}</p>

<p>If you have any questions or feedback, please let me know!</p>

<p>Best regards,<br>
LuxWeb Studio</p>',
  'project_update',
  '{"client_name": "text", "project_name": "text", "progress_update": "text", "next_steps": "text", "timeline_update": "text"}'
),
(
  'Project Completion',
  'Your Project is Complete! 🎉',
  '<p>Dear {{client_name}},</p>

<p>Congratulations! Your project <strong>{{project_name}}</strong> is now complete and ready for launch!</p>

<h3>What''s Included:</h3>
<p>{{deliverables}}</p>

<h3>Next Steps:</h3>
<ul>
  <li>Review the final deliverables</li>
  <li>Test everything thoroughly</li>
  <li>Go live when you''re ready!</li>
</ul>

<p>All project files and documentation are available in your client portal.</p>

<p>Thank you for choosing LuxWeb Studio. It was a pleasure working with you!</p>

<p>Best regards,<br>
LuxWeb Studio Team</p>',
  'completion',
  '{"client_name": "text", "project_name": "text", "deliverables": "text"}'
)
ON CONFLICT DO NOTHING;