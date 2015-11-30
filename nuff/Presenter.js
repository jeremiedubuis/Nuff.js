/**
  * @desc  Nuff.Presenter is a communication hub between views and models/collections
           The main idea is that view instanciate presenters with themselves as a parameter
           The view implements a presenterMethods array to bind presenter methods to itself and
           thus implicitly calls presenter actions on user input.
           Presenters are singletons by default but can be instanciables by setting the singleton
           attribute to false
  * @param name (string): holds the presenter's name for further reference
  * @param extended (object): holds data that will extend Presenter functionnality, all functions
           will be added to object prototype whereas values will be added to object itself
*/

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

        /**
          * @desc _init is a local initialization function called on instanciation or reset,
                  it allows to rebind presenter methods to a new view
        */
        _init: function(options) {
            this.destroy();
            if (typeof options === 'object' && options.presenterMethods) this.bindMethodsToView(options, options.presenterMethods);
            this.init(options);
            return this;
        },

        init: function(options) {

        },

        /**
          * @desc  bindMethodsToView attaches presentermethods with presenter scope or (view.presenterMethodsScope)
          * @param view (object): a view object to which methods will be bound
          * @param presenterMethods (array) : a list of strings that will be evaluated against presenter methods
        */
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

    // if exented.singleton is defined check wether presenter should be singleton or instanciable
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
