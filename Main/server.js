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
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the title of the role:',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the salary for the role:',
        },
        {
          type: 'input',
          name: 'department_id',
          message: 'Enter the department ID for the role:',
        },
      ])
      .then((answers) => {
        connection.query(
          'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
          [answers.title, answers.salary, answers.department_id],
          (err) => {
            if (err) throw err;
            console.log('Role added successfully.');
            startApp();
          }
        );
    });
}
  

// Function to add an employee
function addEmployee() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'first_name',
          message: "Enter the employee's first name:",
        },
        {
          type: 'input',
          name: 'last_name',
          message: "Enter the employee's last name:",
        },
        {
          type: 'input',
          name: 'role_id',
          message: "Enter the employee's role ID:",
        },
        {
          type: 'input',
          name: 'manager_id',
          message: "Enter the employee's manager ID:",
        },
      ])
      .then((answers) => {
        connection.query(
          'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
          [answers.first_name, answers.last_name, answers.role_id, answers.manager_id],
          (err) => {
            if (err) throw err;
            console.log('Employee added successfully.');
            startApp();
          }
        );
    });
}

// Function to update an employee role
function updateEmployeeRole() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'employee_id',
          message: 'Enter the ID of the employee to update:',
        },
        {
          type: 'input',
          name: 'new_role_id',
          message: 'Enter the new role ID for the employee:',
        },
      ])
      .then((answers) => {
        connection.query(
          'UPDATE employee SET role_id = ? WHERE id = ?',
          [answers.new_role_id, answers.employee_id],
          (err) => {
            if (err) throw err;
            console.log('Employee role updated successfully.');
            startApp();
          }
        );
    });
}

// Function to update employee managers
function updateEmployeeManager() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'employee_id',
          message: 'Enter the ID of the employee to update:',
        },
        {
          type: 'input',
          name: 'new_manager_id',
          message: 'Enter the ID of the new manager for the employee:',
        },
      ])
      .then((answers) => {
        connection.query(
          'UPDATE employee SET manager_id = ? WHERE id = ?',
          [answers.new_manager_id, answers.employee_id],
          (err) => {
            if (err) throw err;
            console.log('Employee manager updated successfully.');
            startApp();
          }
        );
    });
}
  

// Function to view employees by manager
function viewEmployeesByManager() {
    connection.query(
      `SELECT 
          m.id AS manager_id, 
          CONCAT(m.first_name, ' ', m.last_name) AS manager_name, 
          e.id AS employee_id, 
          CONCAT(e.first_name, ' ', e.last_name) AS employee_name
        FROM employee e
        JOIN employee m ON e.manager_id = m.id
        ORDER BY manager_name`,
      (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
      }
    );
}

// Function to view employees by department
function viewEmployeesByDepartment() {
    connection.query(
      `SELECT 
          d.id AS department_id,
          d.name AS department_name,
          e.id AS employee_id,
          CONCAT(e.first_name, ' ', e.last_name) AS employee_name
        FROM employee e
        JOIN department d ON e.department_id = d.id
        ORDER BY department_name`,
      (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
      }
    );
}
  
  // Function to delete a department
  function deleteDepartment() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'department_id',
          message: 'Enter the ID of the department to delete:',
        },
      ])
      .then((answers) => {
        connection.query(
          'DELETE FROM department WHERE id = ?',
          [answers.department_id],
          (err) => {
            if (err) throw err;
            console.log('Department deleted successfully.');
            startApp();
          }
        );
    });
}
  
  // Function to delete a role
  function deleteRole() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'role_id',
          message: 'Enter the ID of the role to delete:',
        },
      ])
      .then((answers) => {
        connection.query(
          'DELETE FROM role WHERE id = ?',
          [answers.role_id],
          (err) => {
            if (err) throw err;
            console.log('Role deleted successfully.');
            startApp();
          }
        );
    });
}
  
  // Function to delete an employee
  function deleteEmployee() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'employee_id',
          message: 'Enter the ID of the employee to delete:',
        },
      ])
      .then((answers) => {
        connection.query(
          'DELETE FROM employee WHERE id = ?',
          [answers.employee_id],
          (err) => {
            if (err) throw err;
            console.log('Employee deleted successfully.');
            startApp();
          }
        );
    });
}
 