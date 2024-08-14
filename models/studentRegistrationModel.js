const db = require('./database');
const studentRegistration = {
   
    getAll(user_id,callback) {
        db.query("SELECT a.*,b.class_name,b.section,c.session_name FROM student_data as a, class_master as b, `session` as c WHERE a.class_id = b.id AND a.session_id = c.id AND a.user_id = ? AND status = 2",[user_id], callback);
    },
    getAllAdmitStudent(user_id,callback) {
        db.query("SELECT a.*,b.class_name,b.section,c.session_name FROM student_data as a, class_master as b, `session` as c WHERE a.class_id = b.id AND a.session_id = c.id AND a.user_id = ? AND status = 1",[user_id], callback);
    },
    profile(id,user_id,callback) {
        db.query("SELECT a.*,b.class_name,b.section, COALESCE(SUM(MONTH(d.date) = 1 AND d.status = 1), 0) AS Jan, COALESCE(SUM(MONTH(d.date) = 2 AND d.status = 1), 0) AS Feb, COALESCE(SUM(MONTH(d.date) = 3 AND d.status = 1), 0) AS Mar, COALESCE(SUM(MONTH(d.date) = 4 AND d.status = 1), 0) AS Apr, COALESCE(SUM(MONTH(d.date) = 5 AND d.status = 1), 0) AS May, COALESCE(SUM(MONTH(d.date) = 6 AND d.status = 1), 0) AS Jun, COALESCE(SUM(MONTH(d.date) = 7 AND d.status = 1), 0) AS Jul, COALESCE(SUM(MONTH(d.date) = 8 AND d.status = 1), 0) AS Aug, COALESCE(SUM(MONTH(d.date) = 9 AND d.status = 1), 0) AS Sep, COALESCE(SUM(MONTH(d.date) = 10 AND d.status = 1), 0) AS Oct, COALESCE(SUM(MONTH(d.date) = 11 AND d.status = 1), 0) AS Nov, COALESCE(SUM(MONTH(d.date) = 12 AND d.status = 1), 0) AS December, COALESCE(COUNT(d.status), 0) AS total_count, COALESCE(SUM(d.status = 1), 0) AS present, COALESCE(SUM(d.status = 0), 0) AS absent, f.fees FROM student_data AS a INNER JOIN class_master AS b ON a.class_id = b.id INNER JOIN session AS c ON a.session_id = c.id LEFT JOIN attendance AS d ON a.id = d.student_id INNER JOIN fees_master AS f ON a.class_id = f.class_id WHERE a.id = ? AND a.user_id = ? GROUP BY a.id, a.full_name, b.class_name, b.section, c.session_name;",[id,user_id], callback);
    },
    create(data, callback) {
        db.query("INSERT INTO student_data SET ?", [data], callback);
    },
    getById(id, callback) {
        db.query("SELECT a.*,b.class_name,b.section FROM student_data as a, class_master as b WHERE a.class_id = b.id AND a.id = ?", [id], callback);
    },
    update(id, data, callback) {
        db.query("UPDATE student_data SET ? WHERE id = ?", [data, id], callback);
    },
    calculateFees(role, user_id,student_id, callback) {
        db.query("SELECT a.*, b.fees, d.full_name, total_paid.total_amount AS pay_amount, (b.fees - total_paid.total_amount) AS remaining_amount FROM fees AS a LEFT JOIN fees_master AS b ON a.class_id = b.class_id AND a.session_id = b.session_id LEFT JOIN login AS c ON c.user_id = a.user_id AND c.role = ? LEFT JOIN student_data AS d ON a.student_id = d.id LEFT JOIN ( SELECT user_id, student_id, SUM(amount) AS total_amount FROM fees WHERE status = 1 GROUP BY user_id, student_id ) AS total_paid ON a.user_id = total_paid.user_id AND a.student_id = total_paid.student_id WHERE a.user_id = ? AND a.student_id = ? AND a.status = 1;", [role, user_id,student_id], callback);
    },
    delete(id, callback) {
        db.query("DELETE FROM student_data WHERE id = ?", [id], callback);
    },
    getByIdOne(id, callback) {
        db.query("SELECT class_id FROM student_data WHERE id = ?", [id], callback);
    },
    getStudentByClass(class_id, callback) {
        db.query("SELECT * FROM student_data WHERE class_id = ?", [class_id], callback);
    },
    statusUpdate(id,status, callback) {
        db.query("UPDATE student_data SET status = ? WHERE id = ?", [status, id], callback);
    },
    updateStudentPic(id,profile_photo, callback) {
        db.query("UPDATE student_data SET profile_img = ? WHERE id = ?", [profile_photo,id], callback);
    },
    findById(id, callback) {
        db.query("SELECT * FROM student_data WHERE id = ?", [id], (err, results) => {
          if (err) {
            return callback(err, null);
          }
          callback(null, results[0]);
        });
    },
    getStudentBySearch(search, user_id, callback) {
        db.query("SELECT * FROM `student_data` WHERE (full_name = ? OR dob = ? OR phone = ? OR district = ? OR pincode = ?) AND user_id = ? AND status = 2", [search, search, search, search, search, user_id], callback);
    },


}

module.exports = studentRegistration;