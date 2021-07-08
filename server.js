const mysql = require('mysql');
const {
    printTable
} = require('console-table-printer');
const inquirer = require('inquirer');
// require('dotenv').config



const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    // add password protection.
    password: 'October31',
    database: 'employee_db'
});
// connection to server and beginning the start function to initiate the prompts
connection.connect((err) => {
    if (err) throw (err);
    console.log(`connected as id: ${connection.threadId}`);
    start();
})

// Password and username login
// --------------------------------
// ********What would you like to do questions
// ************add employee
// ************view all employees
// ************update employee roles
// remove employees


const start = function () {
    inquirer.prompt([{
        type: 'list',
        name: 'toDo',
        message: 'What do you want to do?',
        choices: [
            "ADD AN EMPLOYEE",
            "VIEW ALL EMPLOYEES",
            "UPDATE AN EMPLOYEE",
            "ADD A DEPARTMENT",
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

            case "ADD A DEPARTMENT":
                addDepartment();
                break;

            case "EXIT APPLICATION":
                connection.end();
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
        console.log("Entering New Employee: ");
        console.log(user.firstName + " " + user.lastName + ", " + user.title + ", " + user.choice + "\n");
        // console.log(user.lastName);
        // console.log(user.title);
        // console.log(user.choice);

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

    connection.query("SELECT employee.id, employee.first_name, employee.last_name, jobrole.title, jobrole.salary FROM employee JOIN jobrole ON employee.role_id = jobrole.id;", (err, res) => {
        if (err) throw err;
        printTable(res);
        start();
    })
}

// function for displaying all Employees for choosing.
function displayAllEmployees() {
    let query = "SELECT * FROM employee ";
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.log("\n\n ** Full Employee list ** \n");
        printTable(res);
    });
};

// function to display all of the job roles in a table for choosing
function displayAllRoles() {
    let query = "SELECT * FROM jobrole ";
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.log("\n\n ** Full Role list ** \n");
        printTable(res);
    });
};

// // function for updating employee roles
const updateEmployee = function () {
    let employeeID;
    displayAllEmployees();
    inquirer.prompt({
            type: "input",
            name: 'employPicked',
            message: 'Please enter the ID number of the employee you would like to update:',
        })
        .then((answer) => {
            employeeID = answer.employPicked;
            displayAllRoles();

            inquirer.prompt({
                    type: "input",
                    name: "roleId",
                    message: "Enter the role ID you want the user to have"
                })
                .then((answer) => {
                    console.log("Updating employee role...\n");
                    connection.query("UPDATE employee SET ? WHERE ? ",
                        [{
                            role_id: answer.roleId
                        }, {
                            id: employeeID,
                        }, ],

                        function (err) {
                            if (err) throw err
                            console.log("Employee role updated");
                            // printTable(answer)
                            start()

                        })
                })
        })
};

function addDepartment() {
    inquirer.prompt({
            type: "input",
            name: "departName",
            message: "What is the department name?"
        })
        .then((answer) => {
            console.log("Adding a new department ... \n");
            connection.query(
                'INSERT INTO department SET ?', {
                    department: answer.departName,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("New Department added!\n");
                    start();

                }
            )
        })
}