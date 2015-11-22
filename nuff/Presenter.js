var Presenter = function(_extended) {
    var Presenter = function(options) {

        for (var _key in _extended) {
            if (typeof _extended[_key] === "function") Presenter.prototype[_key] = _extended[_key];
            else Presenter[_key] = _extended[_key];
        }

        this._actions = {};
        this._instances = [];

        this.init(options);

    };

    Presenter.prototype= {

        init: function(options) {

        },

        mapViewFunctions: function(_view, _functions, scope) {
            var _this = this;
            _functions.forEach(function(fn) {
                if (typeof _this[fn] === "function") {
                    _view[fn] = scope ? _this[fn].bind(scope) : _this[fn] ;
                } else {
                    throw new Error('Presenter->mapViewFunctions() requires an array of functions associated with a view');
                }
            });

            return _view;
        },


        destroy: function() {
            return _removeDispatchListeners();
        },

        dispatch: _dispatch,
        onDispatch: _onDispatch

    };

    return Presenter;
};
Nuff.Presenter = Presenter;
