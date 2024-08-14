const db = require('./database');
const classMaster = {
   
    getAll(user_id,callback) {
        db.query("SELECT a.*,b.session_name,c.class_name,c.section FROM `fees_master` as a, session as b,class_master as c WHERE a.session_id = b.id AND a.class_id = c.id  AND a.user_id = ? ",[user_id], callback);
    },
    
    create(data, callback) {
        db.query("INSERT INTO fees_master SET ?", [data], callback);
    },
    getById(id, callback) {
        db.query("SELECT * FROM fees_master WHERE id = ?", [id], callback);
    },
    update(id, data, callback) {
        db.query("UPDATE fees_master SET ? WHERE id = ?", [data, id], callback);
    },
    delete(id, callback) {
        db.query("DELETE FROM fees_master WHERE id = ?", [id], callback);
    },


}

module.exports = classMaster;