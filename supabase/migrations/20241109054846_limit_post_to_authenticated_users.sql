drop policy "Enable insert access" on "public"."help_requests";

drop policy "Enable insert for all users" on "public"."help_requests";

drop policy "Enable insert for anonymous users" on "public"."help_requests";

drop policy "Enable_update_for_users_based_on_email" on "public"."help_requests";

create policy "Enable insert access"
on "public"."help_requests"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable insert for all users"
on "public"."help_requests"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable insert for anonymous users"
on "public"."help_requests"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable_update_for_users_based_on_email"
on "public"."help_requests"
as permissive
for update
to authenticated
using (((auth.uid() IS NOT NULL) AND ((additional_info ->> 'email'::text) = auth.email())));



