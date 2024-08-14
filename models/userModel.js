const db = require('./database');
const User = {
   
    login(email, password, callback) {
        db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            if (results.length === 0) {
                // User not found
                return callback(null, null);
            } else {
                return callback(null, results);
            }
        });
    },
    check(password,id, callback) {
        db.query("SELECT * FROM users WHERE password = ? AND id = ?", [password,id], callback)
    },
    CheckExistClass(user_id,class_id, callback) {
        db.query("SELECT * FROM time_table WHERE user_id = ? AND class_id = ?", [user_id,class_id], callback)
    },
    
    create(data, callback) {
        db.query("INSERT INTO users SET ?", [data], callback);
    },
    createTimeTable(data, callback) {
        db.query("INSERT INTO time_table SET ?", [data], callback);
    },
    getAll(user_id,user_role,callback) {
        db.query("SELECT * FROM users WHERE id = ? AND role = ?", [user_id,user_role], callback)
    },
    getAllTimeTable(user_id,callback) {
        db.query("SELECT a.*,b.class_name,b.section FROM time_table as a,class_master as b WHERE a.class_id = b.id AND a.user_id = ?", [user_id], callback)
    },
    update(id,school_name, email, phone,school_code,address,district,pincode,state, callback) {
        db.query("UPDATE users SET school_name = ?, email = ?, phone = ?, school_code = ?, address = ?, district = ?, pincode = ?, state = ? WHERE id = ?", [school_name, email, phone,school_code,address,district,pincode,state,id], callback);
    },
    updateTimeTable(id,data,user_id, callback) {
        db.query("UPDATE time_table SET ? WHERE id = ? AND user_id = ?", [data,id,user_id], callback);
    },
    updateAdminPic(id,profile_photo, callback) {
        db.query("UPDATE users SET profile_photo = ? WHERE id = ?", [profile_photo,id], callback);
    },
    findById(id, callback) {
        db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
          if (err) {
            return callback(err, null);
          }
          callback(null, results[0]);
        });
    },
    updatePassword(password,id, callback) {
        db.query("UPDATE users SET password = ? WHERE id = ?", [password,id], callback);
    },
    updateBankAccount(id,bank_account_no,ifsc,holder_name,upi_id, callback) {
        db.query("UPDATE users SET bank_account_no = ?, ifsc = ?, holder_name = ?, upi_id = ? WHERE id = ?", [bank_account_no,ifsc,holder_name,upi_id,id], callback);
    },
    findById(id, callback) {
        db.query("SELECT * FROM users WHERE id = ?", [id], callback)
    },
    deleteTimeTable(id, callback) {
        db.query("DELETE FROM time_table WHERE id = ?", [id], callback);
    },
    findTimeTableById(id, callback) {
        db.query("SELECT * FROM time_table WHERE id = ?", [id], (err, results) => {
          if (err) {
            return callback(err, null);
          }
          callback(null, results[0]);
        });
    },


    getAllClassStudent(role, callback){
        db.query("SELECT a.* FROM student_data  WHERE role = ?", [role], callback);

    },

    ActiveStudent(user_id, callback){
        db.query("SELECT COUNT(id) as id FROM `student_data` WHERE `status` = 1 AND user_id = ?;", [user_id], callback);
    },
    InActiveStudent(user_id, callback){
        db.query("SELECT COUNT(id) as id FROM `student_data` WHERE `status` = 2 AND user_id = ?;", [user_id], callback);
    },
    ActiveTeacher(user_id, callback){
        db.query("SELECT COUNT(id) as id FROM `teacher_data` WHERE `status` = 1 AND user_id = ?;", [user_id], callback);
    },
    InActiveTeacher(user_id, callback){
        db.query("SELECT COUNT(id) as id FROM `teacher_data` WHERE `status` = 2 AND user_id = ?;", [user_id], callback);
    }
    
}

module.exports = User;