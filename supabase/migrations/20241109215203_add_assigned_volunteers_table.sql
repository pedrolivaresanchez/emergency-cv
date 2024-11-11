create table "public"."help_requests_volunteers" (
    "id" bigint generated by default as identity not null,
    "assignees_count" bigint not null default '0'::bigint
);


alter table "public"."help_requests_volunteers" enable row level security;

CREATE UNIQUE INDEX help_requests_volunteers_pkey ON public.help_requests_volunteers USING btree (id);

alter table "public"."help_requests_volunteers" add constraint "help_requests_volunteers_pkey" PRIMARY KEY using index "help_requests_volunteers_pkey";

alter table "public"."help_requests_volunteers" add constraint "help_requests_volunteers_id_fkey" FOREIGN KEY (id) REFERENCES help_requests(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."help_requests_volunteers" validate constraint "help_requests_volunteers_id_fkey";

grant delete on table "public"."help_requests_volunteers" to "anon";

grant insert on table "public"."help_requests_volunteers" to "anon";

grant references on table "public"."help_requests_volunteers" to "anon";

grant select on table "public"."help_requests_volunteers" to "anon";

grant trigger on table "public"."help_requests_volunteers" to "anon";

grant truncate on table "public"."help_requests_volunteers" to "anon";

grant update on table "public"."help_requests_volunteers" to "anon";

grant delete on table "public"."help_requests_volunteers" to "authenticated";

grant insert on table "public"."help_requests_volunteers" to "authenticated";

grant references on table "public"."help_requests_volunteers" to "authenticated";

grant select on table "public"."help_requests_volunteers" to "authenticated";

grant trigger on table "public"."help_requests_volunteers" to "authenticated";

grant truncate on table "public"."help_requests_volunteers" to "authenticated";

grant update on table "public"."help_requests_volunteers" to "authenticated";

grant delete on table "public"."help_requests_volunteers" to "service_role";

grant insert on table "public"."help_requests_volunteers" to "service_role";

grant references on table "public"."help_requests_volunteers" to "service_role";

grant select on table "public"."help_requests_volunteers" to "service_role";

grant trigger on table "public"."help_requests_volunteers" to "service_role";

grant truncate on table "public"."help_requests_volunteers" to "service_role";

grant update on table "public"."help_requests_volunteers" to "service_role";

create policy "Enable delete for authenticated users only"
on "public"."help_requests_volunteers"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."help_requests_volunteers"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable update access for all users"
on "public"."help_requests_volunteers"
as permissive
for update
to public
using (true);



