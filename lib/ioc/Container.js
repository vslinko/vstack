/**
 * vstack by @vslinko
 */

var createClass = require("../oop/createClass");
var Promise = require("../util/Promise");
var DependencyGraph = require("./DependencyGraph");
var invariant = require("../util/invariant");

var Container = createClass(function Container(proto) {
    proto.init = function() {
        this._graph = new DependencyGraph();
        this._tags = {};
        this._factories = {};
        this._values = {};
        this._compilers = [];
    };

    proto.set = function(name, dependencies, tags, value) {
        invariant(
            !(name in this._values || name in this._factories),
            'Service "%s" already defined',
            name
        );

        if (!value) {
            value = tags;
            tags = [];
        }

        if (!value) {
            value = dependencies;
            dependencies = [];
        }

        dependencies.forEach(function(dependency) {
            this._graph.addPath(name, dependency);
        }, this);

        tags.forEach(function(tag) {
            if (!this._tags[tag]) {
                this._tags[tag] = [];
            }

            this._tags[tag].push(name);
        }, this);

        if (typeof value === 'function') {
            this._factories[name] = {
                dependencies: dependencies,
                factory: value
            };
        } else {
            this._values[name] = value;
        }
    };

    proto.get = function(keys) {
        var getter = function(key) {
            if (key in this._values) {
                return Promise.resolve(this._values[key]);
            }

            invariant(key in this._factories, 'Unknown service "%s"', key);

            return this.inject(this._factories[key].dependencies, this._factories[key].factory)
                .then(function(wrappedFactory) {
                    this._values[key] = wrappedFactory();
                    return this._values[key];
                }.bind(this));
        }.bind(this);

        if (Array.isArray(keys)) {
            return Promise.all(keys.map(getter));
        } else {
            return getter(keys);
        }
    };

    proto.inject = function(dependencies, factory) {
        if (!Array.isArray(dependencies)) {
            dependencies = [dependencies];
        }

        return this.get(dependencies)
            .then(function(args) {
                return function() {
                    return factory.apply(null, args);
                };
            });
    };

    proto.search = function(tag) {
        if (this._tags[tag]) {
            return this.get(this._tags[tag]);
        } else {
            return Promise.resolve([]);
        }
    };

    proto.plugin = function(plugin) {
        plugin(this);
    };

    proto.compile = function(compiler) {
        this._compilers.push(compiler);
    };

    proto.build = function() {
        return Promise.all(this._compilers.map(function(compiler) {
            return compiler();
        }));
    };
});

module.exports = Container;
