const attendance = require("../models/attendanceModel");
const classMaster = require("../models/classMasterModel");
const studentRegistration = require("../models/studentRegistrationModel");
const subjectMaster = require("../models/subjectMasterModel");
const activeTeacher = require("../models/activeTeacherModel");
const student = require("../models/AdmittedstudentModel");

const attendanceController = {
  // Fetch all classes and render the classMasters view
  getAll(req, res) {
    const user_id = req.session.user_id || req.session.user;
    const student_id = req.session.register_id || req.query.id;
    //console.log(student_id);
    studentRegistration.getById(student_id, (error, class_data) => {
      if (error) throw error;
      const class_id = class_data[0].class_id;
      //console.log(class_id,"hello");
      subjectMaster.subjectbyclass(class_id, (error, subject) => {
        if (error) throw error;
        //console.log(subject);
        attendance.getAll(user_id, student_id, (error, data) => {
          if (error) throw error;

          res.render('studentAttendance', { data: data, session: req.session, subject: subject });
        });
      });

    });
  },
  getAllBySearch(req, res) {
    const user_id = req.session.user_id || req.session.user;
    const student_id = req.session.register_id || req.body.student_id;
    const subject_id = req.body.subject_id;
    console.log(student_id, subject_id);
    studentRegistration.getById(student_id, (error, class_data) => {
      if (error) throw error;
      const class_id = class_data[0].class_id;
      // console.log(subject_id,"hello");
      subjectMaster.subjectbyclass(class_id, (error, subject) => {
        if (error) throw error;
        //console.log(subject);
        attendance.getAllBySearch(user_id, student_id, subject_id, (error, data) => {
          if (error) throw error;
          if (data.length > 0) {

            res.render('studentAttendance', { data: data, session: req.session, subject: subject });
          } else {
            res.send(`<script>
              alert("Student Attendance No Found");
              window.location.href = '/student_att';
          </script>`);
          }
        });

      });
    });
  },
  getAttandancePage(req, res) {
    const user_id = req.session.user;
    const teacher_id = req.session.register_id;
    const today = new Date().toISOString().slice(0, 10);
    const student_data = 0;
    const subject_id = 0;
    subjectMaster.subjectbyteacher(teacher_id, (error, subject) => {
      if (error) throw error;
      // console.log(subject);
      attendance.getAll(user_id, teacher_id, (error, data) => {
        if (error) throw error;



        res.render('classAttendance', { data: data, today: today, subject_id: subject_id, student_data: student_data, session: req.session, subject: subject });
      });
    });



  },
  getAttandanceStudent(req, res) {
    const teacher_id = req.session.register_id;
    const class_sub = req.body.class_sub;
    const [class_id, subject_id] = class_sub.split('|');
    //console.log('Class ID:', class_id);
    //console.log('Subject:', subject_id);
    const today = new Date().toISOString().slice(0, 10);
    subjectMaster.subjectbyteacher(teacher_id, (error, subject) => {
      if (error) throw error;
      // console.log(subject);
      studentRegistration.getStudentByClass(class_id, (error, student_data) => {
        if (error) throw error;


        res.render('classAttendance', { session: req.session, subject_id: subject_id, today: today, student_data: student_data, subject: subject });
      });

    });


  },

  // Create a new class and handle the response
  create(req, res) {
    try {
      // Ensure all parameters are arrays or handle single values gracefully
      const teacher_id = Array.isArray(req.body.teacher_id) ? req.body.teacher_id : [req.body.teacher_id];
      const subject_id = Array.isArray(req.body.subject_id) ? req.body.subject_id : [req.body.subject_id];
      const user_id = req.session.user;
      const date = Array.isArray(req.body.date) ? req.body.date : [req.body.date];
      const student_ids = Array.isArray(req.body.student_id) ? req.body.student_id : [req.body.student_id];
      const statuses = Array.isArray(req.body.session) ? req.body.session : [req.body.session];
      const status = Array.isArray(req.body.status) ? req.body.status : [req.body.status];

      // Create data array
      const data = student_ids.map((student_id, index) => ({
        user_id: user_id,
        student_id: student_id, // Ensure student_id is correctly mapped
        teacher_id: teacher_id[index],
        subject_id: subject_id[index],
        date: date[index],
        status: status[index] !== undefined ? status[index] : 0,
        session_id: statuses[index],
      }));

      console.log("Attendance data:", data);

      // Insert data into the database
      attendance.create(data, (error) => {
        if (error) {
          res.send(`<script>
                alert("First select the class");
                window.location.href = '/student_att_mark';
            </script>`);
        } else {
          res.send(`<script>
                    alert("Add Student Attendance Successfully");
                    window.location.href = '/student_att_mark';
                </script>`);
        }
      });
    } catch (error) {
      res.send(`<script>
          alert("First select the class");
          window.location.href = '/student_att_mark';
      </script>`);
    }
  },

  // Fetch class details by ID and render the edit form
  editclass(req, res) {
    const id = req.query.id;
    studentRegistration.getById(id, (error, data) => {
      if (error) throw error;
      res.render('studentRegistration', { data: data, session: req.session });
    });
  },



  getAllTeacherAttendance(req, res) {
    const user_id = req.session.user_id || req.session.user;
    const Teacher_id = req.session.register_id || req.query.id;

    // console.log('ritik' , Teacher_id,user_id)
    activeTeacher.getAllTeacherAttendance(user_id, Teacher_id, (error, data) => {
      if (error) throw error;
      res.render('getTeacherAttendance', { data: data, session: req.session });
    });
  },
  getAllTeacherName(req, res) {
    const user_id = req.session.user_id;
    const today = new Date().toISOString().slice(0, 10);
    //console.log(student_id);
    activeTeacher.getAllTeacherNAme(user_id, (error, data) => {
      if (error) throw error;
      res.render('teacherAttendance', { data: data, today: today, session: req.session });
    });
  },
  teacherAttendanceSubmit(req, res) {
    const user_id = req.session.user_id;
    const teacher_ids = Array.isArray(req.body.teacher_id) ? req.body.teacher_id : [req.body.teacher_id];
    const status = Array.isArray(req.body.status) ? req.body.status : [req.body.status];
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    const create_date = today;
    // console.log(class_id);

    const data = teacher_ids.map((teacher_id, index) => ({
      user_id: user_id,
      teacher_id: teacher_id,
      create_date: create_date,
      status: status[index] !== undefined ? status[index] : 0,
    }));

    activeTeacher.createAttendance(data, (error) => {
      if (error) {
        console.log("There is some issue: " + error);
      } else {
        res.send(`<script>
          alert(" Teacher Attendance Successfully Done");
          window.location.href = '/teacher_att_mark';
        </script>`);
      }
    });
  },

  getAllClassStudent(req, res) {
    const student_id = req.session.register_id;
    const role = req.session.role;
    const Teacher_id = req.session.register_id;

    student.getDetail(student_id, role, (error, data) => {
      if (error) {
        console.error('Error getting student details:', error);
        return res.status(500).send('Internal Server Error');
      }
//console.log('data',data);
      if (data && data.length > 0) {
        const classId = data[0].class_id;
        student.getClassStudentList(classId, (error, data1) => {
          if (error) throw error;
         // console.log('data1',data1);   
              res.render('student-class-list', { data1: data1,  session: req.session });
        });
      } else {
        student.getTeacherStudentList(Teacher_id, role, (error, data2) => {
          if (error) throw error;
          //console.log('class_id', data2[0].class_id);
         // console.log('data2',data2);
          teacher_class_id = data2[0].class_id;
           student.getClassStudentList(teacher_class_id, (error, data1) => {
            if (error) throw error;
           // console.log('data1',data1);
            res.render('student-class-list', { data1: data1, session: req.session });
          });
        });
      }
    });
    
  }






};

module.exports = attendanceController;
