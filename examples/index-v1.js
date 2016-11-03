console.log( "isInitialized: ", NewtonAdapter.isInitialized() );

NewtonAdapter.init({
	secretId: '<local_host>',
	enable: true,
	waitLogin: true,
	logger: console,
	properties: {
		bridge_session_id: '123123123'
	},
	newtonversion: 1
});

console.log( "isInitialized: ", NewtonAdapter.isInitialized() );

NewtonAdapter.trackEvent({
	name: 'event_1_2',
	properties: {
		category: 'Miscellanous',
		content: 'Majong'
	}
});

NewtonAdapter.trackPageview({
	properties: {
		title: 'Fruit Ninja Page',
		url: '/home/'
	}
});

NewtonAdapter.startHeartbeat({
	name: 'Loading',
	properties: {
		content: 'Fruit Ninja'
	}
});

NewtonAdapter.stopHeartbeat({
	name: 'Loading',
	properties: {
		content: 'Fruit Ninja',
		score: 1200
	}
});

NewtonAdapter.login({
	logged: true,
	type: 'custom',
	userId: '777888999',
	userProperties: {
		msisdn: '+3990909090',
		type: 'premium'
	}
});

console.log( "isLogged: ", NewtonAdapter.isUserLogged() );