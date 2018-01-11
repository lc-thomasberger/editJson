define([
    'core/origin',
    './views/editJsonView',
    './views/editJsonSidebarView',
    './models/editJsonModel'
], function (
    Origin,
    EditJsonView,
    EditJsonSidebarView,
    EditJsonModel
) {
    'use strict';

    var supportedElms = ['article','block','component','page','menu'];
    var parentView = null;
    var eventName = '';

    Origin.on('origin:dataReady login:changed', function() {
        _.defer(addItems);
    });

    Origin.on('contextMenu:open', function(view, event) {
        var type = view.model.get('_type');
        if (supportedElms.indexOf(type) === -1) return;

        if (parentView) {
            removeEvent();
        }

        parentView = view;
        eventName = 'contextMenu:'+type+':editJson';
        
        setupEvent();
    });
    
    Origin.on('contextMenu:closed', function() {
        removeEvent();
    });        

    function addItems() {
        supportedElms.forEach(function(item) {
            Origin.contextMenu.addItem(item, {
                title: 'Edit JSON',
                className: 'context-menu-item',
                callbackEvent: 'editJson'
            });
        });
    }
    
    function setupEvent() {
        parentView.on(eventName, editJson);
    }

    function removeEvent() {
        if (!parentView) return;

        parentView.off(eventName, editJson);
        parentView = null;
        eventName = '';
    }

    function editJson() {
        var type = parentView.model.get('_type');
        var id = parentView.model.get('_id');

        Origin.router.navigateTo('editjson/'+type+'/'+id);
    }

    Origin.on('router:editjson', function(location, subLocation, action) {
        Origin.trigger('location:title:update', {title: 'Edit raw JSON content for: '+ location});
        
        var editJsonModel = new EditJsonModel({
            '_editType': location,
            '_editId': subLocation
        });

        Origin.sidebar.addView(new EditJsonSidebarView().$el);
        Origin.contentPane.setView(EditJsonView, {
            model: editJsonModel
        });
    });

});