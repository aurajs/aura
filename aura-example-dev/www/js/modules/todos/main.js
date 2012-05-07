// Author: Thomas Davis <thomasalwyndavis@gmail.com>
// Filename: main.js
define(['sandbox', './views/app'], function(sandbox, AppView){
    return sandbox.subscribe('bootstrap', 'todos', function (element) {
        var app_view = new AppView(sandbox, element);
    });
});