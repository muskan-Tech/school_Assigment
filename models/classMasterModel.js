const db = require('./database');
const classMaster = {
   
    getAll(user_id,callback) {
        db.query("SELECT a.*,b.session_name FROM class_master as a, session as b WHERE a.session_id = b.id AND a.user_id = ?",[user_id], callback);
    },
    checkExistClass(user_id, section, class_name,callback) {
        db.query("SELECT * FROM class_master WHERE user_id = ? AND section = ? AND class_name = ?",[user_id, section, class_name], callback);
    },
    
    create(data, callback) {
        db.query("INSERT INTO class_master SET ?", [data], callback);
    },
    getById(id, callback) {
        db.query("SELECT * FROM class_master WHERE id = ?", [id], callback);
    },
    update(id, data, callback) {
        db.query("UPDATE class_master SET ? WHERE id = ?", [data, id], callback);
    },
    delete(id, callback) {
        db.query("DELETE FROM class_master WHERE id = ?", [id], callback);
    },
    classDropdownByUserId(user_id, callback){
        db.query("SELECT id, class_name , section FROM class_master WHERE user_id = ?", [user_id], callback);
    }


}

module.exports = classMaster;