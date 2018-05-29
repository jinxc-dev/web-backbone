var t_profile = require("raw-loader!../../../templates/user/search_users.html");
var MainPostFeedCollection = require("../../collections/c_post_feed");
var MainPostFeedCollectionView = require("../post/vl_post_feed");
// S'ha mogut el JS (consultes a BD i demes) a presenters/event/search per tal de fer servir correctament eventbus
var UserSearchResult = Backbone.View.extend({
	initialize: function(params) {
		this.eventBus = params.eventBus;
		this.template = _.template(t_profile);
		this.model = params.model;
		this.me = params.user;
		this.keyword = params.keyword; 

		_.bindAll(this, "render");
		this.model.bind("change", this.render);

		var self = this;
		this.eventBus.trigger('search:following', this.keyword, this.model); 
	},
	events: {	
	},

	className: "container",

	render: function() {
		this.$el.html(
			this.template({
				user: this.model,
				me: this.me
			})
		);
		var $feedContainer = this.$el.find("#user_feed");
		var mainFeedCollection = new MainPostFeedCollection();
		mainFeedCollection
		.fetch({
			data: {	user_id: this.model.id }
		}).then(function() {
			new MainPostFeedCollectionView({
				el: $feedContainer,
				eventBus: this.eventBus,
				collection: mainFeedCollection,
				type: "profile"
			}).render();
		}).catch(function() {
			console.log("Error");
		}).done();
		return this;
	},

});

module.exports = UserSearchResult;
