define(["./views/appView",
        "util/loadCss",
         "/content/scripts/lib/backbone.js",
         "/content/scripts/lib/underscore.js",
         "/content/scripts/lib/jquery.tmpl.js"],
    	function (AppView, loadCss) {
			//loadCss("todos");
    	    var app = new AppView();
    	    return {};
    	});
