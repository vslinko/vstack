/**
 * vstack by @vslinko
 */

var DepGraph = require("dep-graph");
var createClass = require("../oop/createClass");
var invariant = require("../util/invariant");

var DependencyGraph = createClass(function DependencyGraph(proto) {
    proto.init = function() {
        this._realDependencyGraph = new DepGraph();
    };

    proto.addPath = function(source, destination) {
        this._realDependencyGraph.add(source, destination);

        try {
            this._realDependencyGraph.descendantsOf(source);
        } catch (e) {
            invariant(!e, 'Circular dependency between "%s" and "%s"', source, destination);
        }
    };
});

module.exports = DependencyGraph;
