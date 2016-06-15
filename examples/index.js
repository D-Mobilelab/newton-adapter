// NewtonAdapter.init({
//     secretId: '<local_host>',
//     enable: false,
//     waitLogin: false
// });

// NewtonAdapter.trackEvent('Play');

NewtonAdapter.init({
	secretId: '<local_host>',
	enable: true,
	waitLogin: true,
	logger: console,
	properties: {
		bridgeId: '123123123'
	}
});

console.log( NewtonAdapter.isUserLogged() );

NewtonAdapter.rankContent({
	contentId: '123456777',
    scope: 'social',
    score: 4
});

NewtonAdapter.trackEvent({
	name: 'Play',
	properties: {
		category: 'Game',
		content: 'Fruit Slicer'
	}, 
	rank: {
		contentId: '789123123',
	    scope: 'social',
	    score: 4
	}
});

NewtonAdapter.trackPageview({
	title: 'Fruit Page',
	url: 'http://www.google.it', 
	rank: {
		contentId: '333444555',
	    scope: 'social',
	    score: 4
	}
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

console.log( NewtonAdapter.isUserLogged() );