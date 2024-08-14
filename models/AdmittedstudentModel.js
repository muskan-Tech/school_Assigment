const db = require('./database');
const Admittedstudent = {
    getAll(user_id,callback) {
        db.query("SELECT a.*,b.class_name,b.section,c.session_name FROM student_data as a, class_master as b, `session` as c WHERE a.class_id = b.id AND a.session_id = c.id AND a.user_id = ? AND status = 1",[user_id], callback);
    },
    getStudentTimeTable(user,role,callback) {
        db.query("SELECT a.*, b.class_id, b.full_name, c.role FROM time_table AS a JOIN student_data AS b ON a.class_id = b.class_id AND a.user_id = b.user_id JOIN login AS c ON b.user_id = c.user_id WHERE b.id = ? AND c.role = ?;",[user,role], callback);
    },
    getById(id, callback) {
        db.query("SELECT * FROM student_data WHERE id = ?", [id], callback);
    },
    update(id, data, callback) {
        db.query("UPDATE student_data SET ? WHERE id = ?", [data, id], callback);
    },
    delete(id, callback) {
        db.query("DELETE FROM student_data WHERE id = ?", [id], callback);
    },
    getStudentBySearch(search, user_id, callback) {
        db.query("SELECT a.*,b.class_name FROM `student_data`as a, class_master as b WHERE (a.full_name = ? OR a.dob = ? OR a.phone = ? OR a.district = ? OR a.pincode = ? OR b.class_name = ?) AND a.user_id = ? AND a.class_id = b.id AND a.status = 1", [search, search, search, search, search,search, user_id], callback);
    },
    findById(id, callback) {
        db.query("SELECT * FROM student_data WHERE id = ?", [id], (err, results) => {
          if (err) {
            return callback(err, null);
          }
          callback(null, results[0]);
        });
    },
    getDetail(studentId, role,callback) {
        db.query("SELECT a.class_id,a.id,b.register_id FROM `student_data`as a, login as b WHERE b.register_id = a.id AND a.id = ? AND b.role = ? AND a.status = 1", [studentId, role], callback);
    },

    getClassStudentList(class_id,callback) {
        db.query("SELECT a.full_name, a.roll_no, b.class_name, b.section FROM student_data AS a JOIN class_master AS b ON a.class_id = b.id WHERE a.class_id = ? AND a.status = 1 ORDER BY a.full_name ASC;", [class_id], callback);
    },
    getTeacherStudentList(teacher_id, role, callback) {
        db.query("SELECT a.*,c.class_id FROM `teacher_data`as a, login as b, subject as c  WHERE a.id = c.teacher_id AND b.register_id = a.id AND a.id = ? AND b.role = ? AND a.status = 1", [teacher_id, role], callback);
    }


}

module.exports = Admittedstudent;