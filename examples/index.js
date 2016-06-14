NewtonAdapter.init({
	secretId: '<local_host>',
	enable: true,
	waitLogin: true,
	logger: console
});

console.log( NewtonAdapter.isLogged() );

NewtonAdapter.trackEvent({
	name: 'Play',
	properties: {
		category: 'Game',
		content: 'Fruit Slicer'
	}
});

NewtonAdapter.trackPageview({
	title: 'Fruit Page',
	url: 'http://www.google.it'
});

NewtonAdapter.startHeartbeat({
	name: 'Playing',
	properties: {
		category: 'Game',
		content: 'Fruit Slicer'
	}
});

NewtonAdapter.stopHeartbeat({
	name: 'Playing',
	properties: {
		content: 'Fruit Slicer',
		score: 1000
	}
});

NewtonAdapter.stopHeartbeat({
	name: 'heartbeatNotExisting',
	properties: {
		content: 'Fruit Slicer',
		score: 1000
	}
});

NewtonAdapter.login({
	logged: true,
	type: 'external',
	userId: '123456789',
	userProperties: {
		msisdn: '+39123456789',
		type: 'freemium'
	},
	callback: function() {
		console.log('login callback!');
	}
});
// }).then(function(){});

console.log( NewtonAdapter.isLogged() );