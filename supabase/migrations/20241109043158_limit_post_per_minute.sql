create policy "limit_post_per_minute"
on "public"."help_requests"
as restrictive
for insert
to authenticated
with check ((NOT (EXISTS ( SELECT 1
   FROM help_requests help_requests_1
  WHERE ((help_requests_1.user_id = auth.uid()) AND (help_requests_1.created_at > (now() - '00:01:00'::interval)))))));