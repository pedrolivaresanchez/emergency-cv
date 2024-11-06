CREATE POLICY "Enable update access" ON "public"."help_requests" AS permissive
FOR UPDATE USING(true)
