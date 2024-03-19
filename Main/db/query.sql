-- View all departments
SELECT id, name FROM department;

-- View all roles
SELECT r.id, r.title, r.salary, d.name AS department
FROM role r
JOIN department d ON r.department_id = d.id;

-- View all employees
SELECT 
    e.id, e.first_name, e.last_name, 
    r.title AS job_title, d.name AS department, 
    r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM employee e
JOIN role r ON e.role_id = r.id
JOIN department d ON r.department_id = d.id
LEFT JOIN employee m ON e.manager_id = m.id;

-- Add a department
INSERT INTO department (name)
VALUES ('<department_name>');

-- Add a role
INSERT INTO role (title, salary, department_id)
VALUES ('<role_title>', <salary>, <department_id>);

-- Add an employee
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('<first_name>', '<last_name>', <role_id>, <manager_id>);

-- Update an employee role
UPDATE employee
SET role_id = <new_role_id>
WHERE id = <employee_id>;

-- Update employee managers
UPDATE employee
SET manager_id = <new_manager_id>
WHERE id = <employee_id>;

-- View employees by manager
SELECT 
    m.id AS manager_id, 
    CONCAT(m.first_name, ' ', m.last_name) AS manager_name, 
    e.id AS employee_id, 
    CONCAT(e.first_name, ' ', e.last_name) AS employee_name
FROM employee e
JOIN employee m ON e.manager_id = m.id
ORDER BY manager_name;

-- View employees by department
SELECT 
    d.id AS department_id,
    d.name AS department_name,
    e.id AS employee_id,
    CONCAT(e.first_name, ' ', e.last_name) AS employee_name
FROM employee e
JOIN department d ON e.department_id = d.id
ORDER BY department_name;


-- Delete departments
DELETE FROM department
WHERE id = <department_id>;

-- Delete roles
DELETE FROM role
WHERE id = <role_id>;

-- Delete employees
DELETE FROM employee
WHERE id = <employee_id>;

-- View the total utilized budget of each department

SELECT 
    d.id AS department_id,
    d.name AS department_name,
    SUM(r.salary) AS total_budget
FROM 
    role r
JOIN 
    department d ON r.department_id = d.id
GROUP BY 
    d.id, d.name`;