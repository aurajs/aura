define([ "../aura/mediator" , "../aura/permissions" ], function (mediator, permissions) {

	var facade = facade || {};

	facade.subscribe = function(subscriber, channel, callback){

		// Note: Handling permissions/security is optional here
		// The permissions check can be removed 
		// to just use the mediator directly.
		
		if(permissions.validate(subscriber, channel)){
			mediator.subscribe( channel, callback );
		}
	}

	facade.publish = function(channel){
		mediator.publish( channel );
	}
	return facade;

});