const sessionMaster = require("../models/sessionMasterModel");

const sessionController = {
  // Fetch all classes and render the classMasters view
  getAll(req, res) {
    const user_id = req.session.user_id;
    sessionMaster.getAll(user_id,(error, data) => {
      if (error) throw error;
      res.render('sessionMasters', { data: data, session: req.session });
    });
  },

  // Create a new class and handle the response
  create(req, res) {
    const { session_name } = req.body;
    const user_id = req.session.user_id;
    console.log(session_name);

    const data = {
      session_name,
      user_id,
    };
    sessionMaster.checkExistSession(user_id, session_name, (error, result) => {
      console.log(result);
      if (error) throw error;
      if (result.length > 0) {
        if (result[0].session_name == session_name) {
          res.send(`<script>
    alert("This Session is already in use");
    window.location.href = '/session';
</script>`);
        }
      }else{

    sessionMaster.create(data, (error) => {
      if (error) {
        console.log("There is some issue: " + error);
      } else {
        res.send(`<script>
          alert("Add Session Successfully");
          window.location.href = '/session';
        </script>`);
      }
    });
      }
  });
  },

  // Fetch class details by ID and render the edit form
  editSession(req, res) {
    const id = req.query.id;
    sessionMaster.getById(id, (error, data) => {
      if (error) throw error;
      res.render('sessionMasters', { data: data, session: req.session });
    });
  },

  // Update class details
  updateSession(req, res) {
    const { id, session_name } = req.body;
    const user_id = req.session.user_id;

    const data = {
      user_id,
      session_name,
    };
   
    sessionMaster.update(id, data, (error) => {
      if (error) {
        console.log("There is some issue: " + error);
      } else {
        console.log("Session updated successfully.");
        res.redirect("/session");
      }
    });
  },

  // Delete a class by ID
  deleteSession(req, res) {
    const id = req.query.id;
    sessionMaster.delete(id, (error) => {
      if (error) {
        console.error("Error deleting class:", error);
        res.status(500).send("Failed to delete Session.");
      } else {
        res.redirect('/session');
      }
    });
  }
};

module.exports = sessionController;
