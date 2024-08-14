const feesMaster = require("../models/feesMasterModel");
const sessionMaster = require("../models/sessionMasterModel");
const classMaster = require("../models/classMasterModel");

const feesController = {
  // Fetch all classes and render the classMasters view
  getAll(req, res) {
    const user_id = req.session.user_id;
    feesMaster.getAll(user_id,(error, data) => {
      if (error) throw error;
      //console.log(data);
      sessionMaster.sessionDropdownByUserId(user_id,(error, sess) => {
        if (error) throw error;
        classMaster.classDropdownByUserId(user_id,(error, classess) => {
            if (error) throw error;
      res.render('feesMaster', { data: data,sess:sess,classess:classess, session: req.session });
    });
});
  });
  },
  create(req, res) {
    const { class_id,session_id,fees } = req.body;
    const user_id = req.session.user_id;

    const data = {
      user_id,class_id,session_id,fees
    };
    

    feesMaster.create(data, (error) => {
      if (error) {
        console.log("There is some issue: " + error);
      } else {
        res.send(`<script>
          alert("Add Fees Successfully");
          window.location.href = '/fees';
        </script>`);
      }
    });
  },
  editfees(req, res) {
    const id = req.query.id;
    feesMaster.getById(id, (error, data) => {
      if (error) throw error;
      res.render('feesMaster', { data: data, session: req.session });
    });
  },

  // Update class details
  updatefees(req, res) {
    const { id, class_id,session_id,fees } = req.body;
    const user_id = req.session.user_id;
    const data = {
      user_id,
      class_id,
      fees,
      session_id,
    };
    feesMaster.update(id, data, (error) => {
      if (error) {
        console.log("There is some issue: " + error);
      } else {
        console.log("fees updated successfully.");
        res.redirect("/fees");
      }
    });
},


  // Delete a class by ID
  deletefees(req, res) {
    const id = req.query.id;
    console.log(id);
    feesMaster.delete(id, (error) => {
      if (error) {
        console.error("Error deleting class:", error);
        res.status(500).send("Failed to delete fees.");
      } else {
        res.redirect('/fees');
      }
    });
  }
};

module.exports = feesController;
