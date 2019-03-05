const webpackHotMiddleware = require('webpack-hot-middleware');

function middleware(doIt, req, res) {
    const originalEnd = res.end;
    return new Promise((resolve, reject) => {
        res.end = function() {
            originalEnd.apply(this, arguments);
            resolve(false);
        };
        doIt(req, res, function next() {
            // 走到这里说明 hot-middleware 并没有做处理，因此要进入next中间件
            resolve(true)
        });
    })
}

module.exports = function(compiler, option) {
    const action = webpackHotMiddleware(compiler, option);
    return function (ctx, next) {
        const nextStep = await middleware(action, ctx.req, ctx.res);
        if (nextStep && next) {
            next();
        }
    };
};
