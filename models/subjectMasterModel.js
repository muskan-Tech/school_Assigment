const db = require('./database');
const subjectMaster = {

    getAll(user_id, callback) {
        db.query("SELECT a.*, b.class_name,b.section,c.session_name,d.full_name FROM subject AS a JOIN class_master AS b JOIN session AS c ON a.class_id = b.id AND a.session_id = c.id LEFT JOIN teacher_data as d on a.teacher_id = d.id WHERE a.user_id = ?", [user_id], callback);
    },

    create(data, callback) {
        db.query("INSERT INTO subject SET ?", [data], callback);
    },
    getById(id, callback) {
        db.query("SELECT * FROM subject WHERE id = ?", [id], callback);
    },
    update(id, data, callback) {
        db.query("UPDATE subject SET ? WHERE id = ?", [data, id], callback);
    },
    delete(id, callback) {
        db.query("DELETE FROM subject WHERE id = ?", [id], callback);
    },
    subjectbyclass(class_id, callback) {
        db.query("SELECT * FROM subject WHERE class_id = ?", [class_id], callback);
    },
    subjectbyteacher(teacher_id, callback) {
        db.query("SELECT a.* ,b.class_name , b.section FROM subject a JOIN class_master b ON a.class_id = b.id WHERE a.teacher_id = ?", [teacher_id], callback);
    },
    getByTeacherId(teacher_id, callback) {
        db.query("SELECT teacher_id FROM subject WHERE teacher_id = ?", [teacher_id], callback);
    },

}

    module.exports = subjectMaster;