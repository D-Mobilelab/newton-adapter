# 2.6.0
- Added single identity

# 2.5.0
- Added login without pin support

# 2.4.0
- From unique main.js to separeted methods and files
- Add login method with "email"
- Test coverage increased
- Various bug fixes

# 2.3.0
- Add autologin() method

# 2.2.0
- Add support for User 3.0

# 2.1.0
- Add support for push notification to init()

# 2.0.0
- Replaced promise system with BlueBus library
- Added new methods: recoverPassword, userDelete, addIdentity, removeIdentity, logout, setUserStateChangeListener, finalizeLoginFlow, getUserToken
- Divided test on multiple files
- Webpack build
- Removed dependency from dml-js-boilerplate
- Gulp build, not Grunt

# 1.7.0
- Added waitDeviceReady parameter to init()
- improved isUserLogged()

# 1.6.0
- PromiseLite replaced by PromisePolyfill
- every method returns a chainable promise

# 1.5.0
- Support to Newton v1
- new isInitialized() method
- code and doc refining

# 1.4.2
- Updated promiselite to ~1.3.2

# 1.4.1
- Updated Promiselite to ~1.3.1

# 1.4.0
- Init method checks if Newton exists

# 1.3.1
- Fixed bug, now don't re-inizialize loginPromise and enablePromise on init method

# 1.3.0
- added promiselite as dependency
- require takes only newton-adapter

# 1.2.0
- Added error arguments to login and enable promises fail

# 1.1.0
- Fix rank score
- Fix an error about initPromise

# 1.0.2
- Documentation Updated

# 1.0.1
- Fixed setCustomData for custom login
- added default score equal to 1 for rankContent

# 1.0.0
- init, login, trackEvent, trackPageview, rankContent, startHeartbeat, stopHeartbeat, isUserLogged methods; waitLogin feature; compatible with Newton 2.2