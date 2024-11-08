alter policy "Enable update for users based on email"
on "public"."help_requests"
to public
using (
	  ((auth.uid() IS NOT NULL) AND ((additional_info ->> 'email'::text) = auth.email()))
with check (
	((auth.uid() IS NOT NULL) AND ((additional_info ->> 'email'::text) = auth.email()))
);