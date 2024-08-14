const Admittedstudent = require("../models/AdmittedstudentModel");
const classMaster = require("../models/classMasterModel");
const sessionMaster = require("../models/sessionMasterModel");
const studentRegistration = require("../models/studentRegistrationModel");
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
const admittedstudentController = {


  getAll(req, res) {
    const user_id = req.session.user_id;
    Admittedstudent.getAll(user_id,(error, data) => {
      if (error) throw error;
      classMaster.classDropdownByUserId(user_id,(error, class_data) => {
        if (error) throw error;
        sessionMaster.sessionDropdownByUserId(user_id,(error, sess) => {
          if (error) throw error;
      res.render('studentadmission', { data: data,sess:sess,classess:class_data, session: req.session });
    });
  });
});
  },

  studentTimeTableView(req, res) {
    const user = req.session.register_id;
    const role = req.session.role;
    console.log('ritik',user,role);
    Admittedstudent.getStudentTimeTable(user,role,(error, data) => {
      console.log(data);
      if (error) throw error;
      res.render('student-time-table', { data: data,session: req.session });
    });
  },

  // Fetch class details by ID and render the edit form
  editAdmittedStudent(req, res) {
    const id = req.query.id;
    Admittedstudent.getById(id, (error, data) => {
      if (error) throw error;
      res.render('studentadmission', { data: data, session: req.session });
    });
  },

  // Update class details
  updateAdmittedStudent(req, res) {
    const adharcard_img = req.files.adharcard_img ? req.files.adharcard_img[0].filename : '';
    const transfer_certificate_img = req.files.transfer_certificate_img ? req.files.transfer_certificate_img[0].filename : '';
    const medical_report_img = req.files.medical_report_img ? req.files.medical_report_img[0].filename : '';
   
    const { id,full_name,roll_no, email, phone,dob,adharcard_no,address,district,pincode,state,father_name,father_email,father_no,mother_name,mother_email,mother_no,class_id, session_id,status = 1} = req.body;
    const user_id = req.session.user_id;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    const create_date = today;

    const data = {
      user_id,full_name,roll_no, email, phone,dob,adharcard_no,adharcard_img,address,district,pincode,state,father_name,father_email,father_no,mother_name,mother_email,mother_no,transfer_certificate_img,medical_report_img,class_id, session_id,create_date,status
    };
    studentRegistration.findById(id, (err, existingStudent) => {
      if (err) {
        console.error("Error fetching student: " + err);
        return res.status(500).send("Server error");
      }
  
      const oldAdharcardImg = existingStudent ? existingStudent.adharcard_img : null;
      const oldTransferCertificateImg = existingStudent ? existingStudent.transfer_certificate_img : null;
      const oldMedicalReportImg = existingStudent ? existingStudent.medical_report_img : null;

      //console.log(existingStudent,"hello dhako kya hoga");
    Admittedstudent.update(id, data, (error) => {
      if (error) {
        console.log("There is some issue: " + error);
      } else {
        console.log("Classes updated successfully.");
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
        res.redirect("/admitstudent");
      }
    });
  });
  },
  deactiveStudent(req, res) {
    const id = req.body.id;
    const register_id = id;
    const status = 2;
    const role = 3;
    const user_id = req.session.user_id;
    studentRegistration.statusUpdate(id, status, (error) => {
      Login.delete(register_id,user_id,role, (error) => {
        if (error) {
      if (error) {
        console.log("There is some issue: " + error);
      } else {
        console.log("Student Deactived successfully.");
        
      }}
      res.redirect("/admitstudent");
    });
  });
  },
  // Delete a class by ID
  deleteAdmittedStudent(req, res) {
    const id = req.query.id;
    Admittedstudent.delete(id, (error) => {
      if (error) {
        console.error("Error deleting class:", error);
        res.status(500).send("Failed to delete class.");
      } else {
        res.redirect('/admitstudent');
      }
    });
  },

  
  searchStudent(req, res) {
    let search = req.body.search;
    let class_id = req.body.class_id;
    let user_id = req.session.user_id;
    if (Array.isArray(search)) {
      search = search.join(" ");
    }

    if (typeof search === "string") {
      search = search.trim();
    } else {
      search = "";
    }

    Admittedstudent.getStudentBySearch(search, user_id, (error, Data) => {
      if (error) throw error;
      if(Data.length > 0){
      classMaster.classDropdownByUserId(user_id, (error, class_data) => {
        if (error) throw error;
        sessionMaster.sessionDropdownByUserId(user_id, (error, sess) => {
          if (error) throw error;
      if (search == '') {
        res.send(`<script>alert("Please Type Something in Search Box");window.location.href = '/admitstudent';</script>`);
      } else {
        if (error) { throw error; }
        res.render('studentRegistration', { data: Data,classess:class_data,sess:sess, session: req.session });
      };
    });
  });
}else{
  res.send(`<script>alert("No Student Found");window.location.href = '/admitstudent';</script>`);
}
  });
  },
};

module.exports = admittedstudentController;
