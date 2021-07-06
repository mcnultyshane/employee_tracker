const PasswordPrompt = require('inquirer/lib/prompts/password');
const mysql = require('mysql');
const express = require('express');
const inquirer = require('inquirer');
const Choice = require('inquirer/lib/objects/choice');
const Choices = require('inquirer/lib/objects/choices');

const connection = mysql.createConnection({
    host:'localhost',
    port:'8080',
    user:'root',
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

    ])
}
// function for viewing table of employees

// function for updating employee roles
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



connection.connect((err) => {
    if (err) throw (err);
    console.log(`connected as id ${connection.threadID}`);

    
})