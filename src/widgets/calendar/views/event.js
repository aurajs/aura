define(['sandbox'], function(sandbox) {
  'use strict';

  var EventView = sandbox.mvc.View({
    initialize: function() {
      sandbox.events.bindAll(this);
    },

    render: function() {
      var buttons = {
        'Ok': this.save
      };

      if (!this.model.isNew()) {
        sandbox.util.extend(buttons, {
          'Delete': this.destroy
        });
      }
      sandbox.util.extend(buttons, {
        'Cancel': this.close
      });
      this.$el.dialog({
        modal: true,
        title: (this.model.isNew() ? 'New' : 'Edit') + ' Event',
        buttons: buttons,
        open: this.open
      });
      return this;
    },

    open: function() {
      this.$('#title').val(this.model.get('title'));
      this.$('#color').val(this.model.get('color'));
    },

    save: function() {
      this.model.set({
        'title': this.$('#title').val(),
        'color': this.$('#color').val()
      });
      if (this.model.isNew()) {
        this.collection.create(this.model, {
          success: this.saved
        });
      } else {
        this.model.save({}, {
          success: this.modelSaved
        });
      }
    },

    modelSaved: function(event) {
      this.collection.trigger('event-modified', event);
      this.close();
    },

    saved: function(event) {
      this.collection._byId[event.id] = event;
      this.collection.trigger('event-added', event);
      this.close();
    },

    close: function(event) {
      this.$el.dialog('close');
    },

    destroy: function() {
      this.model.destroy({
        success: this.close
      });
    }
  });

  return EventView;

});
