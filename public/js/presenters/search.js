var localStorage = require('../localStorage')
var EventBus = require('../eventBus')
var Router = require('./router')
var Common = require('./api')
var ModelUser = require('../models/m_user')

var UserSearch = {};

UserSearch.init = function () {
	//. profile following Event
	EventBus.on('search:following', function(keyword, model) {

		var url = "/api/followings";
		
		Common.getAjax(url)
		.then(followData => {
			EventBus.trigger('search:users', keyword, followData, model);
		}).catch(function() {
			alert("ToDo: Handle error on save image12");
			//ToDo: tractar l'error de pujada de l'imatge.
		})
		.done();
	})

	//. search users
	EventBus.on('search:users', function(keyword, followData, model){
		var url = "/api/users?username_like=" + keyword;
		var user = localStorage.getItem('user');
		//var model = new ModelUser({id: user.id});
		
		Common.getAjax(url)
		.then(biosData =>  {

			Common.getAjax("/api/users?bios_like=" + keyword)
			.then(ret => {
				ret = $.extend(biosData, ret);
				const data = ret.map((user1) => {
					var followingCount = 0;
					var followedCount = 0;
					for (var i=0; i<followData.length; i++) {
						if (followData[i].following_id == user1.id) followingCount++;
						if (followData[i].followed_id == user1.id) followedCount++;
					}
					user1.followingCount = followingCount 
					user1.followedCount = followedCount
					return user1;
				})

				console.log(data);
				model.set(	{
					searchedUsers: data
				});

			}).catch(function() {
				alert("ToDo: Handle error on save image13");
				//ToDo: tractar l'error de pujada de l'imatge.
			})
			.done();
		}).catch(function() {
				alert("ToDo: Handle error on save image12");
				//ToDo: tractar l'error de pujada de l'imatge.
		})
		.done();
	});
	
}

module.exports = UserSearch
