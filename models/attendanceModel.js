const db = require('./database');
const classMaster = {

    getAll(user_id, student_id, callback) {
        db.query("SELECT a.*, b.subject FROM `attendance` a JOIN subject b ON a.subject_id = b.id WHERE a.user_id = ? AND a.student_id = ? ORDER BY a.`date` DESC;", [user_id, student_id], callback);
    },

    getAllBySearch(user_id, student_id, subject_id, callback) {
        db.query("SELECT a.*, b.subject FROM `attendance` a JOIN subject b ON a.subject_id = b.id WHERE a.user_id = ? AND a.student_id = ? AND a.subject_id = ? ORDER BY a.`date` DESC  ", [user_id, student_id, subject_id], callback);
    },

    create(data, callback) {
        const values = data.map(item => [
            item.user_id,
            item.student_id,
            item.teacher_id,
            item.subject_id,
            item.date,
            item.status,
            item.session_id
        ]);
        db.query("INSERT INTO attendance (user_id, student_id, teacher_id, subject_id, date, status, session_id) VALUES ?", [values], callback);
    },
    getById(id, callback) {
        db.query("SELECT * FROM attendance WHERE id = ?", [id], callback);
    },
    update(id, data, callback) {
        db.query("UPDATE attendance SET ? WHERE id = ?", [data, id], callback);
    },
    delete(id, callback) {
        db.query("DELETE FROM attendance WHERE id = ?", [id], callback);
    },
    classDropdownByUserId(user_id, callback) {
        db.query("SELECT id, class_name , section FROM attendance WHERE user_id = ?", [user_id], callback);
    },

  


}

module.exports = classMaster;