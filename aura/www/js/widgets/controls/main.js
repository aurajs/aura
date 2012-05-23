define(['sandbox', './views/app'], function(sandbox, AppView){
    return sandbox.subscribe('bootstrap', 'controls', function (element) {
        new AppView({el: sandbox.dom.find(element)}).render();
    });
});