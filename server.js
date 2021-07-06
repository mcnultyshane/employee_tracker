const PasswordPrompt = require('inquirer/lib/prompts/password');
const mysql = require('mysql');
const express = require('express');
const inquirer = require('inquirer');
const Choice = require('inquirer/lib/objects/choice');
const Choices = require('inquirer/lib/objects/choices');

const connection = mysql.createConnection({
    host:'localhost',
    port:'3306',
    user:'root',
    // add password protection.
    password: 'October31',
    database: 'employee_db'
});

connection.connect((err) => {
    if (err) throw (err);
    console.log(`connected as id ${connection.threadID}`);
// Password and username login
// --------------------------------
// What would you like to do questions
// add employee
// view all employees
// update employee roles
// remove employees

const start = function () {
    console.log("Welcome to the Employee Manager");
    inquirer.prompt([{
        type: 'list',
        name: 'toDo',
        message: 'What do you want to do?',
        choices: ["ADD AN EMPLOYEE", "VIEW ALL EMPLOYEES", "UPDATE AN EMPLOYEE'S MANAGER"]

    }]).then(function (user) {
        if (user.toDo === "ADD AN EMPLOYEE") {
           addEmployee();
        } else  if (user.toDO === "VIEW ALL EMPLOYEES") {
            viewEmployee();
        } else {
            updateEmployee();
        }

    })
};

// function for adding employees
const addEmployee = function() {
    inquirer.prompt([
        {
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
            choices: ["Sales","Engineering", "Legal", "Finance"]
        },
    ]).then(function (user){
        console.log(user.firstName);
        console.log(user.lastName);
        console.log(user.department);
        let newEmployee = new employeeInfo(user.firstName, user.lastName, user.department, user.role)

        connection.query ("INSERT INTO employee SET ?", newEmployee, function(err, res){
            if (err) throw err
            console.log("Your new employee has been added. ");
        });
        connection.end
    })
}
// function for viewing table of employees
const viewEmployee = function() {
    
}
// function for updating employee roles
const updateEmployee = function () {
    connection.query("SELECT * FROM ?", function (err, res) {
        if (err) throw err;

        for (let i = 0; i < res.length; i++) {
         console.log(); res[i];
            
        }
    })
}


function employeeInfo(firstName, lastName, department, role){
    if(!(this instanceof employeeInfo)){
        return new employeeInfo(firstName, lastName, department, role);
    }
    this.firstName = firstName
    this.lastName = lastName
    this.department = department
    this.role = role
};
// function for removing employees

start()



    
})