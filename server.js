const inquirer = require("inquirer");
require("console.table");

const db = require("./config/connections");

// Starting the app
function menu() {
  inquirer
    .prompt({
      type: "list",
      name: "menuprompt",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Update an employee role",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Show employees by manager",
        "Quit application",
      ],
      loop: false,
    })
    .then((data) => {
      switch (data.menuprompt) {
        case "View all departments":
          console.log("\n    ------------------------------------\n    This is all your current departments\n    ------------------------------------");
          viewDepartments();
          break;
        case "View all roles":
          console.log("\n    -----------------------------------\n    This is viewing all available roles\n    -----------------------------------");
          viewRoles();
          break;
        case "View all employees":
          console.log("\n    --------------------------------------------\n    This is viewing every employee's information\n    --------------------------------------------");
          viewEmployees();
          break;
        case "Update an employee role":
          console.log("\n    ---------------------------------------\n    You are now updating an employee's role\n    ---------------------------------------");
          updateEmployeesRole();
          break;
        case "Add a department":
          console.log("\n    -------------------------------------\n    You are now creating a new department\n    -------------------------------------");
          addDepartment();
          break;
        case "Add a role":
          console.log("\n    -------------------------------\n    You are now creating a new role\n    -------------------------------");
          addRole();
          break;
        case "Add an employee":
          console.log("\n    ---------------------------------\n    You are now adding a new employee\n    ---------------------------------");
          addEmployee();
          break;
        case "Show employees by manager":
          employeeByManager();
          break;
        case "Quit application":
          console.log("Closing down now...\nThank you for using our application!");
          db.end();
          process.exit(0);
        default:
          break;
      }
    });
}
// Initialize
menu();

// Views a table of all departments
viewDepartments = () => {
  db.query(
    `SELECT id AS "Department ID", department_name AS "Department Name" 
    FROM department`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      return menu();
    }
  );
};

// Views a table of all roles
viewRoles = () => {
  db.query(
    `SELECT role.id AS "Role ID", role.title AS "Job Title", CONCAT('$', FORMAT (role.salary, 0)) AS Salary, department.department_name AS Department 
    FROM role 
    JOIN department ON role.department_id = department.id;`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      return menu();
    }
  );
};

// Views a table of all employees
viewEmployees = () => {
  db.query(
    `SELECT e.id AS "Employee ID", e.first_name AS "First Name", e.last_name AS "Last Name", role.title AS "Job Title", CONCAT('$', FORMAT (role.salary, 0)) AS Salary, department.department_name AS Department, CONCAT(m.first_name, ' ', m.last_name) AS Manager 
    FROM employee e
    LEFT JOIN role ON e.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee m ON e.manager_id = m.id`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      return menu();
    }
  );
};

// Lets a user update an employee's role
updateEmployeesRole = () => {
  let employeeArray = [];
  let rolesArray = [];
  inquirer
    .prompt([
      {
        type: "number",
        name: "employeeId",
        message: "What is the employee's ID number you would like to update?",
      },
    ])
    .then((data) => {
      inputId = data.employeeId;
      db.query(
        `SELECT employee.id AS "Employee ID", employee.first_name AS "First Name", employee.last_name AS "Last Name", role.title AS Role 
        FROM employee 
        JOIN role ON employee.role_id = role.id
        WHERE ?`,
        { "employee.id": inputId },
        (err, res) => {
          if (err) throw err;
          employeeArray = res.map((employee) => ({
            name: employee.first_name,
            value: employee.employee_id,
          }));
          if (employeeArray.length === 0) {
            console.log("\n    ------------------------------\n    That id is not in the database\n    ------------------------------");
            return updateEmployeesRole();
          }
          console.log(`\n`);
          console.table(res);
          db.query("SELECT * FROM role", (err, res) => {
            if (err) throw err;
            rolesArray = res.map((role) => ({
              name: role.title,
              value: role.id,
            }));

            // Checks if the user has selected the right employee
            inquirer
              .prompt([
                {
                  type: "list",
                  name: "employeeConfirm",
                  message: "Is this the correct employee?",
                  choices: ["Yes", "No"],
                  loop: false,
                },
              ])
              .then((data) => {
                if (data.employeeConfirm === "No") {
                  console.log("\nGoing back to the main menu.\n");
                  return menu();
                }
                inquirer
                  .prompt([
                    {
                      type: "list",
                      name: "roleConfirm",
                      message: "What role would you like to assign?",
                      choices: rolesArray,
                      loop: false,
                    },
                  ])
                  .then((data) => {
                    db.query(
                      `UPDATE employee SET role_id = ? WHERE id = ?`,
                      [data.roleConfirm, inputId],
                      (err, res) => {
                        if (err) throw err;
                        console.log("\n    -------------------------------------\n    Updated employee's role successfully!\n    -------------------------------------");
                        viewEmployees();
                      }
                    );
                  });
              });
          });
        }
      );
    });
};

