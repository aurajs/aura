/**
 * A framework for large scale Javascript applications
 */
require.config({
	paths: {
		jquery: 'libs/jquery/jquery-min',
		underscore: 'libs/underscore/underscore-min',
	}
});

require(["./mediator"], function (mediator) {
	mediator.publish('appInit', "#app");
});