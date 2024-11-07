create policy "Enable insert public"
on "public"."towns"
as permissive
for insert
to public
with check (true);


