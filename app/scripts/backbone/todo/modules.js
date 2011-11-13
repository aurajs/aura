define(["../todo/mediator"], function (mediator) {


			//Subscriber modules for Todo view

			// Desc: Update view with latest todo content
			// Subscribes to: newContentAvailable
			mediator.subscribe('newContentAvailable', function(context){
				 var content = context.model.get('content');
				 context.$('.todo-content').text(content);
		  		 context.input = context.$('.todo-input');
		         context.input.bind('blur', context.close);
		         context.input.val(content);
			});



			// Desc: update editing UI on switching mode to editing content
			// Subscribes to: beginContentEditing
			mediator.subscribe('beginContentEditing', function(context){
				$(context.el).addClass("editing");
			  	context.input.focus();
			});



			// Desc: Save models when a user has finishes editing
			// Subscribes to: endContentEditing
			mediator.subscribe('endContentEditing', function(context){					
				try{
					context.model.save({content: context.input.val()});
			   		$(context.el).removeClass("editing");
				}catch(e){
					//console.log(e);
				}
			});



			// Desc: Delete a todo when the user no longer needs it
			// Subscribes to: destroyContent
			mediator.subscribe('destroyContent', function(context){
				try{
					context.model.clear();
				}catch(e){
					//console.log(e);
				}
			});



			// Desc: When a user is adding a new entry, display a tooltip
			// Subscribes to: addingNewTodo
			mediator.subscribe('addingNewTodo', function(context, todo){
				 var tooltip = context.$(".ui-tooltip-top");
				 var val = context.input.val();
				 tooltip.fadeOut();
				 if (context.tooltipTimeout) clearTimeout(context.tooltipTimeout);
				 if (val == '' || val == context.input.attr('placeholder')) return;
				 var show = function(){ tooltip.show().fadeIn(); };
				 context.tooltipTimeout = _.delay(show, 1000);
			});



			// Desc: Create a new todo entry 
			// Subscribes to: createWhenEntered
			mediator.subscribe('createWhenEntered', function(context, e, todos){
			if (e.keyCode != 13) return;
			   todos.create(context.newAttributes());
			   context.input.val('');
			});



			// Desc: A Todo and remaining entry counter
			// Subscribes to: renderDone
			mediator.subscribe('renderDone', function(context, Todos){
				   var done = Todos.done().length;
				    context.$('#todo-stats').html(context.statsTemplate({
					    total: Todos.length,
					    done: Todos.done().length,
					    remaining: Todos.remaining().length
				    }));
			});


			// Desc: Clear all completed todos when clearContent is dispatched
			// Subscribes to: clearContent
			mediator.subscribe('clearContent', function(Todos){
				_.each(Todos.done(), function(todo){ todo.clear(); });
			});


});