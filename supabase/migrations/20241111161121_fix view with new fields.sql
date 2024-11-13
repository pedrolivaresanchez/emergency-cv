drop view if exists help_requests_with_assignment_count;

create view help_requests_with_assignment_count as
select
    hr.*,
    coalesce(count(hra.id), 0) as assignments_count
from
    help_requests hr
left join
    help_request_assignments hra on hr.id = hra.help_request_id
group by
    hr.id;
