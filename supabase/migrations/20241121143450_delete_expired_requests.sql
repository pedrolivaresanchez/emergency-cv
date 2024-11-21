create extension if not exists pg_cron with schema extensions;
create extension if not exists http with schema extensions;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

select cron.schedule (
    'delete_expired_records', -- name of the cron job
    '0 4 * * *', -- Every day at 4:00am (GMT)
    $$ delete from public.help_requests where created_at < now() - interval '7 days'; $$
);

alter table public.help_requests add column expiry_notice_sent boolean default false;

create index if not exists idx_help_requests_created_at on public.help_requests using btree (created_at, expiry_notice_sent, type);

create or replace function send_request_expiry_notices() returns void as $$
declare
    api_key text;
    email_body text;
    email_list text[];
    help_request_ids bigint[];
    status_code int;
begin
    -- Get the RESEND_API_KEY
    select decrypted_secret into api_key
    from vault.decrypted_secrets
    where name = 'RESEND_API_KEY'
    limit 1;

    -- If the API key is not found, do nothing
    if api_key is null then
        return;
    end if;

    -- Construct the email body
    email_body := 'Tu solicitud de ayuda en ajudadana.es caducará en 1 día y será eliminada automáticamente. Si todavía necesitas ayuda, considera crear una solicitud nueva con datos actualizados.';

    -- Collect email addresses and help request IDs
    select array_agg(u.email), array_agg(h.id)
    into email_list, help_request_ids
    from public.help_requests h
    join auth.users u on h.user_id = u.id
    where h.created_at < now() - interval '6 days'
      and h.created_at >= now() - interval '7 days'
      and h.expiry_notice_sent = false
      and h.status = 'active'
      and h.type = 'necesita'
      limit 50;

    -- If there are no emails to send, do nothing
    if email_list is null then
        return;
    end if;

    -- Send the email using the resend API
    select status into status_code from http((
      'POST',
      'https://api.resend.com/emails',
      array[http_header('Authorization','Bearer ' || api_key)],
      'application/json',
      '{
        "from": "Ajudadana <info@ajudadana.es>",
        "to": ["' || array_to_string(email_list, '","') || '"],
        "subject": "Tu solicitud en Ajudadana.es será eliminada",
        "html": "<p>' || email_body || '</p>"
      }'
    )::http_request);

    if status_code <> 200 then
       return;
    end if;

    -- Update the help requests to mark the expiry notice as sent
    update help_requests set expiry_notice_sent = true where id = any(help_request_ids);
end;
$$ language plpgsql;

create or replace function send_offer_expiry_notices() returns void as $$
declare
    api_key text;
    email_body text;
    email_list text[];
    help_request_ids bigint[];
    status_code int;
begin
    -- Get the RESEND_API_KEY
    select decrypted_secret into api_key
    from vault.decrypted_secrets
    where name = 'RESEND_API_KEY'
    limit 1;

    -- If the API key is not found, do nothing
    if api_key is null then
        return;
    end if;

    -- Construct the email body
    email_body := 'Tu oferta de ayuda en ajudadana.es caducará en 1 día y será eliminada automáticamente. Si lo deseas, crea una oferta de ayuda nueva con datos actualizados.';

    -- Collect email addresses and help request IDs
    select array_agg(u.email), array_agg(h.id)
    into email_list, help_request_ids
    from public.help_requests h
    join auth.users u on h.user_id = u.id
    where h.created_at < now() - interval '6 days'
      and h.created_at >= now() - interval '7 days'
      and h.expiry_notice_sent = false
      and h.type = 'ofrece'
      limit 50;

    -- If there are no emails to send, do nothing
    if email_list is null then
        return;
    end if;

    -- Send the email using the resend API
    select status into status_code from http((
      'POST',
      'https://api.resend.com/emails',
      array[http_header('Authorization','Bearer ' || api_key)],
      'application/json',
      '{
        "from": "Ajudadana <info@ajudadana.es>",
        "to": ["' || array_to_string(email_list, '","') || '"],
        "subject": "Tu oferta de ayuda en Ajudadana.es será eliminada",
        "html": "<p>' || email_body || '</p>"
      }'
    )::http_request);

    if status_code <> 200 then
       return;
    end if;

    -- Update the help requests to mark the expiry notice as sent
    update help_requests set expiry_notice_sent = true where id = any(help_request_ids);
end;
$$ language plpgsql;
