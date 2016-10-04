var PermissionService,
    passport,
    RoleService,
    UserService;

PermissionService = require('../database/services/permission');
RoleService = require('../database/services/role');
UserService = require('../database/services/user');
passport = require('passport');

module.exports = function (router) {

    function validateToken(req) {
        var clientId,
            http,
            JWS,
            nonce,
            rsa,
            state,
            token;

        clientId = 'renxt.blackbaud.com';
        nonce = 'abc123';
        state = 'abc123';
        token = req.body.id_token;
        http = require('request-promise');
        rsa = require('jsrsasign');
        JWS = rsa.jws.JWS;

        if (!token) {
            return Promise.reject(new Error("You are not logged in to Blackbaud.com!"));
        }

        // Validate our token against the requestor.
        return http('https://signin.blackbaud.com/oauth2/certs').then(function (response) {
            var found,
                header,
                isValid,
                keys,
                payload,
                successRedirect;

            response = JSON.parse(response);

            keys = response.keys;
            header = JWS.readSafeJSONString(rsa.b64utoutf8(token.split('.')[0]));
            payload = JWS.readSafeJSONString(rsa.b64utoutf8(token.split('.')[1]));
            successRedirect = 'http://localhost:3000/';

            // Find the published key that was used to sign the JWT.
            keys.forEach(function (key) {
                var publicKey;

                if (found) {
                    return;
                }

                if (key.x5t === header.x5t || key.kid === header.kid) {

                    found = true;
                    publicKey = rsa.KEYUTIL.getKey(key);
                    isValid = JWS.verifyJWT(token, publicKey, {
                        alg: [key.alg],
                        iss: ['https://signin.blackbaud.com/']
                    });

                    if (!isValid) {
                        console.log("JWT validation failed!");
                    }

                    // Confirm nonce.
                    isValid = isValid && (nonce !== null) && (payload.nonce === nonce);

                    if (!isValid) {
                        console.log("Nonce validation failed!");
                    }

                    // Confirm state
                    isValid = isValid && (state !== null) && (req.body.state === state);

                    if (!isValid) {
                        console.log("State validation failed!");
                    }

                    // Confirm aud
                    isValid = isValid && (payload.aud === clientId);
                    if (!isValid) {
                        console.log("Client ID validation failed!");
                    }
                }
            });

            if (found && isValid) {
                return Promise.resolve(payload);
            } else {
                return Promise.reject(new Error("Token invalid."));
            }
        });
    }

    // Add role and permissions to the request.
    router.use(function (req, res, next) {
        req.role = null;
        req.permissions = [];

        if (!req.isAuthenticated()) {
            return next();
        }

        RoleService.getById(req.user._role).then(function (role) {
            if (!role) {
                return next();
            }

            req.role = role.name;

            PermissionService.getByIds(role._permissions).then(function (permissions) {
                req.permissions = permissions.map(function (permission) {
                    return permission.name;
                });
                next();
            }).catch(next);
        }).catch(next);
    });

    // Add a method to the request to check permissions.
    router.use(function (req, res, next) {
        req.isAuthorized = function (permission) {
            var err;
            if (!req.isAuthenticated() || !req.permissions || req.permissions.indexOf(permission) === -1) {
                err = new Error("Not Authorized");
                err.status = 401;
                return err;
            }
            return null;
        };
        next();
    });

    // Validate the token response.
    router.post('/api/oauth/validate', function (req, res, next) {
        validateToken(req).then(function () {
            res.status(200).json({
                status: true
            });
        }).catch(next);
    });

    router.post('/api/register', function (req, res, next) {
        UserService
            .register(req.body.emailAddress, req.body.password, req.body.roleId)
            .then(function (user) {
                passport.authenticate('local')(req, res, function () {
                    return res.status(200).json({
                        status: 'Registration successful!',
                        user: user
                    });
                });
            })
            .catch(next);
    });

    router.post('/api/login', function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(info);
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next('Could not log in user!');
                }
                res.status(200).json({
                    message: 'Login successful!'
                });
            });
        })(req, res, next);
    });

    router.post('/api/login-with-token', function (req, res, next) {
        validateToken(req)
            .then(function (payload) {
                if (!payload.email) {
                    return next(new Error("User not found!"));
                }
                UserService
                    .getByEmailAddress(payload.email)
                    .then(function (user) {
                        req.logIn(user, function (err) {
                            if (err) {
                                return next(new Error('Could not log in user!'));
                            }
                            res.status(200).json({
                                message: 'Login successful!'
                            });
                        });
                    })
                    .catch(next);
            })
            .catch(next);
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
            user: {
                _id: req.user._id,
                emailAddress: req.user.emailAddress,
                permissions: req.permissions,
                role: req.role
            }
        });
    });
};
