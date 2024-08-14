const { profile } = require("../models/studentRegistrationModel");
const classMaster = require("../models/classMasterModel");
const User = require("../models/userModel");
const path = require('path');
const fs = require('fs');

const unlinkImage = (imagePath, callback) => {
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      return callback(err);
    }
    callback(null);
  });
};
const userController = {



  login(req, res) {
    const { email, password } = req.body;
    if (email && password) {
      User.login(email, password, (error, data) => {
        if (error) throw error;
        if (data) {
          if (data[0].password == password) {
            // console.log("session",data);
            req.session.user_id = data[0].id;
            req.session.school_name = data[0].school_name;
            req.session.user_role = data[0].role;
            req.session.profile_photo = data[0].profile_photo;
            User.ActiveStudent(req.session.user_id, (error, ActiveStudentData) => {
              if (error) throw error;
              User.InActiveStudent(req.session.user_id, (error, InActiveStudent) => {
                if (error) throw error;
                User.ActiveTeacher(req.session.user_id, (error, ActiveTeacher) => {
                  if (error) throw error;
                  User.InActiveTeacher(req.session.user_id, (error, InActiveTeacher) => {
                    if (error) throw error;
                    res.render('index', { ActiveStudentData: ActiveStudentData,InActiveStudent:InActiveStudent,ActiveTeacher:ActiveTeacher,InActiveTeacher:InActiveTeacher, session: req.session });

                  });
                });
              });
            });

          } else {
            res.send("Incorrect Password.");
          }
        } else {
          res.send(`<script>
                        alert("Invalid email or password. Please try again.");
                        window.location.href = '/login';
                    </script>`);
        }
      });
    } else {
      res.send(`<script>
      alert("Please ");
      window.location.href = '/login';
  </script>`);
      res.end();
    }
  },

  adminEditPassword(req, res) {
    const { current_password, password } = req.body;
    const user_id = req.session.user_id;

    console.log('ritik', password, current_password, user_id);

    if (!current_password || !password) {
      return res.send(`<script>
        alert("Both current password and new password are required.");
        window.location.href = '/admin-detail';
      </script>`);
    }

    User.check(current_password, user_id, (error, data) => {
      if (error) {
        console.error(error);
        return res.send(`<script>
          alert("An error occurred. Please try again.");
          window.location.href = '/admin-detail';
        </script>`);
      }

      if (data && data.length > 0) {
        if (data[0].password == current_password) {
          User.updatePassword(password, user_id, (error) => {
            if (error) {
              console.error(error);
              return res.send(`<script>
                alert("An error occurred while updating the password. Please try again.");
                window.location.href = '/admin-detail';
              </script>`);
            }

            return res.send(`<script>
              alert("Password updated successfully.");
              window.location.href = '/admin-detail';
            </script>`);
          });
        } else {
          return res.send(`<script>
            alert("Incorrect current password.");
            window.location.href = '/admin-detail';
          </script>`);
        }
      } else {
        return res.send(`<script>
          alert("Current Password Does not Match. Please try again.");
          window.location.href = '/admin-detail';
        </script>`);
      }
    });
  },

  register(req, res) {
    const { school_name, email, password, phone, school_code, address, district, pincode, state, role } = req.body;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    const create_date = today;


    const data = {
      school_name,
      email,
      password,
      phone,
      school_code,
      address,
      district,
      pincode,
      state,
      role,
      create_date,
    };
    User.create(data, (error) => {
      if (error) {
        console.log("There is some issue" + error);
      } else {
        res.send(`<script>
          alert("Account Created Successfully");
          window.location.href = '/login';
      </script>`);
      }
    });
  },
  getAll(req, res) {
    const user_id = req.session.user_id;
    const user_role = req.session.user_role;
    User.getAll(user_id, user_role, (error, data) => {
      if (error) throw error;
      res.render('admin-detail', { data: data, session: req.session });
    });
  },

  getAllClassStudent(req, res) {
    student_id = req.session.id;
    role = 3;
    User.getAllClassStudent(student_id, role, (error, data) => {
      if (error) throw error;
      res.render('class-list-view', { data: data, session: req.session });
    });

  },

  updateAdminProfile(req, res) {
    const { id, school_name, email, phone, school_code, address, district, pincode, state } = req.body;
    const data = {
      school_name, email, phone, school_code, address, district, pincode, state
    };
    console.log(id)
    console.log(data);
    User.update(id, school_name, email, phone, school_code, address, district, pincode, state, (error) => {
      if (error) {
        console.log("There is some issue: " + error);
      } else {
        console.log("Admin Profile Updated successfully.");
        res.redirect("/admin-detail");
      }
    });
  },
  adminAddBankAccount(req, res) {
    const { id, bank_account_no, ifsc, holder_name, upi_id } = req.body;
    const data = {
      bank_account_no, ifsc, holder_name, upi_id
    };
    console.log(id)
    console.log(data);
    User.updateBankAccount(id, bank_account_no, ifsc, holder_name, upi_id, (error) => {
      if (error) {
        console.log("There is some issue: " + error);
      } else {
        console.log("Bank Account Updated successfully.");
        res.redirect("/admin-detail");
      }
    });
  },
  adminPicUpload(req, res) {
    const profile_photo = req.files.profile_photo ? req.files.profile_photo[0].filename : "";
    const { id } = req.body;

    // Fetch the existing user to get the current profile photo
    User.findById(id, (err, user) => {
      if (err) {
        console.error("Error fetching user: " + err);
        return res.status(500).send("Server error");
      }


      const oldProfilePhoto = user[0].profile_photo;
      //console.log(oldProfilePhoto,"hello dhako kya hoga");
      User.updateAdminPic(id, profile_photo, (error) => {
        if (error) {
          console.log("There is some issue: " + error);
          return res.status(500).send("Server error");
        } else {
          console.log("Profile updated successfully.");

          // If there is an old profile photo, delete it
          if (oldProfilePhoto) {
            const oldImagePath = path.join(__dirname, '../uploads/', oldProfilePhoto);
            unlinkImage(oldImagePath, (err) => {
              if (err) {
                console.error('Failed to delete old profile photo: ' + err);
              }
            });
          }

          res.redirect("/admin-detail");
        }
      });
    });
  },

  getAllTimeTable(req, res) {
    const user_id = req.session.user_id;
    User.getAllTimeTable(user_id, (error, data) => {
      // console.log(data);
      if (error) throw error;
      classMaster.classDropdownByUserId(user_id, (error, class_data) => {
        // console.log(class_data);
        if (error) throw error;
        res.render('time-table', { data: data, class_data: class_data, session: req.session });
      });
    });
  },
  addTimeTable(req, res) {
    const table = req.files.table ? req.files.table[0].filename : "";
    const class_id = req.body.class_id;
    // console.log(class_id);
    const user_id = req.session.user_id;
    const data = {
      table, class_id, user_id
    }
    User.CheckExistClass(user_id, class_id, (error, result) => {
      if (error) throw error;
      if (result.length > 0) {
        res.send(`<script>
          alert("This Class Time Table is already in use");
          window.location.href = '/time-table';
      </script>`);
      } else {
        User.createTimeTable(data, (error) => {
          if (error) {
            console.log("There is some issue: " + error);
          } else {
            console.log("Time Table Updated successfully.");
            res.redirect("/time-table");
          }
        });
      }
    });
  },
  editTimeTable(req, res) {
    const { id, class_id } = req.body;
    const table = req.files.table ? req.files.table[0].filename : "";
    const user_id = req.session.user_id;
    const data = {
      class_id,
      table,
    };
    User.findTimeTableById(id, (err, user) => {
      if (err) {
        console.error("Error fetching user: " + err);
        return res.status(500).send("Server error");
      }


      const oldtable = user.table;
      console.log(oldtable, "hello dhako kya hoga");

      User.updateTimeTable(id, data, user_id, (error) => {
        if (error) {
          console.log("There is some issue: " + error);
        } else {
          console.log("Time Table updated successfully.");
          if (oldtable) {
            const oldtablePath = path.join(__dirname, '../uploads/', oldtable);
            unlinkImage(oldtablePath, (err) => {
              if (err) {
                console.error('Failed to delete old table photo: ' + err);
              }
            });
          }
          res.redirect("/time-table");
        }
      });
    });
  },

  genAdmitCard(req, res) {
    const user_id = req.session.user_id;
    classMaster.classDropdownByUserId(user_id, (error, class_data) => {
      if (error) throw error;
      res.render('generateAdmitCard', { class_data: class_data, session: req.session });
    });
  },


  deleteTimeTable(req, res) {
    const id = req.query.id;
    User.deleteTimeTable(id, (error) => {
      if (error) {
        console.error("Error deleting class:", error);
        res.status(500).send("Failed to delete class.");
      } else {
        res.redirect('/time-table');
      }
    });
  }

};

module.exports = userController;