// Lets the user add a new department
addDepartment = () => {
  inquirer
    .prompt({
      type: "input",
      name: "newDepartment",
      message: "What is the name of the department you would like to add?",
      validate: (newDepartment) => {
        if (newDepartment) {
          return true;
        } else {
          console.log("\nPlease enter a department name.");
          return false;
        }
      },
    })
    .then((data) => {
      db.query(
        `INSERT INTO department SET ?`,
        { department_name: data.newDepartment },
        (err, res) => {
          if (err) throw err;
        }
      );
      console.log("\n    ------------------------------------\n    New department successfully created!\n    ------------------------------------");
      viewDepartments();
    });
};

// Lets the user add a new role
addRole = () => {
  let departmentsArray = [];
  db.query(`SELECT * FROM department`, (err, res) => {
    if (err) throw err;
    departmentsArray = res.map((department) => ({
      name: department.department_name,
      value: department.id,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          name: "rolename",
          message: "What is the name of the role you would like to add?",
        },
        {
          type: "input",
          name: "rolesalary",
          message: "What is the salary for this role?",
        },
        {
          type: "list",
          name: "roledepartment",
          message: "What department does this role belong to?",
          choices: departmentsArray,
          loop: false,
        },
      ])
      .then((data) => {
        db.query(
          `INSERT INTO role SET ?`,
          {
            title: data.rolename,
            salary: data.rolesalary,
            department_id: data.roledepartment,
          },
          (err, res) => {
            if (err) throw err;
          }
        );
        console.log("\n    ------------------------------\n    New role successfully created!\n    ------------------------------");
        viewRoles();
      });
  });
};

// Lets the user add a new employee
addEmployee = () => {
  let rolesArray = [];
  let managerArray = [];
  const isManager = { name: "Manager", value: null };
  db.query(`SELECT role.id, role.title FROM role`, (err, res) => {
    if (err) throw err;
    rolesArray = res.map((role) => ({
      name: role.title,
      value: role.id,
    }));
    db.query(
      `SELECT DISTINCT e.manager_id, CONCAT(m.first_name, ' ', m.last_name) AS Manager 
        FROM employee e
        JOIN employee m ON e.manager_id = m.id`,
      (err, res) => {
        if (err) throw err;
        managerArray = res.map((manager) => ({
          name: manager.Manager,
          value: manager.manager_id,
        }));
        managerArray.unshift(isManager);
        inquirer
          .prompt([
            {
              type: "input",
              name: "firstname",
              message: "Enter the employee's first name.",
            },
            {
              type: "input",
              name: "lastname",
              message: "Enter the employee's last name.",
            },
            {
              type: "list",
              name: "employeeRole",
              message: "What is the employee's role?",
              choices: rolesArray,
              loop: false,
            },
            {
              type: "list",
              name: "employeeManager",
              message:
                "Who is the employee's manager?\n  If they are the manager select Manager.\n  ----------------------------",
              choices: managerArray,
              loop: false,
            },
          ])
          .then((data) => {
            db.query(
              `INSERT INTO employee SET ?`,
              {
                first_name: data.firstname,
                last_name: data.lastname,
                role_id: data.employeeRole,
                manager_id: data.employeeManager,
              },
              (err, res) => {
                if (err) throw err;
              }
            );
            console.log("\n    --------------------------------\n    New Employee successfully Added!\n    --------------------------------");
            viewEmployees();
          });
      }
    );
  });
};

// View a table of employees by manager selected
employeeByManager = () => {
  let managerArray = [];
  db.query(
    `SELECT DISTINCT e.manager_id, CONCAT(m.first_name, ' ', m.last_name) AS Manager 
        FROM employee e
        JOIN employee m ON e.manager_id = m.id`,
    (err, res) => {
      if (err) throw err;
      managerArray = res.map((manager) => ({
        name: manager.Manager,
        value: manager.manager_id,
      }));
      inquirer
        .prompt([
          {
            type: "list",
            name: "manager_id",
            message: "Which Manager do you want to view Employees for?",
            choices: managerArray,
            loop: false,
          },
        ])
        .then((data) => {
          db.query(
            `SELECT e.first_name AS "First Name", e.last_name AS "Last Name", CONCAT(m.first_name, ' ', m.last_name) AS Manager
                FROM employee e
                INNER JOIN employee m
                ON e.manager_id = m.id 
                WHERE e.manager_id = ?`,
            data.manager_id,
            (err, res) => {
              if (err) throw err;
              console.log("\n");
              console.table(res);
              return menu();
            }
          );
        });
    }
  );
};
