var EventBus = require('../eventBus')
var localStorage = require('../localStorage')
var CollectionOrder = require("../collections/c_orders")
var ModelUser = require("../models/m_user")
var MainPostFeedCollection = require("../collections/c_post_feed")
var UserLogin = require("../views/user/v_login")
var UserSignup = require("../views/user/v_signup")
var UploadPhoto = require("../views/user/v_upload")
var UploadVideo = require("../views/user/v_uploadVideo")
var UserProfile = require("../views/user/v_profile")
var UserProfileEdit = require("../views/user/v_profile_edit")
var SearchUsers = require("../views/user/v_search_users");
var HeaderView = require("../views/header")
var FooterView = require("../views/footer")
var OrdersView = require("../views/order/vl_orders")
var MainPostFeedCollectionView = require("../views/post/vl_post_feed")
var Router = require('./router')

var Ui = {}

var orderList = new CollectionOrder({eventBus: EventBus})

var $content = $('#content')

var lastHeader = null
var lastFooter = null
var lastContent = null
var lastPopup = null

Ui.switchContent = function (widget) {
  if (lastContent) lastContent.undelegateEvents()
  var args = Array.prototype.slice.call(arguments)
  args.shift()
  switch (widget) {
    case 'login': {
      Router.router.navigate('/login')
      lastContent = new UserLogin({el: $content, eventBus: EventBus}).render()
      Ui.changeHeaderFooterVisibility(false,false)
      break
    }
    case 'profile-edit': {
      if (localStorage.hasItem('user')) {

          $('.navbar').removeClass('hidden')
          var user = localStorage.getItem('user')
          var usrModel = new ModelUser({id: user.id})
          usrModel.fetch({
              success: function (response) {
                lastContent = new UserProfileEdit({el: $content, eventBus: EventBus, model: usrModel}).render()
                Ui.changeHeaderFooterVisibility(true,false)
              },
              error: Ui.error
          });
      }
      else
          Ui.switchContent('login')
      break
    }
    
    
    case 'signup': {
      lastContent = new UserSignup({el: $content, eventBus: EventBus}).render()
      Ui.changeHeaderFooterVisibility(false,false)
      break
    }
    case 'feed': {
      if (localStorage.hasItem('user')) {
        var user = localStorage.getItem('user')
        var mainFeedCollection = new MainPostFeedCollection()
        mainFeedCollection.fetch({
          success: function () {
            lastContent = new MainPostFeedCollectionView({el: $content, eventBus: EventBus, collection: mainFeedCollection,type:'general'}).render()
            Ui.changeHeaderFooterVisibility()
          },
          error: Ui.error
        })
      }
      else
        Ui.switchContent('login')
      break
    }
    case 'personal_profile':{
       if (localStorage.hasItem('user')) {
           var user = localStorage.getItem('user')
           var usrModel = new ModelUser({id: user.id})
           usrModel.fetch({
               success: function () {
                   lastContent = new UserProfile({el: $content, eventBus: EventBus, model: usrModel, user: user}).render()
                   Ui.changeHeaderFooterVisibility()
               },
               error: Ui.error
           });
       }
       else
           Ui.switchContent('login')
       break
     }
    case 'profile':{
      if (localStorage.hasItem('user')) {
        var user = localStorage.getItem('user')
        var usrModel = new ModelUser({id: user.id})
        usrModel.fetch({
          success: function () {
            lastContent = new UserProfile({el: $content, eventBus: EventBus, model: usrModel, user: user}).render()
            Ui.changeHeaderFooterVisibility()
          },
          error: Ui.error
        });
      } else
        Ui.switchContent('login')
      break
    }
    case 'upload': {
      if (localStorage.hasItem('user')) {
        var user = localStorage.getItem('user')
        var usrModel = new ModelUser({id: user.id})
        usrModel.fetch({
            success: function () {
                if (lastPopup) lastPopup.undelegateEvents()
                lastPopup = new UploadPhoto({el: '#popup_content', eventBus: EventBus, model: usrModel, user: user}).render()
            },
            error: Ui.error
        });
      }
      else
        Ui.switchContent('login')
      break
    }
    case 'uploadVideo': {
      if (localStorage.hasItem('user')) {
        var user = localStorage.getItem('user')
        var usrModel = new ModelUser({id: user.id})
        usrModel.fetch({
            success: function () {
                if (lastPopup) lastPopup.undelegateEvents()
                lastPopup = new UploadVideo({el: '#popup_content', eventBus: EventBus, model: usrModel, user: user}).render()
            },
            error: Ui.error
        });
      }
      else
        Ui.switchContent('login')
      break
    }
  }
}

