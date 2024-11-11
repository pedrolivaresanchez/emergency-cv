alter table "public"."help_requests" add column "assignees_count" bigint not null default '0'::bigint;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_help_request_volunteer_entry()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    INSERT INTO help_requests_volunteers (id, assignees_count)
    VALUES (NEW.id, 0);
    
    RETURN NEW;
END;$function$
;

CREATE TRIGGER after_help_request_insert AFTER INSERT ON public.help_requests FOR EACH ROW EXECUTE FUNCTION create_help_request_volunteer_entry();


