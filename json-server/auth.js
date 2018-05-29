const validate = require('jsonschema').validate
const util = require('../util')

var userSchemaLogin = {
    properties: {
        username: {
            type: 'string',
            required: true
        },
        password: {
            type: 'string',
            required: true
        }
    }
}

var userSchemaRegister = {
    properties: {
        username: {
            type: 'string',
            required: true,
            minLength: 6
        },
        password: {
            type: 'string',
            required: true,
            minLength: 6
        },
        email: {
            type: 'string',
            required: true,
            minLength: 6
        },
        first_name: {
            type: 'string',
            required: true,
            minLength: 6
        },
        last_name: {
            type: 'string',
            required: true,
            minLength: 6
        }
    }
}


module.exports = function (server, router) {

    function addAuthorization(server, entity) {

        function authMiddleware_GET_PUT_DELETE(req, res, next) {
            var obj = router.db.get(entity).find(['id', parseInt(req.params.id)]).value()
                if (!obj)
                    util.sendError(res, 400, util.Error.ERR_BAD_REQUEST, 'Object does not exists')
                else if (obj.userId !== req.session.userId)
                    util.sendError(res, 400, util.Error.ERR_BAD_REQUEST, 'You don\'t have permissions to acces this object')
                else
                    next()
        }

        function authMiddleware_POST(req, res, next) {
            req.body.userId = req.session.userId.toString()
                next()
        }

        function authMiddleware_GET_Collection(req, res, next) {
            req.body.userId = req.session.userId.toString()
            next()
        }

        server.get('/' + entity + '/:id', util.isAuthenticated, authMiddleware_GET_PUT_DELETE);
        server.put('/' + entity + '/:id', util.isAuthenticated, authMiddleware_GET_PUT_DELETE);
        server.delete('/' + entity + '/:id', util.isAuthenticated, authMiddleware_GET_PUT_DELETE);
        server.post('/' + entity, util.isAuthenticated, authMiddleware_POST)
        server.get('/' + entity, util.isAuthenticated, authMiddleware_GET_Collection)
    }

    // Call this function for each entity that has ownership wrt users
    addAuthorization(server, 'orders')

    server.post('/users/login', util.isNotAuthenticated, function (req, res) {
        var v = validate(req.body, userSchemaLogin)

        if (!v.valid)
            util.sendError(res, 400, util.Error.ERR_BAD_REQUEST, util.jsonSchemaError(v))
        else {
            var user = router.db.get('users').find(['username', req.body.username]).value()
            if (user) {
                if (user.id === req.session.userId)
                    util.sendError(res, 400, util.Error.ERR_BAD_REQUEST, 'User already authenticated')
                else if (user.password === req.body.password) {
                    req.session.userId = user.id
                    req.session.username = user.username
                    util.jsonResponse(res, user)
                } else
                    util.sendError(res, 400, util.Error.ERR_BAD_REQUEST, 'Password do not match')
            } else
                util.sendError(res, 401, util.Error.ERR_BAD_REQUEST, 'User does not exist')
        }
    })

    server.post('/users/logout', util.isAuthenticated, function (req, res) {
        delete req.session['userId']
        delete req.session['username']
        util.jsonResponse(res, 'User logged out successfully')
    })

    server.post('/users', util.isNotAuthenticated, function (req, res) {
        var v = validate(req.body, userSchemaRegister)
        if (!v.valid)
            util.sendError(res, 400, util.Error.ERR_BAD_REQUEST, util.jsonSchemaError(v))
        else{
            router.db
                .get('users')
                .insert({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    date_created: req.body.date_created,
                    date_updated: req.body.date_updated
                })
                .write()
            util.jsonResponse(res, 'User created successfully')
        }
    })

    server.get('/users/self', util.isAuthenticated, function (req, res) {
        var user = router.db.get('users').find(['id', req.session.userId]).value()
        util.jsonResponse(res, user)
    })


}
