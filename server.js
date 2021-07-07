const PasswordPrompt = require('inquirer/lib/prompts/password');
const mysql = require('mysql');
const express = require('express');
const inquirer = require('inquirer');
const Choice = require('inquirer/lib/objects/choice');
const Choices = require('inquirer/lib/objects/choices');

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    // add password protection.
    password: 'October31',
    database: 'employee_db'
});


// Password and username login
// --------------------------------
// What would you like to do questions
// add employee
// view all employees
// update employee roles
// remove employees


// ===============================
// should i prompt for department first?"
// lines 86 finish for the add employee: what am i adding.
// ===============================

const start = function () {
    // console.log("Welcome to the Employee Manager");
    inquirer.prompt([{
            type: 'list',
            name: 'toDo',
            message: 'What do you want to do?',
            choices: ["ADD AN EMPLOYEE", "VIEW ALL EMPLOYEES", "UPDATE AN EMPLOYEE'S MANAGER", "EXIT APPLICATION"]

        }])
        .then((answers) => {
            switch (answers.action) {
                case "ADD AN EMPLOYEE":
                    addEmployee();
                    break;

                case "VIEW ALL EMPLOYEES":
                    viewEmployee();
                    break;

                case "UPDATE AN EMPLOYEE'S MANAGER":
                    updateEmployee();
                    break;

                case "EXIT APPLICATION":
                    connection.end();
                    break;
            }

        })
};
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
            name: "department",
            message: "What is the employee's department?",
            choices: ["Sales", "Engineering", "Legal", "Finance"]
        },
    ]).then(function (user) {
        console.log(user.firstName);
        console.log(user.lastName);
        console.log(user.department);
        let newEmployee = new employeeInfo(user.firstName, user.lastName, user.department, user.role)

        connection.query("INSERT INTO employee SET ?", newEmployee, function (err, res) {
            if (err) throw err
            console.log("Your new employee has been added. ");
        });
        connection.end
    })
}
// // function for viewing table of employees
const viewEmployee = function () {
    connection.query("SELECT first_name, last_name, title, department, salary FROM employee AS maintable INNER JOIN jobrole AS o ON maintable.role_id = o.id INNER JOIN department AS ot ON o.department_id = ot.id", (err, res) => {
        if (err) throw err; 
        console.table(res); 
        connection.end;
        start();
    })
}
// // function for updating employee roles
const updateEmployee = function () {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;

        for (let i = 0; i < res.length; i++) {
            console.log(res[i].d + "Employee: " + res[i].firstName + " " + res[i].lastName + " | Title: " + res[i].role + "\n-----------------");

        }
        inquirer.prompt([{
                    type: 'input',
                    name: 'employPicked',
                    message: 'Please enter the ID number of the employee you would like to update:'
                },
                {
                    type: 'list',
                    name: 'newRole',
                    choices: ["Attorney, Engineer, Accountant, Salesperson"]
                }

            ])
            .then(function (answer) {
                let existEmploy;
                existEmploy = false
                console.log(answer.employPicked);
                console.log(answer.newRole);

                for (let i = 0; i < res.length; i++) {
                    if (parseInt(res[i].id) === parseInt(answer.employPicked)) {
                        existEmploy = true;
                    }
                }
                if (!existEmploy) {
                    console.log('******************\nID does not currently exist.  Please try again\n******************');
                    updateEmployee();

                } else {
                    connection.query("UPDATE employee")
                }
            })
    })
}

function employeeInfo(firstName, lastName, department, role) {
    if (!(this instanceof employeeInfo)) {
        return new employeeInfo(firstName, lastName, department, role);
    }
    this.firstName = firstName
    this.lastName = lastName
    this.department = department
    this.role = role
}

connection.connect((err) => {
    if (err) throw (err);
    console.log(`connected as id: ${connection.threadId}`);

})

// start()