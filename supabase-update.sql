-- Update the project_type constraint to include 'enterprise'
ALTER TABLE contact_submissions 
DROP CONSTRAINT IF EXISTS contact_submissions_project_type_check;

ALTER TABLE contact_submissions 
ADD CONSTRAINT contact_submissions_project_type_check 
CHECK (project_type IN ('starter', 'growth', 'complete', 'enterprise'));