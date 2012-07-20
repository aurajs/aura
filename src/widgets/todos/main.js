define(['sandbox', './views/app'], function (sandbox, AppView) {

	return function (element) {
		new AppView({
			el: sandbox.dom.find(element)
		});
		
		sandbox.publish('bootstrap', 'todos');
		sandbox.subscribe('bootstrap', 'todos', function (from) {
			console.log('Todos-bootstrap message from from: '+ from);
		});
	};

});