const teacherAccount = require("../models/teacherAccountGenerateModel");
const activeTeacher = require("../models/activeTeacherModel");
const classMaster = require("../models/classMasterModel");
const sessionMaster = require("../models/sessionMasterModel");
const Login = require("../models/loginModel");
const path = require('path');
const fs = require('fs');

// Helper function to unlink image
function unlinkImage(imagePath, callback) {
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error('Failed to delete old image: ' + err);
    }
    callback();
  });
}

const TeacherController = {
  // Fetch all classes and render the classMasters view
  getAll(req, res) {
    const user_id = req.session.user_id;
    teacherAccount.getAll(user_id,(error, data) => {
      if (error) throw error;
        sessionMaster.sessionDropdownByUserId(user_id,(error, sess) => {
          if (error) throw error;
      res.render('teacherAccountGenerate', { data: data,sess:sess, session: req.session });

  });
});
  },



  // Create a new class and handle the response
  create(req, res) {
    const adharcard_img = req.files.adharcard_img ? req.files.adharcard_img[0].filename : '';
    const resume_img = req.files.resume_img ? req.files.resume_img[0].filename : '';
    const three_months_salary_slip_img = req.files.three_months_salary_slip_img ? req.files.three_months_salary_slip_img[0].filename : '';
    const experience_letter = req.files.experience_letter ? req.files.experience_letter[0].filename : '';
   
    const { full_name, email, phone,dob,adharcard_no,address,district,pincode,state,higher_qualification,session_id } = req.body;
    const user_id = req.session.user_id;
   
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    const create_date = today;
    const status = 2;

    const data = {
      user_id,full_name,email, phone,dob,adharcard_no,adharcard_img,address,district,pincode,state,higher_qualification,resume_img,three_months_salary_slip_img,experience_letter,session_id,create_date,status
    };

    teacherAccount.create(data, (error) => {
      if (error) {
        console.log("There is some issue: " + error);
      } else {
        res.send(`<script>
          alert("Add Teacher Detail Successfully");
          window.location.href = '/teacher';
        </script>`);
      }
    });
  },

  // Fetch class details by ID and render the edit form
  editTeacher(req, res) {
    const id = req.query.id;
    teacherAccount.getById(id, (error, data) => {
      if (error) throw error;
      res.render('teacherAccountGenerate', { data: data, session: req.session });
    });
  },

  teacherApproval(req, res) {
    const id = req.body.id;
    const status = 1;
    const email = req.body.email;
    const dob = req.body.dob; 
    const register_id = id; 
    const user_id = req.session.user_id;
    const role = 2;
    const parsedDate = new Date(dob);
    const password = `${parsedDate.getDate().toString().padStart(2, '0')}/${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}/${parsedDate.getFullYear()}`;
    const data = { email,password,role,register_id,user_id
  };
    teacherAccount.statusUpdate(id, status, (error) => {
      if (error) {
        console.log("There is some issue: " + error);
      }
      Login.create(data, (error) => {
        if (error) {
            console.error("Error creating login:", error);
            res.status(500).send("Error creating login");
        } else {
        console.log("Teacher Activated successfully.");
        res.redirect("/teacher");
      }
    });
  });
  },

  // Update class details
  updateTeacher(req, res) {
    const adharcard_img = req.files.adharcard_img ? req.files.adharcard_img[0].filename : '';
    const resume_img = req.files.resume_img ? req.files.resume_img[0].filename : '';
    const three_months_salary_slip_img = req.files.three_months_salary_slip_img ? req.files.three_months_salary_slip_img[0].filename : '';
    const experience_letter = req.files.experience_letter ? req.files.experience_letter[0].filename : '';
   
    const { id,full_name, email, phone,dob,adharcard_no,address,district,pincode,state,higher_qualification,session_id } = req.body;
    const user_id = req.session.user_id;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    const create_date = today;
    const status = 2;
    const data = {
      user_id,full_name, email, phone,dob,adharcard_no,adharcard_img,address,district,pincode,state,higher_qualification,resume_img,three_months_salary_slip_img,experience_letter,session_id,create_date,status
    };
    //console.log(data);
    //console.log(id);

    activeTeacher.findById(id, (err, existingTeacher) => {
      if (err) {
        console.error("Error fetching teacher: " + err);
        return res.status(500).send("Server error");
      }
  
      const oldAdharcardImg = existingTeacher ? existingTeacher.adharcard_img : null;
      const oldResumeImg = existingTeacher ? existingTeacher.resume_img : null;
      const oldThreeMonthsSalarySlipImg = existingTeacher ? existingTeacher.three_months_salary_slip_img : null;
      const oldExperienceLetter = existingTeacher ? existingTeacher.experience_letter : null;
  

    teacherAccount.update(id, data, (error) => {
      if (error) {
        console.log("There is some issue: " + error);
      } else {
        console.log("Teacher Detail Updated successfully.");

        if (oldAdharcardImg) {
          const oldAdharcardPath = path.join(__dirname, '../uploads/', oldAdharcardImg);
          unlinkImage(oldAdharcardPath, (err) => {
            if (err) {
              console.error('Failed to delete old Adharcard Img: ' + err);
            }
          });
        }
        if (oldResumeImg) {
          const oldResumePath = path.join(__dirname, '../uploads/', oldResumeImg);
          unlinkImage(oldResumePath, (err) => {
            if (err) {
              console.error('Failed to delete old profile photo: ' + err);
            }
          });
        }
        if (oldThreeMonthsSalarySlipImg) {
          const oldThreeMonthsSalarySlipPath = path.join(__dirname, '../uploads/', oldThreeMonthsSalarySlipImg);
          unlinkImage(oldThreeMonthsSalarySlipPath, (err) => {
            if (err) {
              console.error('Failed to delete old profile photo: ' + err);
            }
          });
        }
        if (oldExperienceLetter) {
          const oldExperienceLetterPath = path.join(__dirname, '../uploads/', oldExperienceLetter);
          unlinkImage(oldExperienceLetterPath, (err) => {
            if (err) {
              console.error('Failed to delete old profile photo: ' + err);
            }
          });
        }
        res.redirect("/teacher");
      }
    });
  });
  },

  // Delete a class by ID
  deleteTeacher(req, res) {
    const id = req.query.id;
    teacherAccount.delete(id, (error) => {
      if (error) {
        console.error("Error deleting class:", error);
        res.status(500).send("Failed to delete Teacher Detail.");
      } else {
        res.redirect('/teacher');
      }
    });
  }
};

module.exports = TeacherController;
