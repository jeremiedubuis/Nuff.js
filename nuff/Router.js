/**
  * @desc the router provides a simple linking system between hashes and callbacks
*/
var registeredRouter;

var Router = function() {
    this.routes = [];
    this.eventListeners = [];
};

Router.prototype = {

	/**
	  * @desc registers a new callback to a hash string
	  * @param route(string) : the route string to which a callback will be bound
	  * @param callback(function)
	  * @param scope(object) the context for which callback will be called
	  * @param listen(bool) : defines weather callbach should be fired on hashchange
	*/
    register: function(route, callback, scope, listen) {
        if (route && typeof callback==='function') {

            if (!this.routes[route]) {

                this.routes[route] = {
                    callback: callback,
                    scope: scope || this
                };

                if (listen) this.listen(route);

                return this;

            } else {
                throw new Error('Router-register() '+route+' route is already defined');
            }

        } else {
            throw new Error('Router->register() requires a string and a callback function');
        }
    },

    listen: function(route) {

        var _this = this;

        var _baseRoute = route.split('/').shift();
        this.eventListeners.push(function() {
            var _hash = window.location.hash.replace('#','');
            if (_hash.split('/').shift() === _baseRoute) {
                _this.setRoute(_hash);
            }
        });
        var _index = this.eventListeners.length-1;
        this.routes[_baseRoute].listenerIndex = _index
        window.addEventListener('hashchange', this.eventListeners[_index]);

    },

    removeListener: function(route) {
        var _index = this.routes[route].listenerIndex;
        window.removeEventListener('hashchange', this.eventListeners[_index]);
        this.eventListeners.splice(_index, 1);
    },

	/**
	  * @desc removes callback from registered route
	  * @param route(string)
	*/
    unregister: function(route) {
        delete this.routes[route];
        return this;
    },

	/**
	  * @desc sets the page hash, if silent is true it will not trigger callbacks
	  * @param route(string)
	  * @param silent(bool): if true won't fire route callbacks
	*/
    setRoute: function(route, _silent) {

        window.location.hash = route;
        var routeParts = route.split('/');
        route = routeParts[0];

        if (!this.routes[route]) throw new Error('Router->setRoute() '+route+' is undefined');
        else {

            if (!_silent) {
                this.routes[route].callback.apply(this.routes[route].scope, routeParts);
            }

            return this;

        }
    }

};

Nuff.Router = function() {
    if (!registeredRouter) registeredRouter = new Router();
    return registeredRouter;
};
