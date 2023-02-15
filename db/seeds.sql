INSERT INTO department (department_name)
VALUES 
("Sales"), 
("Accounting"), 
("Technology");

INSERT INTO role (title, salary, department_id)
VALUES 
("Sales Manager", 100000, 1),
("Sales Intern", 10000, 1),
("Accounting Boss", 200000, 2),
("Accountant", 20000, 2),
("Accountant Intern", 2000, 2),
("Engingeer", 300000, 3),
("Tech Bro", 30000, 3),
("Tech Boy", 3000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Anne", "Nap", 1, NULL),
("Barry", "Reed", 2, 1),
("Carl", "Ross", 2, 1),
("Derik", "Quill", 3, NULL),
("Ethan", "James", 4, 4),
("Frank", "Alex", 5, 4),
("Gary", "Mort", 6, NULL),
("Holly", "Lily", 7, 7),
("Isiah", "Tim", 7, 7),
("John", "Paulson", 8, 7),
("Kelly", "Yates", 8, 7),
("Luke", "Brown", 8, 7);