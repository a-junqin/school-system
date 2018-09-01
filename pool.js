var mysql = require('promise-mysql');
var pool = mysql.createPool({
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'school_system_mysql',
	connectionLimit: 10
});

function getConnection() {
    return pool.getConnection().disposer(function(connection) {
        pool.releaseConnection(connection);
    });
}
   
module.exports = getConnection;