var t_profile = require("raw-loader!../../../templates/user/profile.html");
var MainPostFeedCollection = require("../../collections/c_post_feed");
var MainPostFeedCollectionView = require("../post/vl_post_feed");

var UserProfile = Backbone.View.extend({
	initialize: function(params) {
		this.eventBus = params.eventBus;
		this.template = _.template(t_profile);
		this.model = params.model;
		this.me = params.user;

		_.bindAll(this, "render");
		this.model.bind("change", this.render);

		this.eventBus.trigger('profile:following', this.model);
		this.eventBus.trigger('profile:followed', this.model);
	},
	events: {
		"click #follow_button": "followAction",
		"click #unfollow_button": "unfollowAction",
		"click #user_followers": "followerListAction",
		"click #user_following": "followingListAction"
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
			data: {
			user_id: this.model.id
			}
		})
		.then(function() {
			new MainPostFeedCollectionView({
			el: $feedContainer,
			eventBus: this.eventBus,
			collection: mainFeedCollection,
			type: "profile"
			}).render();
		})
		.catch(function() {
			console.log("Error");
		})
		.done();
		return this;
	},

	followAction: function() {
		this.eventBus.trigger('profile:followAction', this.model);
	},

	unfollowAction: function() {
		this.eventBus.trigger('profile:unfollowAction', this.model);
	},

	followerListAction: function() {
		this.eventBus.trigger('profile:followListAction', this.model, {
			id_name : 'followed_id',
			f_id_name: 'following_id',
			list_name: 'followerList',
			modal_id : '#followerListModal'
		});
	},

	followingListAction: function() {
		this.eventBus.trigger('profile:followListAction', this.model, {
			id_name : 'following_id',
			f_id_name: 'followed_id',
			list_name: 'followedList',
			modal_id : '#followingModal'
		});
	}
});

module.exports = UserProfile;
