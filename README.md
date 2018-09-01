# NodeJS API Asessment - School System

#### Name: Ang Jun Qin

School System provides API endpoints for application to interface with so that teachers can perform administrative functions for their students.

## Installation

### Requirements
* Node 8
* Git
* MySQL

## Setup

#### Application
```sh
git clone https://github.com/a-junqin/school-system.git
cd school-system
```
```sh
npm install
```
#### Database
Create *school-system-mysql* database and import *school-system.sql* located in dbscripts folder.

## Starting the server

```sh
node app.js
```

## Demo
A demo application is hosted on [Heroku](https://www.heroku.com/
)
* */api/commonstudents*
  * GET [https://safe-springs-22818.herokuapp.com/api/commonstudents](https://safe-springs-22818.herokuapp.com/api/commonstudents)
* */api/register*
  * POST [https://safe-springs-22818.herokuapp.com/api/register](https://safe-springs-22818.herokuapp.com/api/register)
* */api/suspend*
  * POST [https://safe-springs-22818.herokuapp.com/api/suspend](https://safe-springs-22818.herokuapp.com/api/suspend)
* */api/retrievefornotifications*
  * POST [https://safe-springs-22818.herokuapp.com/api/retrievefornotifications](https://safe-springs-22818.herokuapp.com/api/retrievefornotifications)

## Sample Data

#### Student
| Email                                    | Suspended   |
| ---------------------------------------- | ----------: |
| commonstudent1@gmail.com                 |    No       |
| commonstudent2@gmail.com                 |    No       |
| student_only_under_teacher_ken@gmail.com |    No       |
| studentagnes@gmail.com                   |    No       |
| studentmary@gmail.com                    |    Yes      |
| studentjon@gmail.com                     |    No       |
| studenthon@gmail.com                     |    No       |
| studentmiche@gmail.com                   |    No       |

#### Teacher
| Email                |
| -------------------- |
| teacherken@gmail.com |
| teacherjoe@gmail.com |
| teacherang@gmail.com |

#### Teacher-Student mapping
| Teacher                | Student                                     |
| ---------------------- | ------------------------------------------: |
| teacherken@gmail.com   |   commonstudent1@gmail.com                  |
| teacherken@gmail.com   |   commonstudent2@gmail.com                  |
| teacherken@gmail.com   |   student_only_under_teacher_ken@gmail.com  |
| teacherken@gmail.com   |   studentjon@gmail.com                      |
| teacherken@gmail.com   |   studenthon@gmail.com                      |
| teacherjoe@gmail.com   |   commonstudent1@gmail.com                  |
| teacherjoe@gmail.com   |   commonstudent2@gmail.com                  |
| teacherang@gmail.com   |   commonstudent1@gmail.com                  |
