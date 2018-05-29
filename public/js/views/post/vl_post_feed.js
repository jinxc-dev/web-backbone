var tl_post_feed = require("raw-loader!../../../templates/post/tl_post_feed.html")
var MainPostFeedView = require('./v_post_feed')
var LikeListDlg = require("raw-loader!../../../templates/post/t_like_list.html")

var MainPostFeedCollectionView = Backbone.View.extend({

  initialize: function(params) {
    this.eventBus = params.eventBus
    this.type = params.type
    this.template = _.template(tl_post_feed)
  },

  className: 'container',

  render: function () {
    this.$el.html(this.template({posts: this.collection}))
    var $feedContainer = this.$el.find('.list-group')
    var type = this.type;
    var that = this;
    this.collection.each(function(post) {
      $feedContainer.append(new MainPostFeedView({model: post,type:type}).render().el)
    });

    return this
  }

});

module.exports = MainPostFeedCollectionView
