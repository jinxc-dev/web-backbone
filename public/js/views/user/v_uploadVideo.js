var t_upload = require("raw-loader!../../../templates/user/upload_video.html")
var PostModel = require("../../models/m_post")
var Api = require('../../presenters/api')

var UploadVideo = Backbone.View.extend({

    initialize: function (params) {
        this.eventBus = params.eventBus
        this.user = params.user
    },

    template: _.template(t_upload),

    className: 'container',

    events: {
        'click #upload_button': 'upload',
        'change #selected_video': 'preview',
        'keydown input': 'enter'
    },

    upload: function () {

        var formImg = $('#selected_video')[0].files[0] //camp per pujar video, ens quedem amb l'arxiu
        var fromDescription = this.$('#upload_description').val() //descripcio
        var data = new FormData()
        var that = this
        data.append('file', formImg)

        Api.upload(data, '/api/videos')
            .then(function (ret) {
                var parsed_ret = JSON.parse(ret)[0]
                var data = {
                    picture: parsed_ret,
                    description: fromDescription,
                    user_id: that.user.id,
                    type: 'video'
                }
                var post = new PostModel()
                post.save(data)
                    .then(function (ret) { // 
                        that.eventBus.trigger('view:upload:successful')
                    })
                    .catch(function (ret) { //video no guardat
                        alert("ToDo: Handle error on save post")
                    })
                    .done()
            }) //extret de pujar imatge
            .catch(function (ret) {
                alert("ToDo: Handle error on save video")
                //ToDo: tractar l'error de pujada de video.
            })
            .done()
    },

    render: function () {
        $('#popup').modal()
        this.$el.html(this.template())
        return this
    },

    enter: function (e) {
        var code = e.keyCode || e.which;
        if (code === 13) {
            this.upload()
        }
    },

})

module.exports = UploadVideo