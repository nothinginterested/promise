import * as chai from 'chai';
import * as sinon from 'sinon';
import Promise from '../src/promise';

const assert = chai.assert;
const expert = chai.expect;
describe('Promise', () => {
    it('是一个类', () => {
        // assert.isFunction(Promise)
        assert.isObject(Promise.prototype);
    });
    it('new Promise 如果接受不是一个函数就报错', () => {
        assert.throw(
            () => {
                // @ts-ignore
                new Promise();
            }
        );
        assert.throw(
            () => {
                // @ts-ignore
                new Promise(1);
            }
        );
        assert.throw(
            () => {
                // @ts-ignore
                new Promise(false);
            }
        );

    });

    it('new Promise会生成一个对象有then方法', () => {
        const promise = new Promise(() => {
        });
        assert.isFunction(promise.then);
    });
    it('new Promise（fn）中fn会立即执行', () => {
        let fn = sinon.fake();
        new Promise(fn);
        assert(fn.called);
    });
    it('new Primise执行的时候会接受resolve reject两个函数', done => {
        new Promise((res, rej) => {
            assert.isFunction(res);
            assert.isFunction(rej);
            done();
        });
    });


    it('promise.then(success) 中的 success 会在 resolve 被调用的时候执行', (done) => {
        const success = sinon.fake();
        const promise = new Promise((res, rej) => {

            assert.isFalse(success.called);
            res();
            setTimeout(() => {
                assert.isTrue(success.called);
                done();
            });

        });
        // @ts-ignore
        promise.then(success);
    });


    it('promise.then(null,fail) 中的 fail 会在 resolve 被调用的时候执行', (done) => {
        const success = sinon.fake();
        const promise = new Promise((res, rej) => {

            assert.isFalse(success.called);
            res();
            setTimeout(() => {
                assert.isTrue(success.called);
                done();
            });

        });
        // @ts-ignore
        promise.then(success);
    });
    it('2.2.1 onFulfilled和onRejected都是可选的参数：', () => {
        const promise = new Promise(resolve => {
            resolve();
        });
        promise.then(false, null);
        assert(1 === 1);
    });
    it('2.2.2 如果onFulfilled是函数', done => {
        const succeed = sinon.fake();
        const promise = new Promise(resolve => {
            assert.isFalse(succeed.called);
            resolve(233);
            resolve(2333);
            setTimeout(() => {
                assert(promise.state === 'fulfilled');
                assert.isTrue(succeed.calledOnce);
                assert(succeed.calledWith(233));
                done();
            });
        });
        promise.then(succeed);
    });
    it('2.2.3 如果onRejected是函数', done => {
        const fail = sinon.fake();
        const promise = new Promise((resolve, reject) => {
            assert.isFalse(fail.called);
            reject(233);
            reject(2333);
            setTimeout(() => {
                assert(promise.state === 'rejected');
                assert.isTrue(fail.calledOnce);
                assert(fail.calledWith(233));
                done();
            });
        });
        promise.then(null, fail);
    });
    it('2.2.4 在我的代码执行完之前，不得调用 then 后面的俩函数', done => {
        const succeed = sinon.fake();
        const promise = new Promise(resolve => {
            resolve();
        });
        promise.then(succeed);
        assert.isFalse(succeed.called);
        setTimeout(() => {
            assert.isTrue(succeed.called);
            done();
        }, 0);
    });
    it('2.2.4 失败回调', done => {
        const fn = sinon.fake();
        const promise = new Promise((resolve, reject) => {
            reject();
        });
        promise.then(null, fn);
        assert.isFalse(fn.called);
        setTimeout(() => {
            assert.isTrue(fn.called);
            done();
        }, 10);
    });
    it('2.2.5 onFulfilled和onRejected必须被当做函数调用', done => {
        const promise = new Promise(resolve => {
            resolve();
        });
        promise.then(function () {
            'use strict';
            assert(this === undefined);
            done();
        });
    });

    it('2.2.7 then必须返回一个promise', () => {
        const promise = new Promise(() => {
        });
        const promise2 = promise.then();
        // @ts-ignore
        assert(promise2 instanceof Promise);
    });
    it('2.2.6 then可以在同一个promise里被多次调用', done => {
        const promise = new Promise(resolve => {
            resolve();
        });
        const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()];
        promise.then(callbacks[0]);
        promise.then(callbacks[1]);
        promise.then(callbacks[2]);
        setTimeout(() => {
            assert(callbacks[0].called);
            assert(callbacks[1].called);
            assert(callbacks[2].called);
            assert(callbacks[1].calledAfter(callbacks[0]));
            assert(callbacks[2].calledAfter(callbacks[1]));
            done();
        });
    });
    it('2.2.7.1  onFulfilled 返回的值x 运行[reslove](promise2,x)', done => {
        const promise = new Promise((reslove) => {
            reslove(333);
        });
        promise.then(res => {
            assert.equal(res, 333);
            return '成功';
        }).then(result => {
            assert.equal(result, '成功');
            done();
        });

    });

    it('2.2.7.1 success 返回值是一个promise实例',(done)=>{
        const promise1 = new Promise(resolve => {
            resolve();
        });
        const fn = sinon.fake();
        const promise2 = promise1.then(
            /*s1 */ () => new Promise(resolve => resolve())
        );
        promise2.then(fn);
        setTimeout(() => {
            assert(fn.called);
            done();
        });
    })
    it("2.2.7.1.2 success 的返回值是一个 Promise 实例，且失败了", done => {
        const promise1 = new Promise(resolve => {
            resolve();
        });
        const fn = sinon.fake();
        const promise2 = promise1.then(
            /*s1 */ () => new Promise((resolve, reject) => reject())
        );
        promise2.then(null, fn);
        setTimeout(() => {
            assert(fn.called);
            done();
        });
    });

    it('x 与 promise引用同一个对象，抛出错误', done => {
        const promise = new Promise(resolve => {
            resolve();
        }).then(res => promise, null);
        promise.then(null, reason => {
            assert(reason instanceof TypeError);
            done();
        });
        // throw new Error()
    });


});

