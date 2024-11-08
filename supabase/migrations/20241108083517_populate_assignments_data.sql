UPDATE "public"."help_requests"
SET "asignees_count" = (
    SELECT COUNT(*)
    FROM "public"."help_request_assignments"
    WHERE "public"."help_request_assignments"."help_request_id" = "public"."help_requests"."id"
);