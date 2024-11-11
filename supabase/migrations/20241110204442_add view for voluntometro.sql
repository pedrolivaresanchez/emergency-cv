create view town_help_request_summary as
select
    t.id as town_id,
    t.name as town_name,

    -- Número de help_requests de type = "ofrece" en las últimas 24 horas
    coalesce(sum(case when hr.type = 'ofrece' and hr.created_at >= now() - interval '24 hours' then 1 else 0 end), 0) as offers_last_24h,

    -- Número de help_requests de type = "necesita" en las últimas 24 horas
    coalesce(sum(case when hr.type = 'necesita' and hr.created_at >= now() - interval '24 hours' then 1 else 0 end), 0) as needs_last_24h,

    -- Número de help_requests de type = "necesita" sin help_request_assignments
    coalesce(sum(case when hr.type = 'necesita' and hr.status <> 'finished' and hra.help_request_id is null then 1 else 0 end), 0) as unassigned_needs

from
    towns t
left join
    help_requests hr on t.id = hr.town_id
left join
    help_request_assignments hra on hr.id = hra.help_request_id
group by
    t.id, t.name;
