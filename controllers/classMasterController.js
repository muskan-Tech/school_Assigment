const classMaster = require("../models/classMasterModel");
const sessionMaster = require("../models/sessionMasterModel");
const teacherMaster = require("../models/activeTeacherModel");

const classesController = {
  // Fetch all classes and render the classMasters view
  getAll(req, res) {
    const user_id = req.session.user_id;
    classMaster.getAll(user_id, (error, data) => {
      if (error) throw error;
      //console.log(data);
      sessionMaster.sessionDropdownByUserId(user_id, (error, sess) => {
        if (error) throw error;
        teacherMaster.TeacherDropdownByUserId(user_id, (error, Tech) => {
          if (error) throw error;
        res.render('classMasters', { data: data, sess: sess, session: req.session ,Tech });
      });
    });
  });
  },
  create(req, res) {
    const { class_name, section, no_of_student, session_id } = req.body;
    const user_id = req.session.user_id;

    const data = {
      user_id,
      class_name,
      section,
      no_of_student,
      session_id,
    };
    classMaster.checkExistClass(user_id, section, class_name, (error, result) => {
      console.log(result);
      if (error) throw error;
      if (result.length > 0) {
        if (result[0].class_name == class_name && result[0].section == section) {
          res.send(`<script>
    alert("This class is already in use");
    window.location.href = '/class';
</script>`);
        }
      }else{
         classMaster.create(data, (error) => {
        if (error) {
          console.log("There is some issue: " + error);
        } else {
          res.send(`<script>
          alert("Add Class Successfully");
          window.location.href = '/class';
        </script>`);
        }
      });
    };
    });
  },
  editclass(req, res) {
    const id = req.query.id;
    classMaster.getById(id, (error, data) => {
      if (error) throw error;
      res.render('classMasters', { data: data, session: req.session });
    });
  },

  // Update class details
  updateclass(req, res) {
    const { id, class_name, section, no_of_student, session_id } = req.body;
    const user_id = req.session.user_id;
    const data = {
      user_id,
      class_name,
      section,
      no_of_student,
      session_id,
    };
    
    classMaster.update(id, data, (error) => {
      if (error) {
        console.log("There is some issue: " + error);
      } else {
        console.log("Classes updated successfully.");
        res.redirect("/class");
      }
    });

  },


  // Delete a class by ID
  deleteclass(req, res) {
    const id = req.query.id;
    console.log(id);
    classMaster.delete(id, (error) => {
      if (error) {
        console.error("Error deleting class:", error);
        res.status(500).send("Failed to delete class.");
      } else {
        res.redirect('/class');
      }
    });
  }
};

module.exports = classesController;
