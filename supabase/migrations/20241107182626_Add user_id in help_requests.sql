alter table "public"."help_requests" add column "user_id" uuid;

UPDATE help_requests hr
SET user_id = i.user_id
FROM auth.identities i
WHERE hr.additional_info->>'email' = i.email;