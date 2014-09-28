/**
 * vstack by @vslinko
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();

describe('createClass', function() {
    var A, B, C,
        a1, a2, a3,
        b1, b2, b3,
        c1, c2, c3,
        createClass = require("../createClass");

    beforeEach(function() {
        A = createClass({
            displayName: 'A',

            init: function(props) {
                this._a = props.a;
            },

            z: function() {
                return {a: this._a};
            }
        });

        B = createClass(A, function B(proto, baseProto) {
            proto.init = function(props) {
                baseProto.init.call(this, props);
                this._b = props.b;
            };

            return {
                z: function() {
                    var res = baseProto.z.call(this);
                    res.b = this._b;
                    return res;
                }
            }
        });

        C = createClass(B, function(proto, baseProto) {
            proto.init = function(props) {
                baseProto.init.call(this, props);
                this._c = props.c;
            };

            proto.z = function() {
                var res = baseProto.z.call(this);
                res.c = this._c;
                return res;
            };
        });

        a1 = new A({a: 1});
        a2 = A({a: 2});
        a3 = A(a2);

        b1 = new B({a: 1, b: 1});
        b2 = B({a: 2, b: 2});
        b3 = B(b2);

        c1 = new C({a: 1, b: 1, c: 1});
        c2 = C({a: 2, b: 2, c: 2});
        c3 = C(c2);
    });

    it('should create named class', function() {
        expect(A.displayName).toEqual('A');
        expect(a1 instanceof A).toBeTruthy();
        expect(a1.z()).toEqual({a: 1});
        expect(a2.z()).toEqual({a: 2});
        expect(a3).toBe(a2);
    });

    it('should create named subclass', function() {
        expect(B.displayName).toEqual('B');
        expect(b1 instanceof B).toBeTruthy();
        expect(b1 instanceof A).toBeTruthy();
        expect(b1.z()).toEqual({a: 1, b: 1});
        expect(b2.z()).toEqual({a: 2, b: 2});
        expect(b3).toBe(b2);
    });

    it.only('should create anonymous subsubclass', function() {
        expect(C.displayName).not.toBeDefined();
        expect(c1 instanceof C).toBeTruthy();
        expect(c1 instanceof B).toBeTruthy();
        expect(c1 instanceof A).toBeTruthy();
        expect(c1.z()).toEqual({a: 1, b: 1, c: 1});
        expect(c2.z()).toEqual({a: 2, b: 2, c: 2});
        expect(c3).toBe(c2);
    });
});
