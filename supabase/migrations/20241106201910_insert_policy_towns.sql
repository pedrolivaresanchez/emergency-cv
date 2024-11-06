create policy "Enable insert for authenticated users only"
on "public"."towns"
as permissive
for insert
to public
with check (true);


