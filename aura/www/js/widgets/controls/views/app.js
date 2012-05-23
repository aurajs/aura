define(['sandbox', 'text!../templates/controls.html'],
        function(sandbox, controlTemplate) {

    var AppView = sandbox.mvc.View({

        controlTemplate: sandbox.template.parse(controlTemplate),

        events: {
          "click .stop-todos": "stopTodos",
          "click .stop-calendar": "stopCalendar"
        },


        initialize: function() {
          this.$el.append(controlTemplate);
        },

        render: function() {
         //...
        },

        stopTodos: function(){
          //console.log('clicker');
          sandbox.widgets.stop('todos', '#todoapp');
        },

        stopCalendar: function(){
          sandbox.widgets.stop('calendar', '#calendarapp');
        }

    });
    
    return AppView;

});
