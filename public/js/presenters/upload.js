var EventBus = require('../eventBus')
var Router = require('./router')

var Upload = {}

Upload.init = function () {
  EventBus.on('view:upload', EventBus.trigger.bind(EventBus,'ui:showUpload'));
  EventBus.on('view:upload:successful', function(){
    if (Backbone.history.getFragment() === "profile"){
      Backbone.history.loadUrl(Backbone.history.getFragment());
    }
    else{
      Router.router.navigate('/profile',{trigger:true})
    }
  })

  EventBus.on('view:uploadVideo', EventBus.trigger.bind(EventBus,'ui:showUploadVideo'));
  EventBus.on('view:uploadVideo:successful', function(){
    if (Backbone.history.getFragment() === "profile"){
      Backbone.history.loadUrl(Backbone.history.getFragment());
    }
    else{
      Router.router.navigate('/profile',{trigger:true})
    }
  })
}

module.exports = Upload
