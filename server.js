
const mysql = require('mysql');
const seeTable = require('console.table')
const inquirer = require('inquirer');


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
// should i prompt for department first?
// In View Table function: error Table 'employee_db.employee' does not exist but it does and they I am connected.
// ^^^ this same error for add employee function also. 

// lines 86 finish for the add employee: what am i adding.
// lines 139 finish for update employee
// apply a manager to employee
// ===============================

const start = function () {
    // console.log("Welcome to the Employee Manager");
    inquirer.prompt([
        {
            type: 'list',
            name: 'toDo',
            message: 'What do you want to do?',
            choices: [
                "ADD AN EMPLOYEE", 
                "VIEW ALL EMPLOYEES", 
                "UPDATE AN EMPLOYEE", 
                "EXIT APPLICATION"
            ]
        }
    ]).then((answer) => {
            // if (answer.toDo === "ADD AN EMPLOYEE") {
            //     addEmployee();
            // } else if (answer.toDo === "VIEW ALL EMPLOYEES") {
            //     viewEmployee();

            // } else if (answer.toDo === "UPDATE AN EMPLOYEE'S MANAGER") {
            //     updateEmployee();
            // } else {
            //     connection.end();
            // }
            
            switch (answer.toDo) {
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
                
                default :
                    console.log(answer.toDo);
                    console.log(`Invalid action: ${answer.action}`);
                    break;
            }
        });
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
            console.log("Your new employee has been added.");
            start();
        });
        connection.end
    })
}
// // function for viewing table of employees
const viewEmployee = function () {
    // first_name, last_name, title, department, salary FROM employee AS maintable INNER JOIN jobrole AS o ON maintable.role_id = o.id INNER JOIN department AS ot ON o.department_id = ot.id"

    connection.query("SELECT employee.first_name, employee.last_name, jobrole.title AS Title FROM employee JOIN jobrole ON employee.role_id = jobrole.id;", (err, res) => {
        if (err) throw err;
        console.table(res);
        connection.end;
        start();
    })
}
// Selecting Role title for add employee 
var roleArr = [];
function selectRole(){
    connection.query("SELECT * FROM role", function(err, res){
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            roleArr.push(res[i].title) ;
            
        }
    })
    return roleArr;
}
// Selecting manager for adding to employee
var mgmtArray = [];
function selectMgmt() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res){
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            mgmtArray.push(res[i].first_name) ;    
        }
    })
    return mgmtArray;
}
// // function for updating employee roles
const updateEmployee = function () {
    connection.query("SELECT employee.id employee.last_name, jobrole.title FROM employee JOIN jobrole ON employee.role_id = jobrole.id;", function (err, res) {
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
                        pickedID.push(res[1].id);
                    }
                    return pickedID;
                }
            },
            {
                type: 'list',
                name: 'newRole',
                message: "What is the Employee's new title?",
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
            connection.query("UPDATE employee SET WHERE ?",
            {
                last_name: answer.id
            })
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



