var localStorage = require('../localStorage')
var EventBus = require('../eventBus')
var Router = require('./router')
//var Common = require('./common')
var Common = require('./api')
var ModelUser = require('../models/m_user')

var Profile = {};

Profile.init = function () {
	//. profile sav Event


	EventBus.on('profile:save', function (data, model) {
		var user = localStorage.getItem('user');
		
		Common.uploadImage(data)		
		.then(function (user) {
			data.profile_image = JSON.parse(user)[0]
			EventBus.trigger('process:profile:refresh', data, model);
		})
		.catch(function() {
				alert("ToDo: Handle error on save follow action");
				//ToDo: tractar l'error de pujada de l'imatge.
		})
		.done()
	})

	//. profile following Event
	EventBus.on('profile:following', function(model) {
		var user = localStorage.getItem('user');
		var url = "/api/followings?following_id=" + model.get("id");

		Common.getAjax(url)
		.then(ret => {
			console.log("following information", ret);
			model.set({
				followingCount: ret.length
			});
		})
		.catch(function() {
			alert("ToDo: following");
			//ToDo: tractar l'error de pujada de l'imatge.
		  })
		.done();
	})

	EventBus.on('profile:followed', function(model) {
		var user = localStorage.getItem('user');
		var url = "/api/followings?followed_id=" + model.get('id');

		Common.getAjax(url)
		.then(ret => {
			console.log(ret);
			var followed = false;
			ret.map(data => {
				console.log("=====", data.following_id, user.id);
				if (data.followed_id == model.get("id")) 
					followed = true;
				return data;
			});	
			model.set( {
				followerCount: ret.length,
				followed: followed
			});
		})
		.catch(function() {
			alert("ToDo: Test");
			//ToDo: tractar l'error de pujada de l'imatge.
		  })
		.done();
	})
	
	//. profiel follow action Event
	EventBus.on('profile:followAction', function(model){
		var user = localStorage.getItem('user');
		var  req_data = {
			following_id: user.id,
			followed_id: model.get("id")
		};
		var url = "/api/followings";

		Common.dataAjax(url, req_data)
		.then(ret => {
			model.set(	{
				followerCount: model.get("followerCount") + 1,
				followed: true
			});
		})
		.catch(function() {
				alert("ToDo: Handle error on save image13");
				//ToDo: tractar l'error de pujada de l'imatge.
			})
		.done();
	});

	EventBus.on('profile:unfollowAction', function(model){
		var user = localStorage.getItem('user');
		var url = "/api/followings?following_id=" + user.id + "&followed_id=" + model.get("id");
		Common.getAjax(url)
		.then(ret => {
			if (ret.length > 0) {
				Common.deleteAjax("/api/followings/" + ret[0].id)
				.then(ret => {
					model.set(	{
						followerCount: model.get("followerCount") - 1,
						followed: false
					});
				});
			}
		})
		.catch(function() {
				alert("ToDo: Handle error on save image13");
				//ToDo: tractar l'error de pujada de l'imatge.
			})
		.done();
	});
	//. FollowList Action Event
	EventBus.on('profile:followListAction', function(model, data){
		var user = localStorage.getItem('user');
		var url = "/api/followings?" + data.id_name + "=" + model.get("id");

		Common.getAjax(url)
		.then(function(ret) {
			if (ret.length > 0) {
				var url = "/api/users";
				ret.map((fl, idx) => {
					if (idx == 0) url += "?";
					else url += "&";
					url += "id=" + fl[data.f_id_name];
				});

				Common.getAjax(url)
				.then(ret => {
					var w_list ={};
					w_list[data.list_name] = ret;
					model.set(w_list);
					$(data.modal_id).modal('show')
				});
			}
		})
		.catch(function() {
			alert("ToDo: Handle error on save image");
			//ToDo: tractar l'error de pujada de l'imatge.
		})
		.done();
	})


	// error handle
	EventBus.on('error:alert', function(str_alert){
		alert(str_alert);
	});

}

module.exports = Profile
