var Router = function() {
    this.routes = [];
    this.eventListeners = [];
};

Router.prototype = {

    register: function(_route, callback, scope, listen) {
        if (_route && typeof callback==="function") {

            if (!this.routes[_route]) {

                this.routes[_route] = {
                    callback: callback,
                    scope: scope || this
                };

                if (listen) this.listen(_route);

                return this;

            } else {
                throw new Error('Router-register() '+_route+' route is already defined');
            }

        } else {
            throw new Error('Router->register() requires a string and a callback function');
        }
    },

    listen: function(_route) {

        var _this = this;

        var _baseRoute = _route.split('/').shift();
        this.eventListeners.push(function() {
            var _hash = window.location.hash.replace('#','');
            if (_hash.split('/').shift() === _baseRoute) {
                _this.setRoute(_hash);
            }
        });
        var _index = this.eventListeners.length-1;
        this.routes[_baseRoute].listenerIndex = _index
        window.addEventListener("hashchange", this.eventListeners[_index]);

    },

    removeListener: function(_route) {
        var _index = this.routes[_route].listenerIndex;
        window.removeEventListener("hashchange", this.eventListeners[_index]);
        this.eventListeners.splice(_index, 1);
    },

    unregister: function(_route) {
        delete this.routes[_route];
        return this;
    },

    setRoute: function(_route, _silent) {

        window.location.hash = _route;
        var _routeParts = _route.split('/');
        _route = _routeParts[0];

        if (!this.routes[_route]) throw new Error('Router->setRoute() '+_route+' is undefined');
        else {

            if (!_silent) {
                this.routes[_route].callback.apply(this.routes[_route].scope, _routeParts);
            }

            return this;

        }
    }

};

Nuff.Router = Router;
