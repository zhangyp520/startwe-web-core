/**
 * Created by oui on 2016/4/1.
 */
(function (_context) {

    var NPromise, toArr, NPromiseCore;

    toArr = function (obj) {
        var arr = [];
        for (var i = 0; i < obj.length; i++) {
            arr.push(obj[i]);
        }
        return arr;
    };

    NPromiseCore = function () {
        this.state = 'unfulfilled';
        this.thenList = [];
        this.params = [];
    };

    NPromiseCore.prototype = {
        _complete: function () {
            var self = this;
            setTimeout(function () {
                var _o, state = self.state;
                while (_o = self.thenList.shift()) {
                    var re, err = null,
                        isPromise = false,
                        next = _o.nextPromise;
                    if ('function' == typeof _o[state]) {
                        try {
                            re = _o[state].apply(null, self.params);
                        } catch (e) {
                            err = e;
                        }
                        if (isPromise = (re && 'function' == typeof re.then)) {
                            (function (_o) {
                                re.then(function (p) {
                                    next._resolve(p);
                                }, function (p) {
                                    next._reject(p);
                                });
                            })(_o);
                        }
                        if (err) {
                            next._reject(err);
                        } else if (!isPromise) {
                            next._resolve(re);
                        }
                    } else {
                        next['resolved' == state ? '_resolve' : '_reject'].apply(next, self.params);
                    }
                }
            }, 0);
        },
        _then: function (fun1, fun2) {
            var nextPromise = new NPromiseCore();
            this.thenList.push({
                resolved: fun1,
                rejected: fun2,
                nextPromise: nextPromise
            });
            //������ǳ�ʼ״̬��ִ����ɶ���
            'unfulfilled' != this.state && this._complete();
            return nextPromise;
        },
        _change: function (type, params) {
            //ֻ�г�ʼ״̬�Ž�һ���ı�״̬
            if (this.state !== 'unfulfilled') {
                return;
            }
            this.state = type;
            this.params = params;
            this._complete();
        },
        _resolve: function (param) {
            this._change('resolved', [param]);
            return this;
        },
        _reject: function (param) {
            this._change('rejected', [param]);
            return this;
        }
    };

    NPromise = function (fun) {
        var core;
        if (fun instanceof NPromiseCore) {
            core = fun;
        } else if (fun instanceof Function) {
            core = new NPromiseCore();
            fun(function (param) {
                core._resolve(param);
            }, function (param) {
                core._reject(param);
            });
        } else {
            throw new Error('Promise constructor takes a function argument');
        }

        this.then = function (fun1, fun2) {
            var _nextCore = new NPromiseCore();
            core._then(function (param) {
                _nextCore._resolve(param);
            }, function (param) {
                _nextCore._reject(param);
            });
            var _next = _nextCore._then(fun1, fun2);
            var next = new NPromise(_next);
            return next;
        }

        this['catch'] = function (fun2) {
            return this.then(null, fun2);
        }
    };

    NPromise.all = function (list) {
        var core = new NPromiseCore();
        var ok = 0,
            allOk = list.length,
            _promise = new NPromise(core),
            reList = [],
            anyReject = false;
        if (!list || list.length == 0) {
            core._resolve();
        }
        for (var i = 0; i < list.length; i++) {
            var prms = list[i];
            (function (i) {
                prms.then(function (p) {
                    ok++;
                    reList[i] = p;
                    if (ok == allOk) {
                        core._resolve(reList)
                    }
                }, function (p) {
                    core._reject(p);
                });
            })(i);
        }
        ;
        return _promise;
    };

    NPromise.resolve = function (p) {
        var core = new NPromiseCore();
        var _promise = new NPromise(core);
        if (p && 'function' == typeof p.then) {
            p.then(function (p) {
                core._resolve(p);
            }, function (p) {
                core._reject(p);
            });
        } else {
            core._resolve(p);
        }
        return _promise;
    };

    NPromise.reject = function (p) {
        var core = new NPromiseCore();
        var _promise = new NPromise(core);
        if (p && 'function' == typeof p.then) {
            p.then(function (p) {
                core._resolve(p);
            }, function () {
                core._reject(p);
            });
        } else {
            core._reject(p);
        }
        return _promise;
    };

    NPromise.cast = function (p) {
        if (p && 'function' == typeof p.then) {
            return p;
        }
        ;
        var core = new NPromiseCore();
        var _promise = new NPromise(core);
        core._resolve(p);
        return new NPromise(core);
    };

    NPromise.race = function (list) {
        var core = new NPromiseCore();
        var _promise = new NPromise(core);
        var anyChange = false;
        for (var i = 0; i < list.length; i++) {
            list[i].then(function (p) {
                (!anyChange) && core._resolve(p);
                anyChange = true;
            }, function (p) {
                (!anyChange) && core._reject(p);
                anyChange = true;
            });
        }
        return _promise;
    };

    if (_context.Promise) {
        _context.Promise.NimanPromise = NPromise;
    } else {
        NPromise.NimanPromise = NPromise;
        _context.Promise = NPromise;
    }

    //-----------------------------------------ģ��-----------------------------------------//

    //if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
    //    //node.js
    //    module.exports = NPromise;
    //} else if (typeof define === 'function') {
    //    //CommonJS
    //    define(function (require, exports, module) {
    //        module.exports = NPromise;
    //    });
    //} else {
        //window
        //if(!_context.Promise){//�ж�������Ƿ�֧��Promise
        //    _context.Promise = NPromise;
        //}
    //}

})(window);








