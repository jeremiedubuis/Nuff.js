var Presenter = function(name, extended) {



    var Presenter = function(options) {


        for (var key in extended) {
            if (typeof extended[key] === 'function') Presenter.prototype[key] = extended[key];
            else Presenter[key] = extended[key];
        }

        this.presenterName = name;
        Nuff.presenterInstances[name] = this;

        this._actions = {};
        this._init(options);

    };

    Presenter.prototype= {

        _init: function(options) {
            this.destroy();
            if (typeof options === 'object' && options.presenterMethods) this.bindMethodsToView(options, options.presenterMethods);
            this.init(options);
            return this;
        },

        init: function(options) {

        },

        bindMethodsToView: function(view, presenterMethods) {
            if (view)
                this.mapViewFunctions(view, presenterMethods, view.presenterMethodsScope || this);

            return this;
        },

        mapViewFunctions: function(view, functions, scope) {
            var _this = this;

            functions.forEach(function(fn) {
                if (typeof _this[fn] === 'function') {
                    view[fn] = scope ? _this[fn].bind(scope) : _this[fn] ;
                } else {
                    throw new Error('Presenter->mapViewFunctions() requires an array of functions associated with a view, '+fn+' is not a valid method of presenter instance');
                }
            });

            return view;
        },


        destroy: function() {
            return _removeDispatchListeners();
        },

        dispatch: _dispatch,
        onDispatch: _onDispatch

    };


    if (extended && typeof extended.singleton !== "undefined" && !extended.singleton)
        return Presenter;
    else return function(options) {
        if (!Nuff.presenterInstances[name]) {
            return new Presenter(options);
        } else {
            return Nuff.presenterInstances[name]._init(options);
        }
    };

};

Nuff.Presenter = Presenter;
