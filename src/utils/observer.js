import jQuery from 'jquery'
var Observers = {}
var ObserverHandler = function (id) {
  var observer = Observers[id]

  if (Observers[id]) {
    return observer
  } else {
    var callbacks = jQuery.Callbacks()
    var ob = {}

    Observers[id] = {
      add: function (key) {
        if (!ob[key]) {
          var cb = jQuery.Callbacks()
          ob[key] = {
            subscribe: cb.add,

            publish: cb.fire,

            unsubscribe: cb.remove,

            unsubscribeAll: cb.empty
          }
        }
        return ob[key]
      },

      get: function (key) {
        return ob[key]
      },

      subscribe: callbacks.add,

      publish: callbacks.fire,

      unsubscribe: callbacks.remove,

      unsubscribeAll: callbacks.empty
    }

    return Observers[id]
  }
}

export default ObserverHandler
