##Collections##

Collections are extended arrays that inherit sorting methods.
They verify that values pushed into it are instances of the collection's model attribute.
```javascript
var Todos = Nuff.Collection({
	model: "Todo"
});
```

**push(model)**: Adds every model provided to the Collection and verifies they are the right type of object

**sortBy (attribute:string, order: "<" || ">")**: returns every model by attribute value in ascending or descending order

**getWhere (attribute:string, value)**: returns every model in collection where attribute === value

**setWhere(attribute: string, oldValue, value)** : sets an attribute to value where it used to be oldValue

**deleteWhere (attribute: string, value)**: Deletes all models in collection where attribute === value

**toJSON**: returns every model in collection as json

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