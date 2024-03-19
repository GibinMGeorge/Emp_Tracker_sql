import inquirer from 'inquirer';
import mysql from 'mysql2/promise';

// Create a MySQL connection
const connection = await mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'emp_db',
});

// Connect to the database
console.log('Connected to the MySQL server.');
startApp();

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
          'View total utilized budget of each department',
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
        case 'View total utilized budget of each department':
          viewTotalBudgetByDepartment();
          break;
        case 'Exit':
          connection.end();
          break;
      }
    });
}

// Function to view all departments
async function viewDepartments() {
  try {
    const [rows, fields] = await connection.query('SELECT id, name FROM department');
    console.table(rows);
    startApp();
  } catch (error) {
    console.error('Error viewing departments:', error);
    startApp();
  }
}

// Function to view all roles
async function viewRoles() {
  try {
    const [rows, fields] = await connection.query('SELECT r.id, r.title, r.salary, d.name AS department FROM role r JOIN department d ON r.department_id = d.id');
    console.table(rows);
    startApp();
  } catch (error) {
    console.error('Error viewing roles:', error);
    startApp();
  }
}

// Function to view all employees
async function viewEmployees() {
  try {
    const [rows, fields] = await connection.query(`SELECT 
      e.id, e.first_name, e.last_name, 
      r.title AS job_title, d.name AS department, 
      r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    JOIN role r ON e.role_id = r.id
    JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id`);
    console.table(rows);
    startApp();
  } catch (error) {
    console.error('Error viewing employees:', error);
    startApp();
  }
}

// Function to add a department
async function addDepartment() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:',
      },
    ]);
    await connection.query('INSERT INTO department SET ?', { name: answers.name });
    console.log('Department added successfully.');
    startApp();
  } catch (error) {
    console.error('Error adding department:', error);
    startApp();
  }
}

// Function to add a role
async function addRole() {
  try {
    const answers = await inquirer.prompt([
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
    ]);
    await connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.title, answers.salary, answers.department_id]);
    console.log('Role added successfully.');
    startApp();
  } catch (error) {
    console.error('Error adding role:', error);
    startApp();
  }
}

// Function to add an employee
async function addEmployee() {
  try {
    const answers = await inquirer.prompt([
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
    ]);
    await connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
    console.log('Employee added successfully.');
    startApp();
  } catch (error) {
    console.error('Error adding employee:', error);
    startApp();
  }
}

// Function to update an employee role
async function updateEmployeeRole() {
  try {
    const answers = await inquirer.prompt([
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
    ]);
    await connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.new_role_id, answers.employee_id]);
    console.log('Employee role updated successfully.');
    startApp();
  } catch (error) {
    console.error('Error updating employee role:', error);
    startApp();
  }
}

// Function to update employee managers
async function updateEmployeeManager() {
  try {
    const answers = await inquirer.prompt([
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
    ]);
    await connection.query('UPDATE employee SET manager_id = ? WHERE id = ?', [answers.new_manager_id, answers.employee_id]);
    console.log('Employee manager updated successfully.');
    startApp();
  } catch (error) {
    console.error('Error updating employee manager:', error);
    startApp();
  }
}

// Function to view employees by manager
async function viewEmployeesByManager() {
  try {
    const [rows, fields] = await connection.query(`SELECT 
        m.id AS manager_id, 
        CONCAT(m.first_name, ' ', m.last_name) AS manager_name, 
        e.id AS employee_id, 
        CONCAT(e.first_name, ' ', e.last_name) AS employee_name
      FROM employee e
      JOIN employee m ON e.manager_id = m.id
      ORDER BY manager_name`);
    console.table(rows);
    startApp();
  } catch (error) {
    console.error('Error viewing employees by manager:', error);
    startApp();
  }
}

// Function to view employees by department
async function viewEmployeesByDepartment() {
  try {
    const [rows, fields] = await connection.query(`SELECT 
        d.id AS department_id,
        d.name AS department_name,
        e.id AS employee_id,
        CONCAT(e.first_name, ' ', e.last_name) AS employee_name
      FROM employee e
    JOIN department d ON e.department_id = d.id
    ORDER BY department_name;`);
    console.table(rows);
    startApp();
  } catch (error) {
    console.error('Error viewing employees by department:', error);
    startApp();
  }
}

// Function to delete a department
async function deleteDepartment() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'department_id',
        message: 'Enter the ID of the department to delete:',
      },
    ]);
    await connection.query('DELETE FROM department WHERE id = ?', [answers.department_id]);
    console.log('Department deleted successfully.');
    startApp();
  } catch (error) {
    console.error('Error deleting department:', error);
    startApp();
  }
}

// Function to delete a role
async function deleteRole() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'role_id',
        message: 'Enter the ID of the role to delete:',
      },
    ]);
    await connection.query('DELETE FROM role WHERE id = ?', [answers.role_id]);
    console.log('Role deleted successfully.');
    startApp();
  } catch (error) {
    console.error('Error deleting role:', error);
    startApp();
  }
}

// Function to delete an employee
async function deleteEmployee() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'employee_id',
        message: 'Enter the ID of the employee to delete:',
      },
    ]);
    await connection.query('DELETE FROM employee WHERE id = ?', [answers.employee_id]);
    console.log('Employee deleted successfully.');
    startApp();
  } catch (error) {
    console.error('Error deleting employee:', error);
    startApp();
  }
}

// Function to view total utilized budget of each department
// Function to view total utilized budget of each department
async function viewTotalBudgetByDepartment() {
  try {
    const query = `
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

    const results = await connection.query(query);
    console.table(results);
    startApp(); // Assuming startApp() is a function to initiate further actions
  } catch (error) {
    console.error('Error viewing total budget by department:', error);
    startApp(); // Assuming startApp() is a function to handle errors and continue the application flow
  }
}


 