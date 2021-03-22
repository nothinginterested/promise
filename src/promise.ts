class Promise2 {
    success = null;
    fail = null;
    state = 'pending';
    callbacks = [];

    then(success?, fail?) {
        let handle = [];
        if (typeof success === 'function') {
            handle[0] = success;
        }
        if (typeof fail === 'function') {
            handle[1] = fail;
        }
        handle[2] = new Promise2(() => {
        });
        this.callbacks.push(handle);

        return handle[2];
    }

    resolve(result) {
        if (this.state !== 'pending') return;
        this.state = 'fulfilled';


        process.nextTick(
            () => {
                this.callbacks.forEach(item => {
                    let x;
                    if (typeof item[0] === 'function') x = item[0].call(undefined, result);
                    console.log('resolve');
                    console.log(x);
                    item[2].resolveWith(x);
                });
            }
            , 0);


    }

    reject(reason) {
        if (this.state !== 'pending') return;
        this.state = 'rejected';
        process.nextTick(
            () => {
                this.callbacks.forEach(item => {
                    let x
                    if (typeof item[1] === 'function') x=item[1].call(undefined, reason);
                    item[2].resolveWith(x)
                });
            }
            , 0);

    }

    constructor(fn) {
        if (typeof fn !== 'function') {
            throw new Error('只要函数');
        }
        fn(this.resolve.bind(this), this.reject.bind(this));
    }

    resolveWith(x) {
        console.log('---');
        console.log(x);

        this.resolve(x);
    }

}


export default Promise2;
