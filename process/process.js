const express = require('express')
const router = express.Router()
const getConnection = require('../pool')
const Promise = require('bluebird')

const INTERNAL_SYS_ERR = 'Internal System Error.'
const EMAIL_INVALID = 'One or more e-mail address is invalid.'
const MANDATORY_FIELD = 'Missing one or more mandatory fields.'
const INVALID_PARAM = 'Invalid parameters.'
const ONE_OR_MORE_STUDENT_DOES_NOT_EXIST = 'One or more student does not exist.'
const ONE_STUDENT_DOES_NOT_EXIST = 'Student does not exist.'
const TEACHER_DOES_NOT_EXIST = 'Teacher does not exist.'
const INVALID_REQUEST_BODY = 'Invalid request body.'
const INVALID_CONTENT_TYPE = 'Invalid Content-Type.'

// Content-Type Validation for POST
router.use('/', function(req, res, next) {
    var contentType = req.headers['content-type']
    var method = req.method
    if ((!contentType || contentType.toLowerCase() != 'application/json') && method == 'POST') {
        sendResponse(res, 415, INVALID_CONTENT_TYPE, false)
    }
    next()
})

// User Story 1
router.post('/api/register', (req, res) => {
    var teacher = req.body.teacher
    var students = req.body.students
    
    // Check for mandatory fields
    if(teacher && (students && students.length > 0)) {
        var studentDBData

        Promise.using(getConnection(), function(connection) {
            // Retrieve all users
            connection.query('SELECT ID FROM TBL_STUDENT WHERE EMAIL IN (?)', [students]).then(function(rows) {
                return rows
            }).then(function(rows) {
                // Check if student exist
                if(rows.length != students.length) {
                    sendResponse(res, 400, ONE_OR_MORE_STUDENT_DOES_NOT_EXIST, false)
                } else {
                    studentDBData = rows
                    // Retrieve teacher
                    return connection.query('SELECT ID FROM TBL_TEACHER WHERE EMAIL = ?', [teacher])
                }
            }).then(function(rows) {
                // Check if teacher exist
                if(rows.length > 0) {
                    var dataSet = []
                    for (var i = 0; i < studentDBData.length; i++) {
                        dataSet.push([rows[0].ID, studentDBData[i].ID])
                    }
                    // Insert relationship between teacher and student
                    return connection.query('INSERT IGNORE INTO TBL_TEACHER_STUDENT_JUNCTION (TEACHER_ID, STUDENT_ID) VALUES ?', [dataSet])
                } else {
                    sendResponse(res, 400, TEACHER_DOES_NOT_EXIST, false)
                }
            }).then(function(rows) {
                // Success, return 204 without content
                sendResponse(res, 204, '', true)
            }).catch(function(error) {
                // Any other error
                sendResponse(res, 500, INTERNAL_SYS_ERR, false)
            })
        })
    } else {
        sendResponse(res, 400, MANDATORY_FIELD, false)
    }
})
  
// User story 2
router.get('/api/commonstudents', (req, res) => {
    var email = req.query.teacher
    
    // Check query parameter
    if (email) {
        Promise.using(getConnection(), function(connection) {
            // Count teacher
            connection.query('SELECT COUNT(*) AS COUNT FROM TBL_TEACHER WHERE EMAIL IN (?)', [email]).then(function(rows) {
                return rows
            }).then(function(rows) {
                // Check if teacher is valid
                if(!Array.isArray(email) && rows[0].COUNT == 0) {
                    sendResponse(res, 400, EMAIL_INVALID, false)
                } else if(Array.isArray(email) && rows[0].COUNT != email.length) {
                    sendResponse(res, 400, EMAIL_INVALID, false)
                } else {
                    // Get all common students
                    return connection.query('SELECT S.EMAIL '
                    + 'FROM TBL_TEACHER T '
                    + 'INNER JOIN TBL_TEACHER_STUDENT_JUNCTION J ON T.ID = J.TEACHER_ID '
                    + 'INNER JOIN TBL_STUDENT S ON J.STUDENT_ID = S.ID '
                    + 'WHERE T.EMAIL IN (?) '
                    + 'GROUP BY S.EMAIL '
                    + 'HAVING COUNT(*) > ?', [email, Array.isArray(email) ? email.length-1 : 0])
                }
            }).then(function(rows) {
                // Push if not exist
                var result = []
                rows.forEach(function(element) {
                    result.push(element.EMAIL)
                })
            
                sendResponse(res, 200, {'students': result}, true)
            }).catch(function(error) {
                // Any other error
                sendResponse(res, 500, INTERNAL_SYS_ERR, false)
            })
        })
    } else {
        sendResponse(res, 400, INVALID_PARAM, false)
    }
})
  
