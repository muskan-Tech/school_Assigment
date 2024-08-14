const db = require('./database');
const fees = {
   
    getAll(user_id,id,callback) {
        db.query("SELECT a.*,c.class_name,c.section,d.session_name FROM fees as a ,student_data as b,class_master as c, session as d WHERE c.id = b.class_id AND d.id = a.session_id AND a.user_id = ? AND b.id = ? ORDER BY a.id DESC;",[user_id,id], callback);
    },
    getAllPendingFees(user_id,callback) {
        db.query("SELECT a.*, c.class_name, c.section, d.session_name FROM fees AS a LEFT JOIN student_data AS b ON b.id = a.user_id LEFT JOIN class_master AS c ON c.id = a.class_id LEFT JOIN session AS d ON d.id = a.session_id WHERE a.user_id = ? AND a.status = 0 ORDER BY a.id DESC;",[user_id], callback);
    },
    getAllSuccessRejectFees(user_id,callback) {
        db.query("SELECT a.*, c.class_name, c.section, d.session_name FROM fees AS a LEFT JOIN student_data AS b ON b.id = a.user_id LEFT JOIN class_master AS c ON c.id = a.class_id LEFT JOIN session AS d ON d.id = a.session_id WHERE a.user_id = ? AND a.status != 0 ORDER BY a.id DESC;",[user_id], callback);
    },
    
    create(data, callback) {
        db.query("INSERT INTO fees SET ?", [data], callback);
    },
    updateStatus(id,status,user_id, callback) {
        db.query("UPDATE fees SET status = ? WHERE id = ? AND user_id = ?", [status,id,user_id], callback);
    },

}

module.exports = fees;