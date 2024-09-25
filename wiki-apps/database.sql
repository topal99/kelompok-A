CREATE TABLE users_tb (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE type_tb (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE heroes_tb (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type_id INT REFERENCES type_tb(id) ON DELETE CASCADE,
    photo VARCHAR(255),
    user_id INT REFERENCES users_tb(id) ON DELETE CASCADE
);

-- Insert example data
INSERT INTO users_tb (email, username, password) VALUES ('user1@example.com', 'user1', 'hashed_password');
INSERT INTO type_tb (name) VALUES ('Warrior'), ('Mage'), ('Archer');
INSERT INTO heroes_tb (name, type_id, photo, user_id) VALUES ('Arthur', 1, 'arthur_photo_url', 1), ('Merlin', 2, 'merlin_photo_url', 1);
