const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");
const userController = require("../controllers/userController");
const payFees = require("../controllers/payFeesController");
const classMasterController = require("../controllers/classMasterController");
const feesMasterController = require("../controllers/feesMasterController");
const subjectMasterController = require("../controllers/subjectMasterController");
const sesssionMasterController = require("../controllers/sessionMasterController");
const studentRegistration = require("../controllers/studentRegistrationController");
const studentAdmission = require("../controllers/admittedStudentController");
const teacherAccountGenerate = require("../controllers/teacherAccountGenerateController");
const activeTeacher = require("../controllers/activeTeacherController");
const loginController = require("../controllers/loginController");
const attendanceController = require("../controllers/attendanceController");
var express = require('express');
var router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require('fs');
const crypto = require('crypto');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
    const extension = path.extname(file.originalname);
    const filename = path.basename(file.originalname, extension) + '-' + uniqueSuffix + extension;
   
    // const timestamp = Date.now();
    // const ext = path.extname(file.originalname);
    // //const filename = `${timestamp}${ext}`;
     const filePath = path.join('uploads', filename);

    // Check if file already exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // File does not exist, proceed with the upload
        cb(null, filename);
      } else {
        // File exists, set an error message and return an error
        cb(new Error('File with the same name already exists'));
      }
    });
  },
});

const upload = multer({ storage: storage });


/* GET home page. */
router.get("/", (req, res) => {
  if (req.session.user_id || req.session.ts_id) {
    res.render('index',{ session: req.session});
  } else {
    res.redirect("st_login");
  }
});


//Start Signin And SignUP Routes
router.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.redirect("/");
});
router.post("/login", userController.login);
router.post("/register", userController.register);
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/register', function(req, res, next) {
  res.render('register');
});
//END Signin And SignUP Routes


// start admin-detail detail routes
router.get("/admin-detail",userAuth.requireLogin,adminAuth.requireLogin,userController.getAll);
router.post("/admin-pic-upload",userAuth.requireLogin,adminAuth.requireLogin,upload.fields([{ name: "profile_photo", maxCount: 1 }]),userController.adminPicUpload);
router.post("/updateAdminProfile",userAuth.requireLogin,adminAuth.requireLogin,userController.updateAdminProfile);
router.post("/adminEditPassword",userAuth.requireLogin,adminAuth.requireLogin,userController.adminEditPassword);
router.post("/adminAddBankAccount",userAuth.requireLogin,adminAuth.requireLogin,userController.adminAddBankAccount);
// END admin student-detail routes
//start class routes
router.get("/class",userAuth.requireLogin,adminAuth.requireLogin,classMasterController.getAll);
router.post("/add_class",userAuth.requireLogin,adminAuth.requireLogin,classMasterController.create);
router.get("/editclass",userAuth.requireLogin,adminAuth.requireLogin,classMasterController.editclass);
router.post("/updateclass",userAuth.requireLogin,adminAuth.requireLogin,classMasterController.updateclass);
router.get("/deleteclass",userAuth.requireLogin,adminAuth.requireLogin,classMasterController.deleteclass);
//END class routes
//start Fees routes
router.get("/fees",userAuth.requireLogin,adminAuth.requireLogin,feesMasterController.getAll);
router.post("/add_fees",userAuth.requireLogin,adminAuth.requireLogin,feesMasterController.create);
router.get("/editfees",userAuth.requireLogin,adminAuth.requireLogin,feesMasterController.editfees);
router.post("/updatefees",userAuth.requireLogin,adminAuth.requireLogin,feesMasterController.updatefees);
router.get("/deletefees",userAuth.requireLogin,adminAuth.requireLogin,feesMasterController.deletefees);
//END Fees routes

//start Subject routes
router.get("/subject",userAuth.requireLogin,adminAuth.requireLogin,subjectMasterController.getAll);
router.post("/add_subject",userAuth.requireLogin,adminAuth.requireLogin,subjectMasterController.create);
router.get("/editsubject",userAuth.requireLogin,adminAuth.requireLogin,subjectMasterController.editSubject);
router.post("/updatesubject",userAuth.requireLogin,adminAuth.requireLogin,subjectMasterController.updateSubject);
router.get("/deletesubject",userAuth.requireLogin,adminAuth.requireLogin,subjectMasterController.deleteSubject);
//END Subject routes

//start Session routes
router.get("/session",userAuth.requireLogin,adminAuth.requireLogin,sesssionMasterController.getAll);
router.post("/add_session",userAuth.requireLogin,adminAuth.requireLogin,sesssionMasterController.create);
router.get("/editsession",userAuth.requireLogin,adminAuth.requireLogin,sesssionMasterController.editSession);
router.post("/updatesession",userAuth.requireLogin,adminAuth.requireLogin,sesssionMasterController.updateSession);
router.get("/deletesession",userAuth.requireLogin,adminAuth.requireLogin,sesssionMasterController.deleteSession);
//END Session routes

