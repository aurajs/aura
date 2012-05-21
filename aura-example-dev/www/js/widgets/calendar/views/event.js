define(['sandbox'], function(sandbox){
    return sandbox.mvc.View({
        // el: sandbox.dom.find('#eventDialog'),
        initialize: function() {
            sandbox.events.bindAll(this);           
        },
        render: function() {
            var buttons = {'Ok': this.save};
            if (!this.model.isNew()) {
                sandbox.util.extend(buttons, {'Delete': this.destroy});
            }
            sandbox.util.extend(buttons, {'Cancel': this.close});            
            
            // @todo replace with bootstrap-modal
            // this.$el.dialog({
            //    modal: true,
            //    title: (this.model.isNew() ? 'New' : 'Edit') + ' Event',
            //    buttons: buttons,
            //    open: this.open
            // });

            return this;
        },        
        open: function() {
            this.$('#title').val(this.model.get('title'));
            this.$('#color').val(this.model.get('color'));            
        },        
        save: function() {
            this.model.set({'title': this.$('#title').val(), 'color': this.$('#color').val()});
            
            if (this.model.isNew()) {
                this.collection.create(this.model, {success: this.close});
            } else {
                this.model.save({}, {success: this.close});
            }
        },
        close: function() {
            this.el.dialog('close');
        },
        destroy: function() {
            this.model.destroy({success: this.close});
        }        
    });
});