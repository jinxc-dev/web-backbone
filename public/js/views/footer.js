var t_header = require("raw-loader!../../templates/footer.html");

var Footer = Backbone.View.extend({

  initialize: function (params) {
    this.template = _.template(t_header)
    this.eventBus = params.eventBus
  },

  events: {
    'click #camera_button' : 'upload',
    'mouseenter #camera_button' : 'openfocus',
    'mouseleave #camera_button' : 'closefocus',


    'click #video_button' : 'uploadVideo',
    'mouseenter #video_button' : 'openfocusVideo',
    'mouseleave #video_button' : 'closefocusVideo'
  },

  render: function () {
    $('#footer').removeClass('hidden')
    this.$el.html(this.template())
    return this
  },

  upload: function(){
    this.eventBus.trigger('view:upload')
  },
  uploadVideo: function() {
    this.eventBus.trigger('view:uploadVideo')
  },

  erase : function(){
    this.$el.empty().off();
    this.stopListening();
    return this;
  },

  openfocus : function(){
    document.querySelectorAll('.footer1 .small-focus, .footer1 .big-focus').forEach((e)=>{ e.classList.remove('hided'); });
  },

  closefocus : function(){
    document.querySelectorAll('.footer1 .small-focus, .footer1 .big-focus').forEach((e)=>{ e.classList.add('hided'); });
  },

  openfocusVideo : function(){
    document.querySelectorAll('.footer2 .small-focus, .footer2 .big-focus').forEach((e)=>{ e.classList.remove('hided'); });
  },

  closefocusVideo : function(){
    document.querySelectorAll('.footer2 .small-focus, .footer2 .big-focus').forEach((e)=>{ e.classList.add('hided'); });
  }
})

module.exports = Footer