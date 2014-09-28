/**
 * vstack by @vslinko
 */

var inherits = require("./inherits");

function createClass(BaseConstructor, definition) {
    if (!definition) {
        definition = BaseConstructor;
        BaseConstructor = Object;
    }

    var Constructor = function(props) {
        if (!(this instanceof Constructor)) {
            return new Constructor(props);
        }

        if (props instanceof Constructor) {
            return props;
        }

        if (Constructor.prototype.init) {
            Constructor.prototype.init.call(this, props);
        }
    };

    inherits(Constructor, BaseConstructor);

    if (definition) {
        if (typeof definition === 'function') {
            if (definition.name) {
                Constructor.name = definition.name;
                Constructor.displayName = definition.name;
            }

            definition = definition(Constructor.prototype, BaseConstructor.prototype);
        }

        if (typeof definition === 'object') {
            if (definition.displayName) {
                Constructor.name = definition.displayName;
                Constructor.displayName = definition.displayName;
            }

            for (var key in definition) {
                if (key !== 'displayName' && definition.hasOwnProperty(key)) {
                    Constructor.prototype[key] = definition[key];
                }
            }
        }
    }

    return Constructor;
}

module.exports = createClass;
