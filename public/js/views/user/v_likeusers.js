var t_list = require("raw-loader!../../../templates/post/t_like_list.html")
var Api = require("../../presenters/api")


var LikeUsers = Backbone.View.extend({

    initialize: function (params) {
        this.eventBus = params.eventBus;
        this.post = params.post;
        _.bindAll(this, "render");
        this.post.bind("change", this.render);
        this.eventBus.trigger('post:likedUser', this.post)
    },

    template: _.template(t_list),

    className: 'container',

    render: function () {
        var that = this;
       // $('#popup').modal()
        this.$el.html(this.template({post: that.post}))
        return this
    },

    events: {
    "click .profile_href": "closeModal",
  },

  closeModal: function() {
    $('#popup').modal('hide');
  }

})

module.exports = LikeUsers
