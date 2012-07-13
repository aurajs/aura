define(['sandbox', 'text!../templates/controls.html'], function(sandbox, controlTemplate) {

	var AppView = sandbox.mvc.View({

		controlTemplate: sandbox.template.parse(controlTemplate),

		events: {
			"click .stop-todos": "stopTodos",
			"click .stop-calendar": "stopCalendar",
			"click .start-todos": "startTodos",
			"click .start-calendar": "startCalendar"
		},


		initialize: function() {
			this.$el.html(controlTemplate);
		},

		render: function() {
			//...
		},

		stopTodos: function(){
			sandbox.widgets.stop('todos', '#todoapp');
		},

		stopCalendar: function(){
			sandbox.widgets.stop('calendar', '#calendarapp');
		},

		startTodos: function(){
			sandbox.widgets.start('todos', '#todoapp');
		},

		startCalendar: function(){
			sandbox.widgets.start('calendar', '#calendarapp');
		}

	});
	
	return AppView;

});