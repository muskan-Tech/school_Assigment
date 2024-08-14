const studentRegistration = require("../models/studentRegistrationModel");
const classMaster = require("../models/classMasterModel");
const sessionMaster = require("../models/sessionMasterModel");
const Login = require("../models/loginModel");
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
const studentController = {
  // Fetch all classes and render the classMasters view
  getAll(req, res) {
    const user_id = req.session.user_id;
    studentRegistration.getAll(user_id, (error, data) => {
      if (error) throw error;
      classMaster.classDropdownByUserId(user_id, (error, class_data) => {
        if (error) throw error;
        sessionMaster.sessionDropdownByUserId(user_id, (error, sess) => {
          if (error) throw error;
          res.render('studentRegistration', { data: data, sess: sess, classess: class_data, session: req.session });
        });
      });
    });
  },




  detail(req, res) {
    const id = req.query.id || req.session.register_id;
    const user_id = req.session.user_id || req.session.user;
    const role = req.session.role || req.session.user_role;
    studentRegistration.profile(id, user_id, (error, data) => {
      if (error) throw error;
      studentRegistration.calculateFees(role, user_id, id, (error, fees_data) => {
        //console.log('ritik', fees_data)
        if (error) throw error;
        classMaster.classDropdownByUserId(user_id, (error, class_data) => {
          if (error) throw error;
          res.render('student-detail', { data: data, classess: class_data, fees_data: fees_data, session: req.session });
        });
      });
    });
  },



  // Create a new class and handle the response
  create(req, res) {
    const adharcard_img = req.files.adharcard_img ? req.files.adharcard_img[0].filename : '';
    const transfer_certificate_img = req.files.transfer_certificate_img ? req.files.transfer_certificate_img[0].filename : '';
    const medical_report_img = req.files.medical_report_img ? req.files.medical_report_img[0].filename : '';
    const { full_name, roll_no, email, phone, dob, adharcard_no, address, district, pincode, state, father_name, father_email, father_no, mother_name, mother_email, mother_no, class_id, session_id } = req.body;
    const user_id = req.session.user_id;

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    const create_date = today;
    const status = 2;
    // console.log(class_id);

    const data = {
      user_id, full_name, roll_no, email, phone, dob, adharcard_no, adharcard_img, address, district, pincode, state, father_name, father_email, father_no, mother_name, mother_email, mother_no, transfer_certificate_img, medical_report_img, class_id, session_id, create_date, status
    };

    studentRegistration.create(data, (error) => {
      if (error) {
        console.log("There is some issue: " + error);
      } else {
        res.send(`<script>
          alert("Add Student Detail Successfully");
          window.location.href = '/student';
        </script>`);
      }
    });
  },

  // Fetch class details by ID and render the edit form
  editStudent(req, res) {
    const id = req.query.id;
    studentRegistration.getById(id, (error, data) => {
      if (error) throw error;
      res.render('studentRegistration', { data: data, session: req.session });
    });
  },

  // Update class details
  updateStudent(req, res) {
    const adharcard_img = req.files.adharcard_img ? req.files.adharcard_img[0].filename : '';
    const transfer_certificate_img = req.files.transfer_certificate_img ? req.files.transfer_certificate_img[0].filename : '';
    const medical_report_img = req.files.medical_report_img ? req.files.medical_report_img[0].filename : '';

    const { id, full_name, roll_no, email, phone, dob, adharcard_no, address, district, pincode, state, father_name, father_email, father_no, mother_name, mother_email, mother_no, class_id, session_id } = req.body;
    const user_id = req.session.user_id;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    const create_date = today;
    const status = 2;
    const data = {
      user_id, full_name, roll_no, email, phone, dob, adharcard_no, adharcard_img, address, district, pincode, state, father_name, father_email, father_no, mother_name, mother_email, mother_no, transfer_certificate_img, medical_report_img, class_id, session_id, create_date, status
    };
    //console.log(data);

    studentRegistration.findById(id, (err, existingStudent) => {
      if (err) {
        console.error("Error fetching student: " + err);
        return res.status(500).send("Server error");
      }
  
      const oldAdharcardImg = existingStudent ? existingStudent.adharcard_img : null;
      const oldTransferCertificateImg = existingStudent ? existingStudent.transfer_certificate_img : null;
      const oldMedicalReportImg = existingStudent ? existingStudent.medical_report_img : null;

      //console.log(existingStudent,"hello dhako kya hoga");
    studentRegistration.update(id, data, (error) => {
      if (error) {
        console.log("There is some issue: " + error);
      } else {
        console.log("Student Detail updated successfully.");


        if (oldAdharcardImg ) {
          const oldAdharcardPath = path.join(__dirname, '../uploads/', oldAdharcardImg);
          unlinkImage(oldAdharcardPath, (err) => {
            if (err) {
              console.error('Failed to delete old profile photo: ' + err);
            }
          });
        }
        if (oldTransferCertificateImg ) {
          const oldTransferCertificatePath = path.join(__dirname, '../uploads/', oldTransferCertificateImg);
          unlinkImage(oldTransferCertificatePath, (err) => {
            if (err) {
              console.error('Failed to delete old profile photo: ' + err);
            }
          });
        }
        if (oldMedicalReportImg ) {
          const oldMedicalReportPath = path.join(__dirname, '../uploads/', oldMedicalReportImg);
          unlinkImage(oldMedicalReportPath, (err) => {
            if (err) {
              console.error('Failed to delete old profile photo: ' + err);
            }
          });
        }
        

  
        res.redirect("/student");
      }
    });
  });
  },

  approveStudent(req, res) {
    const id = req.body.id;
    const status = 1;
    const email = req.body.email;
    const DOB = req.body.dob;
    const register_id = id;
    const user_id = req.session.user_id;
    const role = 3;
    const parsedDate = new Date(DOB);
    const password = `${parsedDate.getDate().toString().padStart(2, '0')}/${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}/${parsedDate.getFullYear()}`;

    const data = { email, password, role, user_id, register_id };
    studentRegistration.statusUpdate(id, status, (error) => {
      if (error) {
        console.error("Error updating student status:", error);
        res.status(500).send("Error updating student status");
        return;
      }
      Login.create(data, (error) => {
        if (error) {
          console.error("Error creating login:", error);
          res.status(500).send("Error creating login");
        } else {
          console.log("Student Activated successfully.");
          res.redirect("/student");
        }
      });
    });
  },
  studentPicUpload(req, res) {
    const profile_photo = req.files.profile_img ? req.files.profile_img[0].filename : "";
    const { id } = req.body;
    // console.log(id, "id");
    // console.log(profile_photo, "profile");
    studentRegistration.findById(id, (err, user) => {
      if (err) {
        console.error("Error fetching user: " + err);
        return res.status(500).send("Server error");
      }
     

      const oldProfilePhoto = user.profile_img;
      //console.log(user,"hello dhako kya hoga");
    studentRegistration.updateStudentPic(id, profile_photo, (error) => {
      if (error) {
        console.log("There is some issue: " + error);
      } else {
        console.log("profile Updated successfully.");

        if (oldProfilePhoto) {
          const oldImagePath = path.join(__dirname, '../uploads/', oldProfilePhoto);
          unlinkImage(oldImagePath, (err) => {
            if (err) {
              console.error('Failed to delete old profile photo: ' + err);
            }
          });
        }

        res.redirect("/student-detail?id=" + id);
      }
    });
  });
  },



  // Delete a class by ID
  deleteStudent(req, res) {
    const id = req.query.id;
    studentRegistration.delete(id, (error) => {
      if (error) {
        console.error("Error deleting class:", error);
        res.status(500).send("Failed to delete Student Detail.");
      } else {
        res.redirect('/student');
      }
    });
  },


  searchStudent(req, res) {
    let search = req.body.search;
    let user_id = req.session.user_id;
    if (Array.isArray(search)) {
      search = search.join(" ");
    }

    if (typeof search === "string") {
      search = search.trim();
    } else {
      search = "";
    }

    studentRegistration.getStudentBySearch(search, user_id, (error, Data) => {
      if (error) throw error;
      classMaster.classDropdownByUserId(user_id, (error, class_data) => {
        if (error) throw error;
        sessionMaster.sessionDropdownByUserId(user_id, (error, sess) => {
          if (error) throw error;
      if (search == '') {
        res.send(`<script>alert("Please Type Something in Search Box");window.location.href = '/student';</script>`);
      } else {
        if (error) { throw error; }
        res.render('studentRegistration', { data: Data,classess:class_data,sess:sess, session: req.session });
      };
    });
  });
  });
  },

};

module.exports = studentController;
