require({
    paths: {
        underscore: "util/underscore"
    }
},
['util/content-builder', 'util/module-activator'], function (builder, activator) {
    activator.execute();
    builder.execute();
});