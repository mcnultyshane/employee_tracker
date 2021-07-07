const mysql = require('mysql');
const { printTable } = require('console-table-printer');
const inquirer = require('inquirer');
const { fetchAsyncQuestionPropertyQuestionProperty } = require('inquirer/lib/utils/utils');


const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    // add password protection.
    password: 'October31',
    database: 'employee_db'
});
connection.connect((err) => {
    if (err) throw (err);
    console.log(`connected as id: ${connection.threadId}`);
    start();

})

// Password and username login
// --------------------------------
// What would you like to do questions
// add employee
// view all employees
// update employee roles
// remove employees


// ===============================

// add employee inquirer drops out
// update employee

// ===============================

const start = function () {
    // console.log("Welcome to the Employee Manager");
    inquirer.prompt([{
        type: 'list',
        name: 'toDo',
        message: 'What do you want to do?',
        choices: [
            "ADD AN EMPLOYEE",
            "VIEW ALL EMPLOYEES",
            "UPDATE AN EMPLOYEE",
            "EXIT APPLICATION"
        ]
    }]).then((answer) => {

        switch (answer.toDo) {
            case "ADD AN EMPLOYEE":
                addEmployee();
                break;

            case "VIEW ALL EMPLOYEES":
                viewEmployee();
                break;

            case "UPDATE AN EMPLOYEE":
                updateEmployee();
                break;

            case "EXIT APPLICATION":
                connection.end;
                break;

            default:
                console.log(answer.toDo);
                console.log(`Invalid action: ${answer.action}`);
                break;
        }
    });
};

// Selecting Role title for add employee 
let roleArr = [];
function selectRole() {
    connection.query("SELECT * FROM jobrole", function (err, res) {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);

        }
    })
    return roleArr;
}
// Selecting manager for adding to employee
let mgmtArray = [];
function selectMgmt() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function (err, res) {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            mgmtArray.push(res[i].first_name);
        }
    })
    return mgmtArray;
}
// // function for adding employees
const addEmployee = function () {
    inquirer.prompt([{
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?"
        },
        {
            type: "list",
            name: "title",
            message: "What is the employee's position?",
            choices: selectRole()
        },
        {
            type: "rawlist",
            name: "choice",
            message: "Whats their managers name?",
            choices: selectMgmt()
        }
    ]).then(function (user) {
        console.log(user.firstName);
        console.log(user.lastName);
        console.log(user.title);
        console.log(user.choice);

        let roleID = selectRole().indexOf(user.title) + 1;
        let mgmtID = selectMgmt().indexOf(user.choice) + 1;

        connection.query("INSERT INTO employee SET ?", {
            first_name: user.firstName,
            last_name: user.lastName,
            role_id: roleID,
            manager_id: mgmtID

        }, function (err, res) {
            if (err) throw err
            console.log("Your new employee has been added.");
            start();
        });

    })
}
// // function for viewing table of employees
const viewEmployee = function () {

    connection.query("SELECT employee.id, employee.first_name, employee.last_name, jobrole.title AS Title FROM employee JOIN jobrole ON employee.role_id = jobrole.id;", (err, res) => {
        if (err) throw err;
        printTable(res);
        connection.end();
        start();
    })
}

// // function for updating employee roles
const updateEmployee = function () {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, jobrole.title FROM employee JOIN jobrole ON employee.role_id = jobrole.id", function (err, res) {
        if (err) throw err;

        // for (let i = 0; i < res.length; i++) {
        //     console.log(res[i].id + "Employee: " + res[i].first_name + " " + res[i].last_name + " | Title: " + res[i].role + "\n-----------------");
        // }
        inquirer.prompt([{
                    type: 'rawlist',
                    name: 'employPicked',
                    message: 'Please enter the ID number of the employee you would like to update:',
                    choices: function () {
                        let pickedID = [];
                        for (let i = 0; i < res.length; i++) {
                            // console.log(res[i]);
                            pickedID.push(res[i].first_name + " " + res[i].last_name);
                        }
                        return pickedID;
                    }
                },
                {
                    type: 'list',
                    name: 'newRole',
                    message: "What is the employee's new title?",
                    choices: selectRole()
                },
                {
                    type: "rawlist",
                    name: "mgmtChoice",
                    message: "What is their manager's name?",
                    choices: selectMgmt()
                }
            ])
            .then(function (answer) {
                let mgmtId = selectMgmt().indexOf(answer.jobrole) + 1
                connection.query("UPDATE employee SET WHERE ?", {
                    id: pickedID
                },
                {
                    role_id: answer.newRole
                },
                {
                    manager_id: mgmtId
                },
                    function(err) {
                        if (err) throw err
                        printTable(answer)
                        start()
                    }
                )
            })
    })
}

// function employeeInfo(firstName, lastName, department, role) {
//     if (!(this instanceof employeeInfo)) {
//         return new employeeInfo(firstName, lastName, department, role);
//     }
//     this.firstName = firstName
//     this.lastName = lastName
//     this.department = department
//     this.role = role
// }