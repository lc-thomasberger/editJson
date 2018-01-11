define([
    'core/origin',
    'modules/sidebar/views/sidebarItemView'
], function(Origin, SidebarItemView) {
    'use strict';
   
    var EditJsonSidebarView = SidebarItemView.extend({

        className: 'sidebar-item',

        events: {
            'click .editjson-sidebar-save': 'onSave',
            'click .editjson-sidebar-cancel': 'onCancel'
        },

        onSave: function(event) {
            Origin.trigger('editjson:save');
        },

        onCancel: function(event) {
            Backbone.history.history.back();
        }


    }, {
        template: 'editJsonSidebar'
    });

    return EditJsonSidebarView;

});