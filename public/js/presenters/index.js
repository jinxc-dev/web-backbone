var localStorage = require('../localStorage')


var Presenters = {}

var Ui = require('./ui')
var Router = require('./router')
var Login = require('./login')
var Api = require('./api')
var Uploader = require('./upload')
var DataEdit = require('./data_edit')
var Profile = require('./profile')
var UserSearch = require('./search')
var Like = require('./like')

Presenters.init = function() {
  Router.init()
  Ui.init()
  Login.init()
  Api.init()
  Uploader.init()
  DataEdit.init()
  Profile.init()
  UserSearch.init()
  Like.init()
  Api.checkActiveSession()
    .then(function(user) {
      localStorage.setItem('user', user)
    })
    .catch(function() {
      localStorage.removeItem('user')
  })
    .done()
}

module.exports = Presenters