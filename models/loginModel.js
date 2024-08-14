const db = require('./database');
const login = {
   
    login(email, password, callback) {
        db.query("SELECT * FROM login WHERE email = ? AND password = ?", [email, password], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            if (results.length === 0) {
                // User not found
                return callback(null, null);
            } else {
                return callback(null, results);
            }
        });
    },
    
    create(data, callback) {
        db.query("INSERT INTO login SET ?", [data], callback);
    },
    delete(register_id,user_id,role, callback) {
        db.query("DELETE FROM login WHERE register_id = ? AND user_id = ? AND role = ?", [register_id,user_id,role], callback);
    },
    check(password,id, callback) {
        db.query("SELECT * FROM login WHERE password = ? AND id = ?", [password,id], callback)
    },
    updatePassword(password,id, callback) {
        db.query("UPDATE login SET password = ? WHERE id = ?", [password,id], callback);
    },
}

module.exports = login;