const inquirer = require('inquirer');
const cTable = require('console.table');
const validator = require('validator');

const initialPrompt = () => {
    return inquirer.prompt([
        {
        type: 'list',
        name: 'start',
        message: 'What would you like to do?',
        choices: ['View All Employees.', 'Add An Employee', 'Update Employee Role']
        }
    ])
    .then(response => {

    })
}

const viewEmployee = () => {

}

const addEmployee = () => {

}

const updateRole = () => {
    
}
