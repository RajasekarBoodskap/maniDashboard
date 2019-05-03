var Routes = function (app) {

    this.app = app;
    this.init();

};
module.exports = Routes;


Routes.prototype.init = function () {

    var self = this;

    //Session check each routes
    var sessionCheck = function (req, res, next) {
        var sessionObj = req.cookies['session_obj'];
        if (sessionObj) {
            next();
        } else {
            res.redirect('/login');
        }
    };

    //Role based session check
    var onlyAdmin = function (req, res, next) {
        var sessionObj = req.cookies['session_obj'];
        if (sessionObj) {
            var role = JSON.parse(sessionObj).user.roles;
            req.session.sessionObj = JSON.parse(sessionObj);

            if (role.indexOf('admin') !== -1 || role.indexOf('domainadmin') !== -1) {
                next();
            } else {
                console.log(new Date() + " | unauthorized access");
                res.sendStatus(401)
            }
        } else {
            res.redirect('/login');
        }
    };


    self.app.get('/', sessionCheck, function (req, res) {

        res.redirect('/dashboard');

    });

    self.app.get('/login', function (req, res) {
        var sessionObj = req.cookies['session_obj'];
        if (sessionObj) {
            res.redirect('/dashboard');
        } else {
            res.render('login.html', {layout: false});
        }
    });

    self.app.get('/dashboard', sessionCheck, function (req, res) {
        res.render('dashboard.html', {layout: ''});
    });
    self.app.get('/dashboard1', sessionCheck, function (req, res) {
        res.render('dashboard1.html', {layout: ''});
    });
   

    /******************
     To add new routes
     ===================

     without session check
     =====================
     self.app.get('/<url_path_name>', function (req, res) {
        res.render('<html_name>.html', {layout: ''});
     });

     with session check
     ==================
     self.app.get('/<url_path_name>', sessionCheck, function (req, res) {
        res.render('<html_name>.html', {layout: ''});
     });


     ****************/

   
    self.app.get('/login' , function (req, res) {
        res.render('login.html', {layout: ''});
    });
    self.app.get('/dashboardexample' , function (req, res) {
        res.render('dashboardexample.html', {layout: ''});
    });
    self.app.get('/header' , function (req, res) {
            res.render('layout/header.html', {layout: ''});
    });
    self.app.get('/footer' , function (req, res) {
        res.render('layout/footer.html', {layout: ''});
    });
    self.app.get('/layout' , function (req, res) {
        res.render('layout.html', {layout: ''});
    });
    self.app.get('/users' , function (req, res) {
        res.render('users.html', {layout: ''});
    });
    self.app.get('/examples' , function (req, res) {
        res.render('example.html', {layout: ''});
    });
   
    self.app.get('/leftmenu' , function (req, res) {
        res.render('layout/leftmenu.html', {layout: ''});
    });
    self.app.get('/404', sessionCheck, function (req, res) {
        res.render('404.html', {layout: '', userRole: req.session.role});
    });

    self.app.get('/:key', function (req, res) {
        var sessionObj = req.cookies['session_obj'];
        if (!sessionObj) {
            res.render('login.html', {layout: false});

        } else {
            res.redirect("/404");
        }

    });


};

