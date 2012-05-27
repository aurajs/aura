define(["./views/appView",
        "util/loadCss",
         "app/scripts/lib/backbone.js",
         "app/scripts/lib/underscore.js",
         "app/scripts/lib/jquery.tmpl.js"],
    	function (AppView, loadCss) {
			//loadCss("todos");
    	    var app = new AppView();
    	    return {};
    	});
