create policy "Enable_update_for_users_based_on_email"
on public.help_requests
for update
to public
using (
  ((auth.uid() IS NOT NULL) AND ((additional_info ->> 'email'::text) = auth.email()))
);

alter policy "Enable_update_for_users_based_on_email"
on public.help_requests
to public
using (
  ((auth.uid() IS NOT NULL) AND ((additional_info ->> 'email'::text) = auth.email()))
);
