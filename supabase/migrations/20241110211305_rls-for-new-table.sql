drop policy "Enable update access for all users" on "public"."help_requests_volunteers";

create policy "Enable read access for all users"
on "public"."help_requests_volunteers"
as permissive
for select
to public
using (true);


create policy "Enable update access for authenticated users"
on "public"."help_requests_volunteers"
as permissive
for update
to authenticated
using (true);



