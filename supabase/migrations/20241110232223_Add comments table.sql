create table comments (
    id bigserial primary key,
    help_request_id bigint not null references help_requests(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete set null,
    user_name varchar(255) not null,
    user_phone varchar(20) not null,
    comment text not null,
    created_at timestamp default current_timestamp,
    is_solved boolean default false
);

-- Índice para mejorar la consulta por help_request_id
create index idx_comments_help_request_id on comments(help_request_id);

alter table comments enable row level security;

create policy "Authenticated users can read comments"
on comments
for select
using (auth.role() = 'authenticated');

create policy "Users can insert their own comments"
on comments
for insert
with check (user_id = auth.uid());

-- Política para permitir UPDATE solo si el user_id coincide con el ID del usuario autenticado
create policy "Users can update their own comments"
on comments
for update
using (user_id = auth.uid());

-- Política para permitir DELETE solo si el user_id coincide con el ID del usuario autenticado
create policy "Users can delete their own comments"
on comments
for delete
using (user_id = auth.uid());

alter table comments force row level security;