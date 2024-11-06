ALTER TYPE "public"."help_type_enum" ADD VALUE 'reparto';
ALTER TYPE "public"."help_type_enum" ADD VALUE 'donaciones';

ALTER TABLE "public"."help_requests" ADD COLUMN "other_help" text DEFAULT NULL;