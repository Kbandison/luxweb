-- Add invoice_type column to invoices table
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_type TEXT DEFAULT 'standard' 
CHECK (invoice_type IN ('down_payment', 'progress_payment', 'final_payment', 'standard', 'retainer', 'expense_reimbursement'));

-- Create invoice type templates for pre-filled descriptions
CREATE TABLE IF NOT EXISTS invoice_type_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_type TEXT NOT NULL,
  template_name TEXT NOT NULL,
  default_description TEXT NOT NULL,
  percentage_of_project DECIMAL(5,2), -- For down payment percentage, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default invoice type templates
INSERT INTO invoice_type_templates (invoice_type, template_name, default_description, percentage_of_project) VALUES
('down_payment', 'Down Payment - 50%', 'Down payment for project initiation (50% of total project value)', 50.00),
('down_payment', 'Down Payment - 30%', 'Down payment for project initiation (30% of total project value)', 30.00),
('progress_payment', 'Milestone Payment', 'Progress payment for completed project milestone', NULL),
('final_payment', 'Final Payment', 'Final payment upon project completion and delivery', NULL),
('standard', 'Standard Invoice', 'Professional services rendered', NULL),
('retainer', 'Monthly Retainer', 'Monthly retainer fee for ongoing services', NULL),
('expense_reimbursement', 'Expense Reimbursement', 'Reimbursement for project-related expenses', NULL)
ON CONFLICT DO NOTHING;