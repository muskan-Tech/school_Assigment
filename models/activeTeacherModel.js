const db = require('./database');
const activeteacher= {
   
    getAll(user_id,callback) {
        db.query("SELECT a.*,b.session_name FROM `teacher_data` as a, session as b WHERE a.session_id = b.id AND  a.STATUS = 1 AND a.user_id = ?",[user_id], callback);
    },
    getAllActiveTeacher(user_id,callback) {
        db.query("SELECT * FROM `teacher_data` WHERE STATUS = 1 AND user_id = ?",[user_id], callback);
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
    delete(id, callback) {
        db.query("DELETE FROM teacher_data WHERE id = ?", [id], callback);
    },
    TeacherDropdownByUserId(user_id, callback) {
        db.query("SELECT a.full_name,a.id FROM `teacher_data` as a WHERE  a.STATUS = 1 AND a.user_id = ?",[user_id], callback);
    },
    profile(id, user_id, callback) {
        db.query("SELECT a.*, SUM(MONTH(b.create_date) = 1 AND b.status = 1) AS Jan, SUM(MONTH(b.create_date) = 2 AND b.status = 1) AS Feb, SUM(MONTH(b.create_date) = 3 AND b.status = 1) AS Mar, SUM(MONTH(b.create_date) = 4 AND b.status = 1) AS Apr, SUM(MONTH(b.create_date) = 5 AND b.status = 1) AS May, SUM(MONTH(b.create_date) = 6 AND b.status = 1) AS Jun, SUM(MONTH(b.create_date) = 7 AND b.status = 1) AS Jul, SUM(MONTH(b.create_date) = 8 AND b.status = 1) AS Aug, SUM(MONTH(b.create_date) = 9 AND b.status = 1) AS Sep, SUM(MONTH(b.create_date) = 10 AND b.status = 1) AS Oct, SUM(MONTH(b.create_date) = 11 AND b.status = 1) AS Nov, SUM(MONTH(b.create_date) = 12 AND b.status = 1) AS December, COUNT(b.status) AS total_count, SUM(b.status = 1) AS present, SUM(b.status = 0) AS absent FROM teacher_data AS a LEFT JOIN teacher_attendance AS b ON b.teacher_id = a.id WHERE a.user_id = ? AND a.id = ? GROUP BY a.id, a.full_name, a.user_id",[user_id,id], callback);
    },
    getAllTeacherNAme(user_id, callback) {
        db.query("SELECT * FROM teacher_data WHERE user_id = ?", [user_id], callback);
    },
    getAllTeacherAttendance(user_id, Teacher_id, callback) {
        db.query("SELECT a.*,b.full_name FROM teacher_attendance as a , teacher_data as b  WHERE b.id = a.teacher_id AND a.user_id = ? AND a.teacher_id = ?", [user_id, Teacher_id], callback);
    },

    createAttendance(data, callback) {
        const values = data.map(item => [
            item.user_id,
            item.teacher_id,
            item.create_date,
            item.status,
        ]);
        db.query("INSERT INTO teacher_attendance (user_id, teacher_id, create_date, status) VALUES ?", [values], callback);
    },
    updateTeacherPic(id,profile_photo, callback) {
        db.query("UPDATE teacher_data SET profile_photo = ? WHERE id = ?", [profile_photo,id], callback);
    },
    findById(id, callback) {
        db.query("SELECT * FROM teacher_data WHERE id = ?", [id], (err, results) => {
          if (err) {
            return callback(err, null);
          }
          callback(null, results[0]);
        });
    },

}

module.exports = activeteacher;