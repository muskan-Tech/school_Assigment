const userAuth = {
  requireLogin(req, res, next){
      if(req.session.user_id || req.session.ts_id){
          next();
      }else{
          res.redirect('/login');
      }
  },
  requireTeacher(req, res, next){
    if(req.session.role == 2 || req.session.user_id){
        next();
    }else{
        res.send(`<script>
            alert("Invalid Found.");
            window.location.href = '/';
        </script>`);
    }
},

}
module.exports = userAuth;