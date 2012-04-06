/*jslint sloppy:true*/
/*global define*/
define(["../extensions/facade"],
    function (facade) {
        return facade.subscribe('bootstrap', 'newTodo', function (view, args) {
        	console.log("newTodo", view, args);
        });
    }
);