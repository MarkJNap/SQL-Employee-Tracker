# SQL Employee Tracker

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Description

This Content Management System (CMS) Employee Tracker application allows the user to manage and create their employee database without needing much knowledge about MySQL and databases. In creating this application I got very valuable experience using npm packages like `MySQL2`, `Inquirer`, `dotenv` and `console.table`. There was quite a few different ways to approach this project and it took me a little time to figure out my methods. But I got there in the end and am happy with the results. With more time I would like to add valiation and attempt more of the bonus objectives as it stands I've only done `View employees by manager`.

## Installation

Requires:

* Node.js v16
* GitBash or equivalent
* MySQL

After cloning the repository and navigating to correct folder in GitBash the user needs to run `npm install` to ensure it downloads all needed packages/dependencies.

Be sure to modify the `.env.EXAMPLE` file to have mysql work properly.

Run `mysql -u root -p` and enter your password,
Then run `SOURCE db/schema.sql` followed by `SOURCE db/seeds.sql`,
Then quit out of MySQL.

## Usage

To begin using this application type `npm start` in the correct folder.

This will present the user with prompts for viewing departments, roles and employee information, with the ability to also add new departments, roles and employees, and finally to be able to update an existing employee's role.

Link to Demo Video: LINK GOES HERE

## Credits

Mark Napolitano

## License

ISC License
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

---