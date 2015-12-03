##Models##

```javascript
var Todo = Nuff.Model('Todo', {
	attributes: {
		done: false,
		text: ""
	},
	init: function() { }
});
```

**set (object) || (attribute: string, value)**: Set the model's attributes object either by extending it with an object or by specifying an attribute and value.

**get( [attribute: string])** : returns a single attribute or all of the objects attributes

**has(attribute: string)**: return true if provided attribute is set for this model

**attributeIs (attribute: string, validatorType)**: Can be used in conjonction with the Nuff Validator to validate a ValidatorType (a RegExp or a pattern defined in the Validator regex object).

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