const db = require('./database');
const teacherAccountGeneration = {
   
    getAll(user_id,callback) {
        db.query("SELECT a.*,b.session_name FROM `teacher_data` as a, session as b WHERE a.session_id = b.id AND  a.STATUS = 2 AND a.user_id = ?",[user_id], callback);
    },
    getAllActiveTeacher(user_id,callback) {
        db.query("SELECT * FROM `teacher_data` WHERE STATUS = 1 AND user_id = ?",[user_id], callback);
    },
    profile(id,user_id,callback) {
        db.query(" SELECT * FROM `teacher_data` WHERE AND user_id = ? AND id = ?",[id,user_id], callback);
    },
    
    create(data, callback) {
        db.query("INSERT INTO teacher_data SET ?", [data], callback);
    },
    getById(id, callback) {
        db.query("SELECT * FROM teacher_data WHERE id = ?", [id], callback);
    },
    update(id, data, callback) {
        db.query("UPDATE teacher_data SET ? WHERE id = ?", [data, id], callback);
    },
    statusUpdate(id,status, callback) {
        db.query("UPDATE teacher_data SET status = ? WHERE id = ?", [status, id], callback);
    },
    delete(id, callback) {
        db.query("DELETE FROM teacher_data WHERE id = ?", [id], callback);
    },


}

module.exports = teacherAccountGeneration;