define(['sandbox', './views/app'], function (sandbox, AppView) {

	return function (element) {
		new AppView({
			el: sandbox.dom.find(element)
		});
		
		sandbox.publish('bootstrap', 'controls');
		sandbox.subscribe('bootstrap', 'controls', function (from) {
			console.log('Controls-bootstrap message from from: '+ from);
		});
	};

});