//start Student Registration routes
router.get("/student",userAuth.requireLogin,adminAuth.requireLogin,studentRegistration.getAll);
router.post("/student",userAuth.requireLogin,adminAuth.requireLogin,studentRegistration.searchStudent);
router.post("/add_student",userAuth.requireLogin,adminAuth.requireLogin,upload.fields([
  { name: 'adharcard_img', maxCount: 1 },
  { name: 'transfer_certificate_img', maxCount: 1 },
  { name: 'medical_report_img', maxCount: 1 }
  ]),studentRegistration.create);
router.get("/editstudent",userAuth.requireLogin,adminAuth.requireLogin,studentRegistration.editStudent);
router.post("/updatestudent",userAuth.requireLogin,adminAuth.requireLogin,upload.fields([
  { name: 'adharcard_img', maxCount: 1 },
  { name: 'transfer_certificate_img', maxCount: 1 },
  { name: 'medical_report_img', maxCount: 1 }
  ]),studentRegistration.updateStudent);
router.get("/deletestudent",userAuth.requireLogin,adminAuth.requireLogin,studentRegistration.deleteStudent);
router.get("/student-detail",userAuth.requireLogin,studentRegistration.detail);
router.post("/student-pic-upload",userAuth.requireLogin,upload.fields([{ name: "profile_img", maxCount: 1 }]),studentRegistration.studentPicUpload);
router.post("/studentApproval",userAuth.requireLogin,adminAuth.requireLogin,studentRegistration.approveStudent);
//END Student Registration 

// start admitted student detail routes
router.get("/admitstudent",userAuth.requireLogin,adminAuth.requireLogin,studentAdmission.getAll);
router.post("/admitstudent",userAuth.requireLogin,adminAuth.requireLogin,studentAdmission.searchStudent);
router.get("/editAdmittedStudent",userAuth.requireLogin,adminAuth.requireLogin,studentAdmission.editAdmittedStudent);
router.post("/updateAdmittedStudent",userAuth.requireLogin,adminAuth.requireLogin,upload.fields([
  { name: 'adharcard_img', maxCount: 1 },
  { name: 'transfer_certificate_img', maxCount: 1 },
  { name: 'medical_report_img', maxCount: 1 }
  ]),studentAdmission.updateAdmittedStudent);
router.get("/deleteAdmittedStudent",userAuth.requireLogin,adminAuth.requireLogin,studentAdmission.deleteAdmittedStudent);
router.post("/studentDeactive",userAuth.requireLogin,adminAuth.requireLogin,studentAdmission.deactiveStudent);
// END admitted student detail routes


//start Teacher Account Generate routes
router.get("/teacher",userAuth.requireLogin,adminAuth.requireLogin,teacherAccountGenerate.getAll);
router.post("/add_teacher",userAuth.requireLogin,adminAuth.requireLogin,upload.fields([
  { name: 'adharcard_img', maxCount: 1 },
  { name: 'resume_img', maxCount: 1 },
  { name: 'three_months_salary_slip_img', maxCount: 1 },
  { name: 'experience_letter', maxCount: 1 }
  ]),teacherAccountGenerate.create);
router.get("/editteacher",userAuth.requireLogin,adminAuth.requireLogin,teacherAccountGenerate.editTeacher);
router.post("/updateteacher",userAuth.requireLogin,adminAuth.requireLogin,upload.fields([
  { name: 'adharcard_img', maxCount: 1 },
  { name: 'resume_img', maxCount: 1 },
  { name: 'three_months_salary_slip_img', maxCount: 1 },
  { name: 'experience_letter', maxCount: 1 }
  ]),teacherAccountGenerate.updateTeacher);
router.post("/teacherApproval",userAuth.requireLogin,adminAuth.requireLogin,teacherAccountGenerate.teacherApproval);
router.get("/deleteteacher",userAuth.requireLogin,adminAuth.requireLogin,teacherAccountGenerate.deleteTeacher);
//END Teacher Account Generate routes

//start ACtive Teacher Account  routes
router.get("/active-teacher",userAuth.requireLogin,adminAuth.requireLogin,activeTeacher.getAll);
//router.post("/add_teacher",userAuth.requireLogin,adminAuth.requireLogin,activeTeacher.create);
router.get("/editteacher",userAuth.requireLogin,adminAuth.requireLogin,activeTeacher.editTeacher);
router.post("/updateteacher_active",userAuth.requireLogin,adminAuth.requireLogin,upload.fields([
  { name: 'adharcard_img', maxCount: 1 },
  { name: 'resume_img', maxCount: 1 },
  { name: 'three_months_salary_slip_img', maxCount: 1 },
  { name: 'experience_letter', maxCount: 1 }
  ]),activeTeacher.updateTeacher);
