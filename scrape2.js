const getStats = require('./app/getstats');
const getPosts = require('./app/getPosts');
const getPostData = require('./app/getPostData')




getStats('tarpier')
    .then(a => console.dir( a))
    .then(() => getPosts('tarpier'))
        //.then(a => console.dir(a))
        .then((urls) => getPostData(urls))
        .then((a) => console.log(require('util').inspect(a, false, null)))
