var Router = function() {
    this.routes = [];
    this.eventListeners = [];
};

Router.prototype = {

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

    unregister: function(route) {
        delete this.routes[route];
        return this;
    },

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

Nuff.Router = Router;
