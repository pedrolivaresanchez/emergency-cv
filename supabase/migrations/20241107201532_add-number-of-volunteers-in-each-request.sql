alter table "public"."help_requests" add column "asignees_count" smallint not null default '0'::smallint;

UPDATE "public"."help_requests"
SET "assignees_count" = (
    SELECT COUNT(*)
    FROM "public"."help_request_assignments"
    WHERE "public"."help_request_assignments"."help_request_id" = "public"."help_requests"."id"
);