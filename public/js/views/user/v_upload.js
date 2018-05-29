var t_upload = require("raw-loader!../../../templates/user/upload.html")
var ImageModel = require("../../models/m_image")
var PostModel = require("../../models/m_post")
var Api = require("../../presenters/api")


var UploadPhoto = Backbone.View.extend({

    initialize: function (params) {
        this.eventBus = params.eventBus
        this.user = params.user
    },

    template: _.template(t_upload),

    className: 'container',

    events: {
        'click #upload_button': 'upload',
        'change #selected_photo': 'preview',
        'keydown input': 'enter'
    },


    upload: function () {

        var formImg = $('#selected_photo')[0].files[0]
        var fromDescription = this.$('#upload_description').val()
        var data = new FormData()
        var that = this
        data.append('file', formImg)

        Api.upload(data)
            .then(function (ret) {
                var parsed_ret = JSON.parse(ret)[0]
                var data = {
                    picture: parsed_ret,
                    description: fromDescription,
                    user_id: that.user.id
                }
                var post = new PostModel()
                post.save(data)
                    .then(function (ret) {
                        that.eventBus.trigger('view:upload:successful')
                    })
                    .catch(function (ret) {
                        alert("ToDo: Handle error on save post")
                        //Todo: Handle error save
                    })
                    .done()
            })
            .catch(function (ret) {
                alert("ToDo: Handle error on save image")
                //ToDo: tractar l'error de pujada de l'imatge.
            })
            .done()
    },

    preview: function () {
        var formImg = $('#selected_photo')[0].files[0],
            preview = $('#photo_preview')[0]
        noselected = $('#preview_placeholder')
        if (formImg) {
            var reader = new FileReader();
            reader.onloadend = function () {
                noselected.addClass('hidden');
                preview.src = reader.result;
            }
            reader.readAsDataURL(formImg);
        } else {
            noselected.removeClass('hidden');
            preview.src = "";
        }
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
    }

})

module.exports = UploadPhoto
