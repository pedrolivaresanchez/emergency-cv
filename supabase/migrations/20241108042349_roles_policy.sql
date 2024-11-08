drop policy "See my role" on "public"."user_roles";

create policy "See my role"
on "public"."user_roles"
as permissive
for select
to authenticated
using ((user_id = auth.uid()));



