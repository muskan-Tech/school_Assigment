const subjectMaster = require("../models/subjectMasterModel");
const classMaster = require("../models/classMasterModel");
const sessionMaster = require("../models/sessionMasterModel");
const teacherMaster = require("../models/activeTeacherModel");

const subjectController = {
  // Fetch all classes and render the classMasters view
  getAll(req, res) {
    const user_id = req.session.user_id;
    subjectMaster.getAll(user_id, (error, data) => {
      if (error) throw error;
      classMaster.classDropdownByUserId(user_id, (error, class_data) => {
        if (error) throw error;
        sessionMaster.sessionDropdownByUserId(user_id, (error, session_data) => {
          if (error) throw error;
          teacherMaster.TeacherDropdownByUserId(user_id, (error, Tech) => {
            if (error) throw error;
            res.render('subjectMasters', { data: data, classess: class_data, Tech: Tech, sess: session_data, session: req.session });
          });
        });
      });
    });
  },

  // Create a new class and handle the response
  create(req, res) {
    const { class_id, teacher_id, session_id } = req.body;
    const user_id = req.session.user_id;
  
    subjectMaster.getByTeacherId(teacher_id, (error, data1) => {
      if (error) {
        console.error("Error fetching teacher data:", error);
        return res.status(500).send('Internal Server Error');
      }
  
      if (data1.length > 0) {
        // Teacher is already assigned
        return res.status(400).send(`
          <script>
            alert("This Teacher is already assigned!");
            window.location.href = '/subject';
          </script>
        `);
      }
  
      // Teacher is not assigned; proceed with creation
      const data = {
        user_id,
        class_id,
       
        teacher_id,
        session_id,
      };
  
      subjectMaster.create(data, (error) => {
        if (error) {
          console.error("Error creating subject:", error);
          return res.status(500).send('Internal Server Error');
        }
  
        // Successfully created subject
        res.send(`
          <script>
            alert("Teacher Assigh successfully");
            window.location.href = '/subject';
          </script>
        `);
      });
    });
  },

  // Fetch class details by ID and render the edit form
  editSubject(req, res) {
    const id = req.query.id;
    subjectMaster.getById(id, (error, data) => {
      if (error) throw error;
      res.render('subjectMasters', { data: data, session: req.session });
    });
  },

  // Update class details
  updateSubject(req, res) {
    const { id, class_id, teacher_id, session_id } = req.body;
    const user_id = req.session.user_id;

    const data = {
      user_id,
      class_id,

      teacher_id,
      session_id,
    };
    //console.log(data);

    subjectMaster.update(id, data, (error) => {
      if (error) {
        console.log("There is some issue: " + error);
      } else {
        console.log("Classes updated successfully.");
        res.redirect("/subject");
      }
    });
  },

  // Delete a class by ID
  deleteSubject(req, res) {
    const id = req.query.id;
    subjectMaster.delete(id, (error) => {
      if (error) {
        console.error("Error deleting class:", error);
        res.status(500).send("Failed to delete class.");
      } else {
        res.redirect('/subject');
      }
    });
  }
};

module.exports = subjectController;