// User story 3
router.post('/api/suspend', (req, res) => {
    var student = req.body.student

    //Check for mandatory field
    if(student) {
        // Only accept one specific student. Return error if array received
        if(Array.isArray(student)) {
            sendResponse(res, 400, INVALID_REQUEST_BODY, false)
        } else {
            Promise.using(getConnection(), function(connection) {
                // Update SUSPEND_IND to Y
                connection.query('UPDATE TBL_STUDENT SET SUSPEND_IND = \'Y\' WHERE EMAIL = ?', [student]).then(function(rows) {
                    return rows
                }).then(function(rows) {
                    // Check if updated
                    if(rows.affectedRows > 0)
                        sendResponse(res, 204, '', true)
                    else
                        sendResponse(res, 400, ONE_STUDENT_DOES_NOT_EXIST, false)
                }).catch(function(error) {
                    // Any other error
                    sendResponse(res, 500, INTERNAL_SYS_ERR, false)
                })
            })
        }
    } else {
        sendResponse(res, 400, MANDATORY_FIELD, false)
    }
})
  
// User story 4
router.post('/api/retrievefornotifications', (req, res) => {
    var teacher = req.body.teacher
    var notification = req.body.notification

    // Check for mandatory field
    if(teacher && notification) {
        var recipients = []
        // extract email from notification request
        var mentioned = extractEmails(notification)
        
        // filter out multiple @mentioned of the same e-mail
        mentioned = mentioned.filter(function(elem, pos) {
            return mentioned.indexOf(elem) == pos;
        })

        Promise.using(getConnection(), function(connection) {
            // Get student email that is related to the teacher with SUSPEND_IND = N
            connection.query('SELECT S.EMAIL '
            + 'FROM TBL_TEACHER T '
            + 'INNER JOIN TBL_TEACHER_STUDENT_JUNCTION J ON T.ID = J.TEACHER_ID '
            + 'INNER JOIN TBL_STUDENT S ON J.STUDENT_ID = S.ID '
            + 'WHERE T.EMAIL = ? AND S.SUSPEND_IND = \'N\'', [teacher]).then(function(rows) {
                return rows
            }).then(function(rows) {
                // Store recipients
                rows.forEach(function(student) {
                    recipients.push(student.EMAIL)
                })

                // if notification has @mentioned, query db ot check if all mentioned student exist and not suspended
                if(mentioned) 
                    return connection.query('SELECT * FROM TBL_STUDENT WHERE EMAIL IN (?) AND SUSPEND_IND = \'N\'', [mentioned])
                
            }).then(function(studentDetail) {
                if(mentioned) {
                    // Check if mentioned student email is invalid
                    if(mentioned.length != studentDetail.length) {
                        sendResponse(res, 400, EMAIL_INVALID, false)
                    }
                    // Store only unique recipients
                    studentDetail.forEach(function(student) {
                        if(recipients.indexOf(student.EMAIL) === -1) {
                            recipients.push(student.EMAIL)
                        }
                    })
                }
                sendResponse(res, 200, {'recipients': recipients}, true)
            }).catch(function(error) {
                // Any other error
                sendResponse(res, 500, INTERNAL_SYS_ERR, false)
            })
        })
    } else {
        sendResponse(res, 400, MANDATORY_FIELD, false)
    }
})

// Retrieve e-mail with format ' @email@example.com'
function extractEmails(text){
    return text.match(/[^ @]([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)
}
  
    
// Handle http header and body for response
function sendResponse(res, httpStatusCode, dataStr, success){
    if (!res.headersSent) {
        // Headers for security purposes
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
        res.header('Content-Type', 'application/json')
        res.removeHeader('Date')
        res.status(httpStatusCode)

        // Return
        if(dataStr != '') {
            if(success)
                res.json(dataStr)
            else
                res.json({'message':dataStr})
        } else {
            res.end()
        }
    }
}

module.exports = router