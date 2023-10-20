-- PosgreSQL queries:
--
CREATE TABLE IF NOT EXISTS "Employee" (
    "id" INT,
    "department_id" INT,
    "name" VARCHAR(16),
    "surname" VARCHAR(16)
);

CREATE TABLE IF NOT EXISTS "Department" (
    "id" INT,
    "name" VARCHAR(16)
);

CREATE TABLE IF NOT EXISTS "Statement" (
    "id" INT,
    "parent_id" INT,
    "amount" DECIMAL(10, 2),
    "date" DATE
);

CREATE TABLE IF NOT EXISTS "Donation" (
    "id" INT,
    "parent_id" INT,
    "date" DATE,
    "amount" VARCHAR(16)
);

CREATE TABLE IF NOT EXISTS "Rate" (
    "date" DATE,
    "sign" VARCHAR(3),
    "value" DECIMAL(25, 17)
);
