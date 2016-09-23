var express,
    passport,
    router,
    Permission,
    Role,
    User;

express = require('express');
passport = require('passport');
User = require('../database/models/user');
Permission = require('../database/models/permission');
Role = require('../database/models/role');
router = express.Router();

router.get('/', function (req, res) {
  res.render('index', {
    title: 'MEAN Users',
    user: req.user
  });
});

router.post('/api/register', function (req, res) {
  User.register(new User({
    emailAddress: req.body.emailAddress
  }), req.body.password, function (err, user) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!',
        user: user
      });
    });
  });
});

router.post('/api/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user!'
        });
      }
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
});

router.get('/api/logout', function (req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/api/user-status', function (req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false,
      user: null
    });
  }
  res.status(200).json({
    status: true,
    user: req.user
  });
});

router.route('/api/permissions')
  .get(function (req, res) {
    Permission.find({}).exec().then(function (data) {
      res.json({
        value: data
      });
    });
  })
  .post(function (req, res) {
    var permission;
    permission = new Permission(req.body);
    permission.save().then(function () {
      res.json(permission);
    });
  });
router.route('/api/permissions/:id')
  .delete(function (req, res) {
    Permission.findOneAndRemove({
      _id: req.params.id
    }).exec().then(function () {
      res.json({});
    });
  })
  .get(function (req, res) {
    Permission.findOne({
      _id: req.params.id
    }).exec().then(function (data) {
      res.json(data);
    });
  })
  .put(function (req, res) {
    Permission.findOne({
      _id: req.params.id
    }).exec().then(function (data) {
      var k;
      for (k in req.body) {
        if (req.body.hasOwnProperty(k)) {
          data[k] = req.body[k];
        }
      }
      data.save().then(function () {
        res.json(data);
      });
    });
  });

router.route('/api/roles')
  .get(function (req, res) {
    Role.find({}).exec().then(function (data) {
      console.log(data);
      res.json({
        value: data
      });
    });
  })
  .post(function (req, res) {
    var role;

    role = new Role(req.body);
    role.save().then(function () {
      res.json(role);
    });
  });
router.route('/api/roles/:id')
  .delete(function (req, res) {
    Role.findOneAndRemove({
      _id: req.params.id
    }).exec().then(function () {
      res.json({});
    });
  })
  .get(function (req, res) {
    Role.findOne({
      _id: req.params.id
    }).exec().then(function (data) {
      res.json(data);
    });
  })
  .put(function (req, res) {
    Role.findOne({
      _id: req.params.id
    }).exec().then(function (data) {
      var k;
      for (k in req.body) {
        if (req.body.hasOwnProperty(k)) {
          data[k] = req.body[k];
        }
      }
      data.save().then(function () {
        res.json(data);
      });
    });
  });

router.route('/api/users')
    .get(function (req, res) {
        User.find({}).exec().then(function (data) {
            res.json({
                value: data
            });
        });
    })
    .post(function (req, res) {
        var permission;
        permission = new Permission(req.body);
        permission.save().then(function () {
            res.json(permission);
        });
    });
router.route('/api/users/:id')
    .delete(function (req, res) {
        User.findOneAndRemove({
            _id: req.params.id
        }).exec().then(function () {
            res.json({});
        });
    })
    .get(function (req, res) {
        User.findOne({
            _id: req.params.id
        }).exec().then(function (data) {
            res.json(data);
        });
    })
    .put(function (req, res) {
        User.findOne({
            _id: req.params.id
        }).exec().then(function (data) {
            var k;
            for (k in req.body) {
                if (req.body.hasOwnProperty(k)) {
                    data[k] = req.body[k];
                }
            }
            data.save().then(function () {
                res.json(data);
            });
        });
    });

module.exports = router;