Ui.init = function () {

}

Ui.showProfile = function (id) {
  var user = localStorage.getItem('user')
  if (id === undefined) {
    console.log("jeje funciona")
    id = user.id
  }
  var usrModel = new ModelUser({id: id})
  usrModel.fetch({
    success: function () {
      lastContent = new UserProfile({el: $content, eventBus: EventBus, model: usrModel, user: user}).render()
      if (lastHeader) lastHeader.undelegateEvents()
      lastHeader = new HeaderView({el: '#header', eventBus: EventBus,
        user: user}).render()
      if (lastFooter) lastFooter.undelegateEvents()
      lastFooter = new FooterView({el: '#footer', eventBus: EventBus,
        user: user}).render()
    },
    error: Ui.error
  });
}
Ui.showUserSearchResult = function(keyword) {


  var user = localStorage.getItem('user')

  var id;
  if (id === undefined) {
    id = user.id
  }
  if (keyword === undefined) {
    alert('Please insert search keyword')
    Ui.switchContent('feed')
    return;
  }
  console.log('Searching the something called', keyword)
  
  var usrModel = new ModelUser({id: id})
  usrModel.fetch({
    success: function () {
      lastContent = new SearchUsers({el: $content, eventBus: EventBus, model: usrModel, user: user, keyword: keyword}).render()

      if (lastHeader) lastHeader.undelegateEvents()
      lastHeader = new HeaderView({el: '#header', eventBus: EventBus,
        user: user}).render()
      if (lastFooter) lastFooter.undelegateEvents()
      lastFooter = new FooterView({el: '#footer', eventBus: EventBus,
        user: user}).render()
    },
    error: Ui.error
  });

}

Ui.showHome = function () {
  if (localStorage.hasItem('user')) {
    Router.router.navigate('/feed',{trigger:true})
  } else {
    Router.router.navigate('/login',{trigger:true})
  }
}

Ui.showSignup = function () {
  Ui.switchContent('signup')
}

Ui.changeHeaderFooterVisibility = function(header_visib=true,footer_visib=true){
  var user = localStorage.getItem('user')
  if (lastHeader) lastHeader.undelegateEvents()
  if (lastFooter) lastFooter.undelegateEvents()
  if (header_visib)
    lastHeader = new HeaderView({el: '#header', eventBus: EventBus, user: user}).render()
  else if (lastHeader) lastHeader.erase() 
  if (footer_visib && user)
    lastFooter = new FooterView({el: '#footer', eventBus: EventBus, user: user}).render()
  else if (lastFooter) lastFooter.erase()
}

// This always receive a JSON object with a standard API error
Ui.error = function (err) {
  if (err.message)
    alert("Error: " + err.message)
  else if (err.responseJSON) {
    if (err.responseJSON.message)
      alert("Error: " + err.responseJSON.message)
    else if (err.responseJSON.error)
      alert("Error: " + err.responseJSON.error.message)
  }
}

EventBus.on('ui:showHome', Ui.showHome)
EventBus.on('ui:showError', Ui.error)
EventBus.on('ui:showProfile', Ui.showProfile)
EventBus.on('ui:switch:signup', Ui.showSignup)
// EventBus.on('ui:switch:orders', Ui.switchContent.bind(null, 'orders'))
EventBus.on('ui:showPersonalProfile',Ui.switchContent.bind(null, 'personal_profile'))
EventBus.on('ui:showUpload', Ui.switchContent.bind(null, 'upload'))
EventBus.on('ui:showUploadVideo', Ui.switchContent.bind(null, 'uploadVideo'))
EventBus.on('ui:showProfileEdit',Ui.switchContent.bind(null, 'profile-edit'))
EventBus.on('ui:showLogin',Ui.switchContent.bind(null, 'login'))
EventBus.on('ui:showFeed',Ui.switchContent.bind(null, 'feed'))


EventBus.on('ui:showUserSearchResult', Ui.showUserSearchResult)



module.exports = Ui
