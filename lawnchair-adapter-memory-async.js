/*
 * An async Lawnchair in-memory adapter for use in test cases, based on the
 * official in-memory Lawnchair adapter at:
 *
 * https://github.com/brianleroux/lawnchair/blob/master/src/adapters/memory.js
 *
 * Eric Galluzzo, October 2013
 * MIT license
 */
Lawnchair.adapter('memory-async', (function(){

    var data = {}

    var save = function(self, obj, cb) {
        var key = obj.key || self.uuid()
        
        if (!self.store[key]) {
            if (obj.key) delete obj.key
            self.index.push(key)
        }

        self.store[key] = obj
        
        if (cb) {
            obj.key = key
            self.lambda(cb).call(self, obj)
        }
    }

    return {
        valid: function() {
            return true
        },

        init: function (options, callback) {
            data[this.name] = data[this.name] || {index:[],store:{}}
            this.index = data[this.name].index
            this.store = data[this.name].store
            this.timeout = options.timeout || 20 // ms
            var cb = this.fn(this.name, callback)
            if (cb) cb.call(this, this)
            return this
        },

        keys: function (callback) {
            var self = this
            setTimeout(function() {
                self.fn('keys', callback).call(self, self.index)
            }, this.timeout)
            return this
        },

        save: function(obj, cb) {
            var self = this
            setTimeout(function() {
                save(self, obj, cb)
            }, this.timeout)

            return this
        },

        batch: function (objs, cb) {
            var self = this
            setTimeout(function() {
                var r = []
                for (var i = 0, l = objs.length; i < l; i++) {
                    save(self, objs[i], function(record) {
                        r.push(record)
                    })
                }
                if (cb) self.lambda(cb).call(self, r)
            }, this.timeout)
            return this
        },

        get: function (keyOrArray, cb) {
            var self = this
            setTimeout(function() {
                var r;
                if (self.isArray(keyOrArray)) {
                    r = []
                    for (var i = 0, l = keyOrArray.length; i < l; i++) {
                        r.push(self.store[keyOrArray[i]])
                    }
                } else {
                    r = self.store[keyOrArray]
                    if (r) r.key = keyOrArray
                }
                if (cb) self.lambda(cb).call(self, r)
            }, this.timeout)
            return this 
        },

        exists: function (key, cb) {
            var self = this
            setTimeout(function() {
                self.lambda(cb).call(self, !!(self.store[key]))
            }, this.timeout)
            return this
        },

        all: function (cb) {
            var self = this
            setTimeout(function() {
                var r = []
                for (var i = 0, l = self.index.length; i < l; i++) {
                    var obj = self.store[self.index[i]]
                    obj.key = self.index[i]
                    r.push(obj)
                }
                self.fn(self.name, cb).call(self, r)
            }, this.timeout)
            return this
        },

        remove: function (keyOrArray, cb) {
            var self = this
            setTimeout(function() {
                var del = self.isArray(keyOrArray) ? keyOrArray : [keyOrArray]
                for (var i = 0, l = del.length; i < l; i++) {
                    var key = del[i].key ? del[i].key : del[i]
                    var where = self.indexOf(self.index, key)
                    if (where < 0) continue /* key not present */
                    delete self.store[key]
                    self.index.splice(where, 1)
                }
                if (cb) self.lambda(cb).call(self)
            }, this.timeout)
            return this
        },

        nuke: function (cb) {
            var self = this
            setTimeout(function() {
                self.store = data[self.name].store = {}
                self.index = data[self.name].index = []
                if (cb) self.lambda(cb).call(self)
            }, this.timeout)
            return this
        }
    }
/////
})());
