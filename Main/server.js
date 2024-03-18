const inquirer = require('inquirer');
const mysql = require('mysql');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'emp_db',
});

// Connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL server.');
  startApp();
});

// Function to start the application
function startApp() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Update employee managers',
          'View employees by manager',
          'View employees by department',
          'Delete a department',
          'Delete a role',
          'Delete an employee',
          'Exit',
        ],
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Update employee managers':
          updateEmployeeManager();
          break;
        case 'View employees by manager':
          viewEmployeesByManager();
          break;
        case 'View employees by department':
          viewEmployeesByDepartment();
          break;
        case 'Delete a department':
          deleteDepartment();
          break;
        case 'Delete a role':
          deleteRole();
          break;
        case 'Delete an employee':
          deleteEmployee();
          break;
        case 'Exit':
          connection.end();
          break;
      }
    });
}

// Function to view all departments
function viewDepartments() {
  connection.query('SELECT id, name FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

// Function to view all roles
function viewRoles() {
  connection.query(
    'SELECT r.id, r.title, r.salary, d.name AS department FROM role r JOIN department d ON r.department_id = d.id',
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    }
  );
}

// Function to view all employees
function viewEmployees() {
  connection.query(
    `SELECT 
        e.id, e.first_name, e.last_name, 
        r.title AS job_title, d.name AS department, 
        r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    JOIN role r ON e.role_id = r.id
    JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    }
  );
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:',
      },
    ])
    .then((answers) => {
      connection.query(
        'INSERT INTO department SET ?',
        { name: answers.name },
        (err) => {
          if (err) throw err;
          console.log('Department added successfully.');
          startApp();
        }
      );
    });
}

// Function to add a role
function addRole() {
  // Write code to prompt user for role details and insert into database
}

// Function to add an employee
function addEmployee() {
  // Write code to prompt user for employee details and insert into database
}

// Function to update an employee role
function updateEmployeeRole() {
  // Write code to prompt user for employee and new role details and update database
}

// Function to update employee managers
function updateEmployeeManager() {
  // Write code to prompt user for employee and new manager details and update database
}

// Function to view employees by manager
function viewEmployeesByManager() {
  // Write code to execute SQL query for viewing employees by manager
}

// Function to view employees by department
function viewEmployeesByDepartment() {
  // Write code to execute SQL query for viewing employees by department
}

// Function to delete a department
function deleteDepartment() {
  // Write code to prompt user for department to delete and execute SQL delete query
}

// Function to delete a role
function deleteRole() {
  // Write code to prompt user for role to delete and execute SQL delete query
}

// Function to delete an employee
function deleteEmployee() {
  // Write code to prompt user for employee to delete and execute SQL delete query
}
