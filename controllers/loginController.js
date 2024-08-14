const Login = require("../models/loginModel");

const loginController = {

  login(req, res) {
    const { email, password } = req.body;
    if (email && password) {
        Login.login(email, password, (error, data) => {
        if (error) throw error;
        if (data) {
          if (data[0].password == password) {
            // console.log("session",data);
          
            req.session.ts_id = data[0].id;
            req.session.email = data[0].email;
            req.session.role = data[0].role;
            req.session.user = data[0].user_id;
            req.session.register_id = data[0].register_id;
            console.log(req.session.register_id,"hii");
            
            if(req.session.role == 3){
            res.redirect('/student-detail');
          }else{
            res.redirect('/teacher-detail');
          }
          } else {
            res.send("Incorrect Password.");
          }
        } else {
          res.send(`<script>
                        alert("Invalid email or password. Please try again.");
                        window.location.href = '/st_login';
                    </script>`);
        }
      });
    } else {
      res.send(`<script>
      alert("Please ");
      window.location.href = '/user/login';
      </script>`);
      res.end();
    }
  },
  studentEditPass(req, res) {
    const { current_password, password } = req.body;
    const user_id = req.session.user_id ||  req.session.ts_id;
  
    console.log('ritik', password, current_password, user_id);
  
    if (!current_password || !password) {
      return res.send(`<script>
        alert("Both current password and new password are required.");
        window.location.href = '/student-detail';
      </script>`);
    }
  
    Login.check(current_password, user_id, (error, data) => {
      if (error) {
        console.error(error);
        return res.send(`<script>
          alert("An error occurred. Please try again.");
          window.location.href = '/student-detail';
        </script>`);
      }
  
      if (data && data.length > 0) {
        if (data[0].password == current_password) {
          Login.updatePassword(password, user_id, (error) => {
            if (error) {
              console.error(error);
              return res.send(`<script>
                alert("An error occurred while updating the password. Please try again.");
                window.location.href = '/student-detail';
              </script>`);
            }
  
            return res.send(`<script>
              alert("Password updated successfully.");
              window.location.href = '/student-detail';
            </script>`);
          });
        } else {
          return res.send(`<script>
            alert("Incorrect current password.");
            window.location.href = '/student-detail';
          </script>`);
        }
      } else {
        return res.send(`<script>
          alert("Current Password Does not Match. Please try again.");
          window.location.href = '/student-detail';
        </script>`);
      }
    });
  },
  teacherEditPass(req, res) {
    const { current_password, password } = req.body;
    const user_id = req.session.user_id ||  req.session.ts_id;
  
    console.log('ritik', password, current_password, user_id);
  
    if (!current_password || !password) {
      return res.send(`<script>
        alert("Both current password and new password are required.");
        window.location.href = '/teacher-detail';
      </script>`);
    }
  
    Login.check(current_password, user_id, (error, data) => {
      if (error) {
        console.error(error);
        return res.send(`<script>
          alert("An error occurred. Please try again.");
          window.location.href = '/teacher-detail';
        </script>`);
      }
  
      if (data && data.length > 0) {
        if (data[0].password == current_password) {
          Login.updatePassword(password, user_id, (error) => {
            if (error) {
              console.error(error);
              return res.send(`<script>
                alert("An error occurred while updating the password. Please try again.");
                window.location.href = '/teacher-detail';
              </script>`);
            }
  
            return res.send(`<script>
              alert("Password updated successfully.");
              window.location.href = '/teacher-detail';
            </script>`);
          });
        } else {
          return res.send(`<script>
            alert("Incorrect current password.");
            window.location.href = '/teacher-detail';
          </script>`);
        }
      } else {
        return res.send(`<script>
          alert("Current Password Does not Match. Please try again.");
          window.location.href = '/teacher-detail';
        </script>`);
      }
    });
  },

  

};

module.exports = loginController;
