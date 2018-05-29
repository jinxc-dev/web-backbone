var PostModel = require('../models/m_post');

var MainPostFeedCollection = Backbone.Collection.extend({
  model: PostModel,
  url: "/api/posts"
});

module.exports = MainPostFeedCollection;
