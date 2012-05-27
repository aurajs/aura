/*jslint sloppy:true*/
/*global define*/
define(["../extensions/facade"],
    function (facade) {
        return facade.subscribe('bootstrap', 'clearContent', function (todos) {
        	console.log("clearContent", todos);
        });
    }
);