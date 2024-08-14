const classMaster = require("../models/classMasterModel");
const sessionMaster = require("../models/sessionMasterModel");
const payFees = require("../models/payFeesModel");
const studentRegistration = require("../models/studentRegistrationModel");

const feesController = {
  // Fetch all classes and render the classMasters view
  getAll(req, res) {
    const user_id = req.session.user || req.session.user_id ;
    const id = req.session.register_id || req.query.id;
    payFees.getAll(user_id,id,(error, data) => {
        if (error) throw error;
        studentRegistration.getById(id, (error, class_data) => {
            if (error) throw error;
      //console.log(data);
      sessionMaster.sessionDropdownByUserId(user_id,(error, sess) => {
        if (error) throw error;
      res.render('pay-fees', { data: data,sess:sess,class_data:class_data, session: req.session });
    });
});
});
  },
  getAllPendingFees(req, res) {
    const user_id = req.session.user_id ;
    payFees.getAllPendingFees(user_id,(error, data) => {
        if (error) throw error;
        payFees.getAllSuccessRejectFees(user_id,(error, data2) => {
          if (error) throw error;
      res.render('get-fees', { data: data,data2: data2, session: req.session });
    });
  });
  },

  submitFees(req, res) {
    const id = req.query.id;
    const user_id = req.session.user_id;
    const status = 1;

    payFees.updateStatus(id, status,user_id, (error) => {
      if (error) {
        console.log("There is some issue: " + error);
      } else {
        console.log("Fees Submitted successfully.");
        res.redirect("/student-fees");
      }
    });
  },
  rejectFees(req, res) {
    const id = req.query.id;
    const user_id = req.session.user_id;
    const status = 2;

    payFees.updateStatus(id, status,user_id, (error) => {
      if (error) {
        console.log("There is some issue: " + error);
      } else {
        console.log("Fees Submitted successfully.");
        res.redirect("/student-fees");
      }
    });
  },

  create(req, res) {
    const screenshot = req.files.screenshot ? req.files.screenshot[0].filename : '';
    const {class_id,amount,date,session_id,type,transaction_id,bank_name } = req.body;
    const user_id = req.session.user;
    const student_id = req.session.register_id;
    const status = 0;
    const data = {
        user_id, student_id,class_id,amount,date,session_id,type,transaction_id,bank_name,screenshot , status
    };
    //console.log('ritik',data);

    payFees.create(data, (error) => {
      if (error) {
        console.log("There is some issue: " + error);
      } else {
        res.send(`<script>
          alert("Add Fees Successfully");
          window.location.href = '/pay-fees';
        </script>`);
      }
    });
  },
  
};

module.exports = feesController;
