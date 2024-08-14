const adminAuth = {
    requireLogin(req, res, next){
        if(req.session.user_id){
            next();
        }else{
            res.send(`<script>
                alert("Invalid Found.");
                window.location.href = '/';
            </script>`);
        }
    },
  
  }
  module.exports = adminAuth;