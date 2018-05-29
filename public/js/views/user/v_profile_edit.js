//var t_profile = require("raw-loader!../../../templates/user/profile.html")
var t_profile = require("raw-loader!../../../templates/user/profile_edit.html")
var UserModel = require('../../models/m_user')

var UserProfile = Backbone.View.extend({

    initialize: function (params) {
        this.eventBus = params.eventBus;
        this.template = _.template(t_profile);
        this.model = params.model;
    },

    className: 'container',

    events: {
        'click #save-changes': 'saveChanges',
        'change #select_profile_photo': 'preview'
    },

    preview: function () {
        var formImg = $('#select_profile_photo')[0].files[0],
            preview = $('#user_profile_pic_preview>img')[0]
        if (formImg) {
            var reader = new FileReader();
            reader.onloadend = function () {
                preview.src = reader.result;
            }
            reader.readAsDataURL(formImg);
        }
    },

    formTester: function () {
        var valid = true, aux = '', that = this;
        
        //Basic fields testing
        var testing = {
            'ch_first_name':{ test: /\w+/g },
            'ch_last_name':{ test: /\w+/g },
            'ch_username':{ test: /\w+/g },
            'ch_email':{ 
                test: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g 
            }
        };
        Object.keys(testing).forEach(function(key){
            aux = that.$(`#${key}`)
            if (aux.val().match(testing[key].test)){
                aux.parent().removeClass('has-error')
                aux.parent().addClass('has-success')
                that.$(`#${key}_msg`).addClass('invisible')
            }
            else {
                valid = false;
                aux.parent().removeClass('has-success')
                aux.parent().addClass('has-error')
                that.$(`#${key}_msg`).removeClass('invisible')
            }
        });

        //Password fields testing
        var password1 = this.$('#ch_password').val()
            password2 = this.$('#ch_password2').val(),
            containers = this.$('.passwd-container'),
            messages = this.$('.passwd-container .help-block')

        if (password1 === password2){
            containers.addClass('has-success')
            containers.removeClass('has-error')
            messages.addClass('invisible')
        }
        else{
            valid = false;
            containers.addClass('has-error')
            containers.removeClass('has-success')
            messages.removeClass('invisible')
        }

        return valid;
    },

    saveChanges: function () {
        if (this.formTester()) {
            var that = this
            var formImg = $('#select_profile_photo')[0].files[0]
            var picture = new FormData()
            picture.append('file', formImg)

            var data = {
                first_name: this.$('#ch_first_name').val(),
                last_name: this.$('#ch_last_name').val(),
                email: this.$('#ch_email').val(),
                password: this.$('#ch_password').val(),
                username: this.$('#ch_username').val()
            }
            Object.keys(data).forEach(function (key) {
                if (data[key] === that.model[key]) delete data[key]
            });
            data.date_updated = new Date().toJSON();

            //pujo foto
            this.eventBus.trigger('process:profile:save', data);
            if ($('#select_profile_photo').get(0).files.length === 0) {
                //si s'ha posat imatge de perfil
                that.eventBus.trigger('process:profile:refresh', data, that.model);
            }
            else {
                //si no s'ha posat imatge de perfil
                that.eventBus.trigger('profile:save', picture, that.model);
            }
        }
        //else alert('Els passwords no coincideixen!');
    },

    render: function () {
        this.$el.html(this.template({ user: this.model }))
        return this
    }
})

module.exports = UserProfile
