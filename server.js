const inquirer = require("inquirer");
require('console.table');
const mysql = require('mysql2');

// const { db } = require('./config/connections');
const db = require('./config/connections');


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
            "Quit application",
        ],
        loop: false,
    })
    .then((data) => {
        // console.log(data.menuprompt);
        switch (data.menuprompt) {
            case "View all departments":
                console.log("\nThis is all your current departments\n------------------------------------");
                viewDepartments();
                break;
            case "View all roles":
                console.log("\nThis is viewing all available roles\n------------------------------------");
                viewRoles();
                break;
            case "View all employees":
                console.log("\nThis is viewing all employees information\n-----------------------------------------");

                viewEmployees();
                break;
            case "Update an employee role":
                console.log("This is updating an employee role");
                updateEmployeesRole();
                break;
            case "Add a department":
                console.log("This is adding a department");
                addDepartment();
                break;
            case "Add a role":
                console.log("This is adding a role");
                addRole();
                break;
            case "Add an employee":
                console.log("This is adding an employee");
                addEmployee();
                break;
            case "Quit application":
                console.log("Closing down now...\nThank you for using our application!");
                db.end();
                break;
            default:
                break;
        }

    })
}

menu();

viewDepartments = () => {
    db.query(`SELECT id AS Department_ID, department_name AS Department_Name 
    FROM department`, function (err, res) {
        if (err) throw err;
        console.table(res)
    menu();
    })
}

viewRoles = () => {
    db.query(`SELECT role.id AS Role_ID, role.title AS Job_Title, CONCAT('$', FORMAT (role.salary, 0)) AS Salary, department.department_name AS Department 
    FROM role 
    JOIN department ON role.department_id = department.id;`, function (err, res) {
        if (err) throw err;
        console.table(res);
    menu();
    })
}

viewEmployees = () => {
    db.query(`SELECT e.id AS Employee_ID, e.first_name AS First_Name, e.last_name AS Last_Name, role.title AS Job_Title, CONCAT('$', FORMAT (role.salary, 0)) AS Salary, department.department_name AS Department, CONCAT(m.first_name, ' ', m.last_name) AS Manager 
    FROM employee e
    LEFT JOIN role ON e.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee m ON m.id = e.manager_id`, function (err, res) {
        if (err) throw err;
        console.table(res);
    menu();
    })
}

updateEmployeesRole = () => {
    let employeeArray = [];
    let rolesArray = [];
    inquirer.prompt([
        {
            type: "number",
            name: "employeeId",
            message: "What is the employee's ID number you would like to update?",
        }
    ])
    .then((data) => {
            inputId = data.employeeId;
            db.query(`SELECT employee.id AS Employee_ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Role 
        FROM employee 
        JOIN role ON employee.role_id = role.id
        WHERE ?`, { "employee.id": inputId }, (err, res) => {
                if (err) throw err;
                employeeArray = res.map(employee => (
                    {
                        name: employee.First_Name,
                        value: employee.Employee_ID
                    }
                ));
                if (employeeArray.length === 0) {
                    console.log("That Id is not in the database");
                    return updateEmployeesRole()
                }
                console.table(res);

                db.query("SELECT * FROM role", (err, res) => {
                    if (err) throw err;
                    rolesArray = res.map(role => (
                        {
                            name: role.title,
                            value: role.id
                        }
                    ))
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "employeeConfirm",
                            message: "Is this the correct employee?",
                            choices: [
                                "Yes",
                                "No",
                            ],
                            loop: false,
                        }
                    ])
                        .then((data) => {
                            if (data.employeeConfirm === "No") {
                                console.log("\nGoing back to the main menu.\n");
                                menu();
                                return;
                            }
                            inquirer.prompt([
                                {
                                    type: "list",
                                    name: "roleConfirm",
                                    message: "What role would you like to assign?",
                                    choices: rolesArray,
                                    loop: false,
                                }
                            ])
                                .then((data) => {
                                    db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [data.roleConfirm, inputId], (err, res) => {
                                        if (err) throw err;
                                        console.log("\nUpdated employee's role successfully!\n");
                                        menu();
                                        return;
                                    })
                                })
                        })
                })
            })
        })
}
