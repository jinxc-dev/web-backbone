var localStorage = require('../localStorage')
var EventBus = require('../eventBus')
var Router = require('./router')
//var Common = require('./common')
var Common = require('./api')
var ModelUser = require('../models/m_user')

var Like = {};

Like.init = function () {

	//. profile following Event
	EventBus.on('post:likedCheck', function(model) {
		var user = localStorage.getItem('user');
		var url = "/api/likes?post_id=" + model.get("id") + "&user_id=" + user.id;

		Common.getAjax(url)
		.then(ret => {
			var l_status = false;
			if (ret.length > 0) {
				l_status = true;
			}
			model.set({
				liked: l_status
			});
		})
		.catch(function() {
			alert("ToDo: liked check");
		  })
		.done();
	});

	EventBus.on('post:getLiked', function(model) {
		var user = localStorage.getItem('user');
		var url = "/api/likes?post_id=" + model.get("id");

		Common.getAjax(url)
		.then(ret => {
			model.set({
				like_cnt: ret.length
			});
		})
		.catch(function() {
			alert("ToDo: check counting");
		})
		.done();
	});
	
	
	//. profiel follow action Event
	EventBus.on('post:likeAction', function(model){
		var user = localStorage.getItem('user');
		var  req_data = {
			user_id: user.id,
			post_id: model.get("id")
		};
		var url = "/api/likes";

		Common.dataAjax(url, req_data)
		.then(ret => {
			model.set(	{
				like_cnt: model.get("like_cnt") + 1,
				liked: true
			});
		})
		.catch(function() {
			alert("ToDo: Handle error on save image13");
		})
		.done();
	});

	EventBus.on('post:unlikeAction', function(model){
		var user = localStorage.getItem('user');
		var url = "/api/likes?user_id=" + user.id + "&post_id=" + model.get("id");
		Common.getAjax(url)
		.then(ret => {
			if (ret.length > 0) {
				Common.deleteAjax("/api/likes/" + ret[0].id)
				.then(ret => {
					model.set(	{
						like_cnt: model.get("like_cnt") - 1,
						liked: false
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

	EventBus.on('post:likedUser', function(model) {
		var user = localStorage.getItem('user');
		var url = "/api/likes?post_id=" + model.get("id");

		Common.getAjax(url)
		.then(ret => {
			if (ret.length > 0) {
				var url = "/api/users";
				ret.map((fl, idx) => {
					if (idx == 0) url += "?";
					else url += "&";
					url += "id=" + fl.user_id;
				});

				Common.getAjax(url)
				.then(ret => {					
					model.set({
						likedUsers: ret
					});
					$('#popup').modal();
				});
			}
		})
		.catch(function() {
			alert("ToDo: check counting");
		})
		.done();
	});
	//. FollowList Action Event
}

module.exports = Like
