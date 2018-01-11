define([
    'core/origin',
    'core/views/originView',
    'core/models/articleModel',
    'core/models/blockModel',
    'core/models/componentModel',
    'core/models/contentObjectModel'
], function (
    Origin,
    OriginView,
    ArticleModel, 
    BlockModel, 
    ComponentModel, 
    ContentObjectModel
) {
    'use strict';
    
    var EditJsonView = OriginView.extend({

        className: 'editjson',

        preRender: function() {
            this._onFetchSuccess = this.onFetchSuccess.bind(this);
            this._onFetchError = this.onFetchError.bind(this);
            this._onSaveSuccess = this.onSaveSuccess.bind(this);
            this._onSaveError = this.onSaveError.bind(this);

            this.listenTo(Origin, 'editjson:save', this.onSave);

            this.fetchData();
        },

        postRender: function() {
            window.ace.config.set("basePath", "./build/js/ace");
            var editor = window.ace.edit(this.$el[0]);
            this.editor = editor;
            var session = this.editor.getSession();

            this.editor.$blockScrolling = Infinity;
            this.editor.setTheme("ace/theme/chrome");
            session.setMode("ace/mode/json");
            session.setUseWrapMode(true);
            
            _.delay(function() {
                editor.resize();
            }, 800);
        },

        fetchData: function() {
            var Model;
            switch (this.model.get('_editType')) {
                case 'article':
                    Model = ArticleModel;
                    break;
                    case 'block':
                    Model = BlockModel;
                    break;
                    case 'component':
                    Model = ComponentModel;
                    break;
                case 'page':
                case 'menu':
                    Model = ContentObjectModel;
                    break;
                default:
                    return;
            }

            this.contentModel = new Model({_id: this.model.get('_editId')});
            this.contentModel.fetch({
                success: this._onFetchSuccess,
                error: this._onFetchError
            })
        },

        onFetchSuccess: function(model, response, options) {
            var type = model.get('_type');
            switch (type) {
                case 'component':
                type = model.get('_component');
                break;
                
                case 'page':
                case 'menu':
                type = 'contentobject';
                break;
            }
            
            var schemaKeys = Object.keys(Origin.schemas.get(type));
            var data = schemaKeys.reduce(function(prev, value, index, array) {
                if (model.has(value)) {
                    prev[value] = model.get(value);
                }
                return prev;
            }, {});

            this.editor.setValue(JSON.stringify(data, null, 4));
            this.editor.clearSelection();
        },

        onFetchError: function(model, response, options) {
            // todo: handle Error
        },

        onSave: function() {
            var hasErrors = this.checkAnnotationErrors();
            if (hasErrors) return;

            this.processData();
            this.saveContent();
        },
        
        checkAnnotationErrors: function() {
            var annotations = this.editor.getSession().getAnnotations();
            var hasError = false;
            var message = '';
            for (var i = 0; i < annotations.length; i++) {
                if (annotations[i].type === "error") {
                    hasError = true;
                    message = annotations[i].text;
                    break;
                }
            }
            
            if (hasError) {
                alert(message);
            }
            
            return hasError;
        },
        
        processData: function() {
            var editorData = JSON.parse(this.editor.getValue());
            
            for (var key in editorData) {
                if (editorData.hasOwnProperty(key)) {
                    var value = editorData[key];
                    if (this.contentModel.has(key)) {
                        this.contentModel.set(key, value);
                    }
                }
            }
        },

        saveContent: function() {
            this.contentModel.save(null, {
                patch: false,
                success: this.onSaveSuccess,
                error: this.onSaveError
            });
        },

        onSaveSuccess: function(model, response, error) {
            Backbone.history.history.back();
        },

        onSaveError: function(model, response, error) {
            alert(error);
        },

        remove: function() {
            this.editor.destroy();

            OriginView.prototype.remove.call(this);
        }

    }, {
        template: 'editJson'
    });

    return EditJsonView;

});