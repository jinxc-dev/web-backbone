var EventBus = require('../eventBus')
var localStorage = require('../localStorage')

var Router = {}

Router.init = function () {
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      '': 'home',
      'signup': 'signup',
      'login': 'showLogin',
      'orders': 'showOrders',
      'profile/:id': 'showProfile',
      'profile': 'showPersonalProfile',
      'profile-edit': 'showProfileEdit',
      'feed': 'showFeed',
      'search-users/:keyword': 'showUserSearchResult',

      // Default
      '*actions': 'defaultAction'
    },

    home: function () {
      EventBus.trigger('ui:showHome')
    },

    signup: function () {
      EventBus.trigger('ui:switch:signup')
    },

    showOrders: function () {
      EventBus.trigger('ui:switch:orders')
    },

    showFeed: function () {
      EventBus.trigger('ui:showFeed')
    },

    showProfile: function (id) {
      EventBus.trigger('ui:showProfile', id)
    },

    showPersonalProfile: function() {
      EventBus.trigger('ui:showPersonalProfile')
    },

	  showProfileEdit: function() {
      EventBus.trigger('ui:showProfileEdit')
    },
    showLogin: function () {
        EventBus.trigger('ui:showLogin')
    },
    showUserSearchResult: function(keyword) {
      EventBus.trigger('ui:showUserSearchResult', keyword);
    }
  })

  Router.router = new AppRouter()

  Backbone.history.start()
}

module.exports = Router