router.get("/deleteteacher",userAuth.requireLogin,adminAuth.requireLogin,activeTeacher.deleteTeacher);
router.get("/teacher-detail",userAuth.requireLogin,userAuth.requireTeacher,activeTeacher.detail);
router.post("/teacher-pic-upload",userAuth.requireLogin,upload.fields([{ name: "profile_photo", maxCount: 1 }]),activeTeacher.teacherPicUpload);
router.post("/teacherPending",userAuth.requireLogin,adminAuth.requireLogin,activeTeacher.teacherDeactive);
//END Active Teacher Account routes

// STart Teacher attendance submit by admin
router.get("/teacher_att_mark",userAuth.requireLogin,adminAuth.requireLogin,attendanceController.getAllTeacherName);
router.post("/teacher_attendance_submit",userAuth.requireLogin,adminAuth.requireLogin,attendanceController.teacherAttendanceSubmit);
router.get("/teacher_my_att",userAuth.requireLogin,userAuth.requireTeacher,attendanceController.getAllTeacherAttendance);
// END Teacher attendance submit by admin

//start student Fees View  Account  routes
router.get("/student-fees",userAuth.requireLogin,adminAuth.requireLogin,payFees.getAllPendingFees);
router.get("/succesfees",userAuth.requireLogin,adminAuth.requireLogin,payFees.submitFees);
router.get("/rejectfees",userAuth.requireLogin,adminAuth.requireLogin,payFees.rejectFees);
//END student Fees View Account routes


//start time table routes
router.get("/time-table",userAuth.requireLogin,adminAuth.requireLogin,userController.getAllTimeTable);
router.get("/delete-TimeTable",userAuth.requireLogin,adminAuth.requireLogin,userController.deleteTimeTable);
router.post("/add-timeTable",userAuth.requireLogin,upload.fields([{ name: "table", maxCount: 1 }]),userController.addTimeTable);
router.post("/edit-TimeTable",userAuth.requireLogin,upload.fields([{ name: "table", maxCount: 1 }]),userController.editTimeTable);
//End Time Table routes

//start Generate admit card routes
router.get("/gen-admit-card",userAuth.requireLogin,adminAuth.requireLogin,userController.genAdmitCard);
//End Generate admit card routes

// start Time Table 
router.get("/timetable", (req, res) => {
  if (req.session.user_id) {
    res.render('timetable',{ session: req.session});
  } else {
    res.render("login");
  }
});
// End Time TAble

//###########################################################################################################################################
//Start Teacher AND Student Routes
//###########################################################################################################################################


//Start Student AND Teacher Routes
router.get("/studentlogout", function (req, res, next) {
  req.session.destroy();
  res.redirect("/st_login");
});
router.get("/teacherlogout", function (req, res, next) {
  req.session.destroy();
  res.redirect("/st_login");
});

router.get('/st_login', function(req, res, next) {
  res.render('teacher_student_login');
});
router.post("/user_login", loginController.login);
router.post("/studentEditPass",userAuth.requireLogin,loginController.studentEditPass);
router.post("/teacherEditPassword",userAuth.requireLogin,loginController.teacherEditPass);

//END Student AND Teacher Routes

//start student attandance
router.get("/student_att",userAuth.requireLogin,attendanceController.getAll);
router.post("/student_att",userAuth.requireLogin,attendanceController.getAllBySearch);
//end student attandance

//start attendance mark
router.get("/student_att_mark",userAuth.requireLogin,userAuth.requireTeacher,attendanceController.getAttandancePage);
router.post("/student_att_mark",userAuth.requireLogin,attendanceController.getAttandanceStudent);
router.post("/submit_student_att",userAuth.requireLogin,attendanceController.create);
//end attendance mark



// Start Pay Fees
router.get("/pay-fees",userAuth.requireLogin,payFees.getAll);
router.post("/add-payfees",userAuth.requireLogin,upload.fields([{ name: "screenshot", maxCount: 1 }]),payFees.create);
// END Pay Fees

//student time table view
router.get("/student-time-table",userAuth.requireLogin,studentAdmission.studentTimeTableView);
//End student time table view


router.get("/class-student-view",userAuth.requireLogin,attendanceController.getAllClassStudent);

//END Teacher AND Student Routes

module.exports = router;
