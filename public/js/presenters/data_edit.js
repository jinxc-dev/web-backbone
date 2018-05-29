var EventBus = require('../eventBus')
var Router = require('./router')
var localStorage = require('../localStorage')

var DataEdit = {}

DataEdit.init = function () {
  EventBus.on('view:update_profile:successful', function (user){
    localStorage.removeItem('user')
    localStorage.setItem('user', user)
    Router.router.navigate('/feed',{trigger:true})
  })


//  EventBus.on('process:profile:save', EventBus.trigger.bind(EventBus, 'profile:save'));

  EventBus.on('process:profile:refresh', function(data, model){
    model.save(data, { patch: true })
      .then(function () {
          alert("Dades d'usuari modificades correctament.")
          EventBus.trigger('view:update_profile:successful', model)
      })
      .catch(function () {
      })
      .done()
  });
}

module.exports = DataEdit
