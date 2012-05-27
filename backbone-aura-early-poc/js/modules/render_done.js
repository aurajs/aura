/*jslint sloppy:true*/
/*global define*/
define(["../extensions/facade"],
    function (facade) {
        return facade.subscribe('bootstrap', 'renderDone', function (view, args) {
        	console.log("renderDone", view, args);
        });
    }
);