DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department(
    id INTEGER NOT NULL AUTO_INCREMENT,
    department VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE jobrole (
    id INTEGER NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(7,0) NOT NULL,
    department_id INTEGER(10),
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id) 
);

CREATE TABLE employee (
    id INTEGER NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30)NOT NULL ,
    role_id INTEGER(10) NOT NULL,
    manager_id INTEGER(10),
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES jobrole (id),
    FOREIGN KEY (manager_id) REFERENCES department(id)
);

INSERT INTO department (department)
VALUES ("SALES"), ("ENGINEERING"), ("LEGAL"), ("ACCOUNTING");

INSERT INTO jobrole (title, salary, department_id)
VALUES ("Director of Legal", 250000, 3), ("Attorney", 175000, 3), ("Director of Sales", 250000, 1), ("Sales Person", 125000, 1), ("Director of Engineering", 250000, 2), ("Software Engineer", 125000, 2), ("Software Developer", 90000, 2), ("Director of Accounting", 250000, 4), ("Accountant", 85000, 4);


SELECT first_name, last_name, title, department, salary FROM employee AS maintable
INNER JOIN jobrole AS o
ON maintable.role_id = o.id
INNER JOIN department AS ot
ON o.department_id = ot.id;

