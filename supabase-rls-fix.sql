-- Drop existing policies
DROP POLICY IF EXISTS "Allow anonymous inserts" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated read" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated updates" ON contact_submissions;

-- Create new policy that allows inserts from service role (API routes)
CREATE POLICY "Allow service role inserts" ON contact_submissions
FOR INSERT 
TO service_role
WITH CHECK (true);

-- Create policy to allow inserts from anonymous users (direct from client)
CREATE POLICY "Allow anonymous inserts" ON contact_submissions
FOR INSERT 
TO anon
WITH CHECK (true);

-- Create policy to allow authenticated users to view all submissions (for admin)
CREATE POLICY "Allow authenticated read" ON contact_submissions
FOR SELECT 
TO authenticated
USING (true);

-- Create policy to allow service role to read all submissions (for API)
CREATE POLICY "Allow service role read" ON contact_submissions
FOR SELECT 
TO service_role
USING (true);

-- Create policy to allow authenticated users to update submissions (for admin)
CREATE POLICY "Allow authenticated updates" ON contact_submissions
FOR UPDATE 
TO authenticated
USING (true);

-- Create policy to allow service role to update submissions (for API)
CREATE POLICY "Allow service role updates" ON contact_submissions
FOR UPDATE 
TO service_role
USING (true);