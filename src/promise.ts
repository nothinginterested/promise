class Promise2 {
    success = null;
    fail = null;
    state = 'pending';
    handle = [];

    then(success?, fail?) {
        if (typeof success === 'function') {
            this.handle[0] = success;
            this.success = success;
        }
        if (typeof fail === 'function') {
            this.handle[1] = fail;
            this.fail = fail;
        }
    }

    resolve(result) {
        if (this.state !== 'pending') return;
        this.state = 'fulfilled';
        setTimeout(
            () => {
                if (typeof this.success === 'function') this.success.call(undefined,result);

            }
            , 0);


    }

    reject(reason) {
        if (this.state !== 'pending') return;
        this.state = 'rejected';
        setTimeout(
            () => {
                if (typeof this.fail === 'function') this.fail.call(undefined,reason);

            }
            , 0);

    }

    constructor(fn) {
        if (typeof fn !== 'function') {
            throw new Error('只要函数');
        }
        fn(this.resolve.bind(this), this.reject.bind(this));
    }

}


export default Promise2;
