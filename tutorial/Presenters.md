## **The Nuff Presenter** ##

Presenters are components that link views to models and collections. They are by default singletons that take a view as their initial parameter. This view implements an array called presenterMethods which describes which methods the view expects.

The Presenter can however be used in a more generic way. It can be renedered instanciable if it's boolean singleton is set to false.

```javascript
    var todo = Nuff.Presenter({
    	  singleton: true, // default
      init: function(options) { } // the parameters passed on instanciation will be passed to the user overwritten init method.
    });
```

**mapViewFunctions (view: object, functions: array, scope: object)**: Attaches each Presenter function in the functions array to the view object. Binds scope to these functions if it is provided.

**onDispatch (callback: function)** : Registers a camlback to a dispatch string.

**dispatch (action: string)** : Dispatches a strings. This triggers every dispatcher associated callbacks.

**request ({
	url (string): ressource url,
	method (string) : http request method
	contentType (string): xhr content-type header,
	onSuccess (function) : success callback,
	onFailure (function) : failure callback,
	data (string) : string parameters linked by ampersands
}) ** : performs an xhr request