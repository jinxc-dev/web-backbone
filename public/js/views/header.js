var t_header = require("raw-loader!../../templates/header.html");

var userData = {}

var Header = Backbone.View.extend({

  initialize: function (params) {
    this.template = _.template(t_header)
    this.eventBus = params.eventBus

    if (params.user)
      this.setUserData(params.user)

    var view = this
    params.eventBus.on('localstorage:set:user', function(user) {
      view.setUserData(user)
      view.render()
    })
  },

  events: {
    'click #logout_button' : 'logout',
    'click #searchuser-button': 'searchUser'
  },

  render: function () {
    $('.navbar').removeClass('hidden')
    this.$el.html(this.template({user: userData}))
    return this
  },

  erase : function(){
    this.$el.empty().off();
    this.stopListening();
    return this;
  },

  setUserData: function (user) {
    userData = user
  },

  logout: function() {
    this.eventBus.trigger('view:logout:request')
  },

  searchUser: function() {
    let keyword = $('#search-keyword').val();
    window.location.hash='search-users/' + keyword;
  }

})

module.exports = Header