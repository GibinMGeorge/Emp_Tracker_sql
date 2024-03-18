INSERT INTO department (name)
VALUES ("Engineering"),
       ("Sales"),
       ("Finance"),
       ("Legal");

INSERT INTO role (department_id, title, salary)
VALUES (1, "Software Engineer", 125000),
       (2, "Sales Lead", 85000),
       (1, "Junior Software Engineer", 75000),
       (3, "Accountant", 90000),
       (2, "Account Manager", 110000),
       (1, "Lead Data Engineer",115000),
       (4, "Lawyer", 100000);

       
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
  ("John", "Doe", 1, NULL), 
  ("Jane", "Doe", 2, 1),    
  ("Jon", "Snow", 1, 1),    
  ("Peter", "Parker", 3, NULL),
  ("Doe", "Jon", 4, NULL),     
  ("Random", "Guy", 1, 1); 
 
