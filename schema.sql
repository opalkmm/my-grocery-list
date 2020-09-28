CREATE DATABASE grocery_listDB;
USE grocery_listDB;

-- Create the table plans.
CREATE TABLE items
(
id int NOT NULL AUTO_INCREMENT,
items varchar(255) NOT NULL,
PRIMARY KEY (id)
);

-- Insert a set of records.
INSERT INTO items (items) 
VALUES ('Kale'),('Kombucha'),('Eggs'),('Beef');

SELECT * FROM items;