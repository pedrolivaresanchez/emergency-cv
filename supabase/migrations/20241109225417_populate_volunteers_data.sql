INSERT INTO public.help_requests_volunteers (id, assignees_count)
SELECT 
    hr.id AS id,
    COALESCE(COUNT(hra.help_request_id), 0) AS assignees_count
FROM 
    public.help_requests AS hr
LEFT JOIN 
    public.help_request_assignments AS hra
ON 
    hr.id = hra.help_request_id
GROUP BY 
    hr.id;
