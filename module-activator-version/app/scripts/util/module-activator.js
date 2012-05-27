define(['util/loadcss'], function (loadcss) {
    var exports = {};
    exports.execute = function (element) {
        $("[data-module-cssonly]", element).each(function () {
            var item = $(this),
                css = item.data("module-cssonly");
            loadcss(css, item);
        });
        $("[data-module]", element).each(function () {
            var item = $(this),
                module = item.data("module"),
                parameters = item.data("module-parameters");

            require([module], function (mod) {
                if (mod.css) {
                    loadcss(mod.css, item);
                } else {
                    item.css('visibility', 'visible');
                }
                if (mod.init) {
                    mod.init(item, parameters);
                }
            });
        });
    };
    return exports;
});