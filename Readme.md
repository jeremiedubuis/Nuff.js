## **Nuff.js** ##

The idea behind this project is to provide a simple Model Presenter pattern to use in combination with a view framework or native js. It contains simple components such as a Router, a data Validator, Presenters, Models, Collections  and a Dispatcher. Provided alongside the project is a simple example of a todo list using React.

#### **Presenter** ####

```javascript
    var todo = Nuff.Presenter({
      init: function() { }
    });
```
**init**: The init function is made to be overridden by the developper. It will be launched upon instantiation.

**mapViewFunctions (view: object, functions: array, scope: object)**: Attaches each Presenter function in the functions array to the view object. Binds scope to these functions if it is provided.



----------


#### **Model** ####

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

**request (object: object)** : makes an ajax request using the Nuff.ajax function


----------

#### **Collection** ####

A collection is an array that is extended with helper functions. It verifies that values push are instances of the collection's model attribute.
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

----------


#### **Dispatcher** ####

The dispatcher is a simple component that allows registering of callbacks with strings.

**register (action: string, callback: function)**: Associates a callback with an action string.

**unregister (action: string, callback: function)** : Removes a callback action string association

**dispatch (action:string)** : Activates all callbacks associated to an action string

**list (action: string)** :ogs all callbacks associated to an action string
```javascript
    new Nuff.Dispatcher();
```

#### **Router** ####

The router allows to bind hashes to callbacks, parameters are passed by slashes and returned as arguments to the callbacks.
```javascript
new Nuff.Router();
```

**register (_route: string, callback: function, [ scope: object, listen: bool])**: Registers a new route from a string and associates a callback function. If scope is defined callback will be associated to it. If listen is defined, the callback will trigger onhashchange.

**unregister(_route: string)**: removes route

**listen(_route: string)**: binds Route callback to the onhashchange event

**removeListener(_route: string)**: unbinds onhashchange from the Route callback

**setRoute(_route:string, _silent: bool)**: Changes active hash, if silent is true then doesn't fire callbacks on hashchange

#### **Validator** ####

The validator is a simple tool to centralize type validation, it binds regex and tests values against them.

```javascript
var _validator = Nuff.Validator();
```

**set(object: object)**: overrides the regex object of the validator with customized RegExp,

**validate(type: string || RegExp, value)** : Checks if value matchs provided type in the set regex object or if it matches a provided regexp.
