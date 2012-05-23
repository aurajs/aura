/**
 * <p>To load a module for the app, place it in the modules/ directory that is a
 * sibling to this file. For any ,
 * place them in the libs directory.</p>
 *
 * <p>The application is organized into 5 directories:</p>
 * 
 * <dl>
 * <dt>collections</dt><dd>Backbone collections</dd>
 * <dt>extensions</dt><dd>Extensions to the Aura core. This is where you do 
 * your core overrides like adding a local storage mechanism.</dd>
 * <dt>libs</dt><dd>Third party dependencies, like jQuery and Backbone, 
 * _including_ the aura-core itself. These files should not be modified. Rather,
 * use a script to update them through Git.</dd>
 * <dt>models</dt><dd>Backbone models</dd>
 * <dt>modules</dt><dd>Aura modules should reside here. Aura modules encapsulate
 * Backbone views, thus they do not have their own directory. There can be sub-
 * directories which are referenced by dot.notation internally. All modules in 
 * this directory subscribe to messages via the facade.subscribe method. They 
 * will be auto-loaded by the core as long as you have used right structure.</dd>
 * </dl>
 * <dt>templates</dt><dd>Javascript templates...</dd>
 * </dl>
 *
 * <p>Note that Backbone collections and models are _not_ in the modules 
 * directory. This is because they do not subscribe to aura-core. It is 
 * perfectly acceptable to use the facade as a dependency to utilize its 
 * interface, and therefor reduce dependencies. While collections and models
 * are not Aura-modules, they should absolutley be AMD modules.</p>
 * 
 * <p>To load the app, require the extended mediator (if there is one) and 
 * publish an event such as appInit via mediator.publish. That event will be 
 * converted into a file name and resolved within the modules directory. It
 * will then get called.</p>
 * 
 * @fileOverview Main app file
 */ 
require.config({
    paths: {
        jquery: 'libs/jquery/jquery-min',
        underscore: 'libs/underscore/underscore-min',
        backbone: 'libs/backbone/backbone-optamd3-min',
        text: 'libs/require/text'
    }
});

require(["./extensions/mediator"], function (mediator) {
    mediator.publish('appInit', "#todoapp");
});
