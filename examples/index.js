import NewtonAdapter from '../src/main';

console.log('isInitialized: ', NewtonAdapter.isInitialized());

// OK
NewtonAdapter.trackEvent({
    name: 'event_1_2',
    properties: {
        category: 'Miscellanous',
        content: 'Majong',
    },
    rank: {
        contentId: 'rank_1_4',
        scope: 'social',
    },
});

NewtonAdapter.init({
    secretId: '<local_host>',
    enable: true,
    waitLogin: true,
    logger: console,
    properties: {
        bridge_session_id: '123123123',
    },
});

console.log('isInitialized: ', NewtonAdapter.isInitialized());

// console.log( "isLogged: ", NewtonAdapter.isUserLogged() );

// OK
NewtonAdapter.rankContent({
    contentId: 'rank_2_4',
    scope: 'social',
});

// OK
NewtonAdapter.trackEvent({
    name: 'event_2_2',
    properties: {
        category: 'Action',
        content: 'Fruit Ninja',
    },
    rank: {
        contentId: 'rank_3_4',
        scope: 'social',
    },
});

// OK
NewtonAdapter.trackPageview({
    properties: {
        title: 'Fruit Ninja Page',
        url: '/home/',
    },
    rank: {
        contentId: 'rank_4_4',
        scope: 'social',
        score: 1,
    },
});

// OK
NewtonAdapter.startHeartbeat({
    name: 'Loading',
    properties: {
        content: 'Fruit Ninja',
    },
});

// OK
NewtonAdapter.stopHeartbeat({
    name: 'Loading',
    properties: {
        content: 'Fruit Ninja',
        score: 1200,
    },
});

NewtonAdapter.login({
    logged: true,
    type: 'external',
    // CHECK
    userId: '777888999',
    userProperties: {
        msisdn: '+3990909090',
        type: 'premium',
    },
});

// console.log( "isLogged: ", NewtonAdapter.isUserLogged() );