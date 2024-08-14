const db = require('./database');
const sessionMaster = {
   
    getAll(user_id,callback) {
        db.query("SELECT * FROM session WHERE user_id = ?",[user_id], callback);
    },
    checkExistSession(user_id,session_name,callback) {
        db.query("SELECT * FROM session WHERE user_id = ? AND session_name = ?",[user_id,session_name], callback);
    },
    
    create(data, callback) {
        db.query("INSERT INTO session SET ?", [data], callback);
    },
    getById(id, callback) {
        db.query("SELECT * FROM session WHERE id = ?", [id], callback);
    },
    update(id, data, callback) {
        db.query("UPDATE session SET ? WHERE id = ?", [data, id], callback);
    },
    delete(id, callback) {
        db.query("DELETE FROM session WHERE id = ?", [id], callback);
    },
    sessionDropdownByUserId(user_id, callback){
        db.query("SELECT id, session_name FROM session WHERE user_id = ?", [user_id], callback);
    }
}

module.exports = sessionMaster;