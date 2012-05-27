define([], function(){
	var Todo = Backbone.Model.extend({
		defaults : {
				   content: "An empty entry",
	    done: false
			   },
	    initialize: function (){
				if(!this.get("content")){
					this.set({"content":this.defaults.content});
				}
			},
	    toggle : function () {
			     this.save({done: !this.get('done')});
		     },
	    clear: function () {
			   this.destroy();
			   this.view.remove();
		   }

	});
	return Todo;
});
