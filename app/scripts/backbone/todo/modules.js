define(["../todo/mediator"], function (mediator) {


			//Modules for Todo view


			//subscriber for new content (todoAdder)
			mediator.subscribe('newContentAvailable', function(context){
				 var content = context.model.get('content');
				 context.$('.todo-content').text(content);
		  		 context.input = context.$('.todo-input');
		         context.input.bind('blur', context.close);
		         context.input.val(content);
			});


			//subscribe to user editing (todoEditor)
			mediator.subscribe('beginContentEditing', function(context){
				$(context.el).addClass("editing");
			  	context.input.focus();
			});


			//todo saver
			mediator.subscribe('endContentEditing', function(context){					
				try{
					context.model.save({content: context.input.val()});
			   		$(context.el).removeClass("editing");
				}catch(e){
					
				}
			});


			//todo deleter
			mediator.subscribe('destroyContent', function(context){
				try{
					context.model.clear();
				}catch(e){
					//console.log(e);
				}
			});

			//Modules for app view
			// Subscribe..Tooltip module for adding entry
			mediator.subscribe('addingNewTodo', function(context, todo){
				  var tooltip = context.$(".ui-tooltip-top");
				 var val = context.input.val();
				 tooltip.fadeOut();
				 if (context.tooltipTimeout) clearTimeout(context.tooltipTimeout);
				 if (val == '' || val == context.input.attr('placeholder')) return;
				 var show = function(){ tooltip.show().fadeIn(); };
				 context.tooltipTimeout = _.delay(show, 1000);
			});



			// Subscribe to entry creation..
			mediator.subscribe('createWhenEntered', function(context, e, todos){
				if (e.keyCode != 13) return;
			   todos.create(context.newAttributes());
			   context.input.val('');
			});


			// Todo counter and remaining entries
			mediator.subscribe('renderDone', function(context, Todos){
				   var done = Todos.done().length;
				    context.$('#todo-stats').html(context.statsTemplate({
					    total: Todos.length,
					    done: Todos.done().length,
					    remaining: Todos.remaining().length
				    }));
			});


			//Do things when the completed items have been cleared
			mediator.subscribe('clearContent', function(Todos){
				_.each(Todos.done(), function(todo){ todo.clear(); });
			});


});