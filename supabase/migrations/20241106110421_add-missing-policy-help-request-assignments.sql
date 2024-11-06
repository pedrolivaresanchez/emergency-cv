CREATE POLICY "authenticated_can_insert_own_records"
ON public.help_request_assignments
FOR INSERT
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Enable read access for all users"
ON public.help_request_assignments
FOR SELECT
USING (true);