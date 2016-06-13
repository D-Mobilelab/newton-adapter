NewtonAdapter.init({
	secretId: '123456789',
	enable: true,
	waitLogin: true
});

NewtonAdapter.trackEvent();

NewtonAdapter.customLogin({
	logged: true
});