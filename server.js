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
                updateEmployees();
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

const viewDepartments = () => {
    db.query("SELECT id AS Department_ID, department_name AS Department_Name FROM department", function (err, res) {
        if (err) throw err;
        console.table(res)
    menu();
    })
}

const viewRoles = () => {
    db.query("SELECT role.id AS Role_ID, role.title AS Job_Title, CONCAT('$', FORMAT (role.salary, 0)) AS Salary, department.department_name AS Department FROM role JOIN department ON role.department_id = department.id;", function (err, res) {
        if (err) throw err;
        console.table(res);
    menu();
    })
}

const viewEmployees = () => {
    db.query("SELECT employee.id AS Employee_ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Job_Title, CONCAT('$', FORMAT (role.salary, 0)) AS Salary, department.department_name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id", function (err, res) {
        if (err) throw err;
        console.table(res);
    menu();
    })
}



