UPDATE towns 
SET name = 'Castelló de la Plana'
WHERE name = 'Castelló';

UPDATE help_requests
SET town_id = (
    SELECT id FROM towns WHERE name = 'L''Alcúdia'
)
WHERE town_id = (
    SELECT id FROM towns WHERE name = 'Alcudia'
);

DELETE FROM towns 
WHERE name = 'Alcudia'