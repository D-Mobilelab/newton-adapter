NewtonAdapter.init({
	secretId: '<local_host>',
	enable: true,
	waitLogin: true,
	logger: console,
	properties: {
		bridgeSession: '123123123'
	}
});

console.log( NewtonAdapter.isUserLogged() );

// OK
NewtonAdapter.rankContent({
	contentId: '2323',
    scope: 'social'
});

// OK
NewtonAdapter.trackEvent({
	name: 'Load',
	properties: {
		category: 'Action',
		content: 'Fruit Ninja'
	}, 
	rank: {
		contentId: '3434',
	    scope: 'social'
	}
});

// OK
NewtonAdapter.trackPageview({
	properties: {
		title: 'Fruit Ninja Page',
		url: '/home/'
	}, 
	rank: {
		contentId: '4545',
	    scope: 'social',
	    score: 1
	}
});

// OK
NewtonAdapter.startHeartbeat({
	name: 'Loading',
	properties: {
		content: 'Fruit Ninja'
	}
});

// OK
NewtonAdapter.stopHeartbeat({
	name: 'Loading',
	properties: {
		content: 'Fruit Ninja',
		score: 1200
	}
});

NewtonAdapter.login({
	logged: true,
	type: 'external',
	// CHECK
	userId: '777888999',
	userProperties: {
		msisdn: '+3990909090',
		type: 'premium'
	}
});

console.log( NewtonAdapter.isUserLogged() );