var t_post_feed = require("raw-loader!../../../templates/post/t_post_feed.html")
var t_post_prof_feed = require("raw-loader!../../../templates/post/t_post_prof_feed.html")
var UserModel = require('../../models/m_user')
var EventBus = require('../../eventBus')
var LikeUsers = require('../user/v_likeusers')

//Poso aquest com a Main, perque tinc pensat que el perfil d'usuari també seria un altre "feed" pero nomes amb els Items de l'usuari
var MainPostFeedView = Backbone.View.extend({

  initialize: function(params) {
    this.eventBus = params.eventBus;
    this.template = _.template(params.type == 'profile'?t_post_prof_feed:t_post_feed);
    this.lastPopup = null;

    _.bindAll(this, "render");
    this.model.bind("change", this.render);
    EventBus.trigger('post:likedCheck', this.model);
    EventBus.trigger('post:getLiked', this.model);
  },

  className: 'container',

  render: function () {
    var user_id = this.model.get('user_id')
    var user = new UserModel({id: user_id})
    var that = this
    user.fetch()
      .then(function () {
        that.$el.html(that.template({post: that.model, user: user}));
      })
      .catch(function () {
      })

    return this
  },

  events: {
    "click .like_btn.like": "likeFeature",
    "click .like_btn.liked": "unlikeFeature",
    "click .liked_cnt": "userList",
  },

  likeFeature: function() {
    EventBus.trigger('post:likeAction', this.model);
  },

  unlikeFeature: function() {
    EventBus.trigger('post:unlikeAction', this.model);
  },

  userList: function() {
    if (this.lastPopup) this.lastPopup.undelegateEvents()
      this.lastPopup = new LikeUsers({el: '#popup_content', eventBus: EventBus, post: this.model}).render()
  }

})

module.exports = MainPostFeedView