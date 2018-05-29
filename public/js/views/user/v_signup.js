var t_signup = require("raw-loader!../../../templates/user/signup.html")


var UserSignup = Backbone.View.extend({

  className: 'container',

  template: _.template(t_signup),

  initialize: function(params) {
	this.eventBus = params.eventBus;
  },

  events: {
	'click #btn-signup': 'submit'
  },

  submit: function () {
	var data = {
	  username: this.$('[name=username]').val(),
	  email: this.$('[name=email]').val(),
	  password: this.$('[name=password]').val(),
	  first_name: this.$('[name=first_name]').val(),
	  last_name: this.$('[name=last_name]').val(),
	  date_created: Date(),
	  date_updated: Date()
	}
	this.eventBus.trigger('view:signup:request', data)
  },

  render: function () {
	this.$el.html(this.template())
	return this
  }
})

module.exports = UserSignup