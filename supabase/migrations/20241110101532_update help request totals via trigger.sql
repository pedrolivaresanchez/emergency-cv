CREATE OR REPLACE FUNCTION update_asignees_count()
RETURNS TRIGGER AS $$
BEGIN
 RAISE NOTICE 'Trigger executed on operation: %, help_request_id: %', TG_OP, COALESCE(NEW.help_request_id, OLD.help_request_id);

    IF TG_OP = 'INSERT' THEN
        -- Increment assignments_count on assignment add
        UPDATE public.help_requests
        SET asignees_count = asignees_count + 1
        WHERE id = NEW.help_request_id;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement assignments_count on assignment removal
        UPDATE public.help_requests
        SET asignees_count = asignees_count - 1
        WHERE id = OLD.help_request_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_assignments_count
AFTER INSERT OR DELETE ON public.help_request_assignments
FOR EACH ROW EXECUTE FUNCTION update_asignees_count();
