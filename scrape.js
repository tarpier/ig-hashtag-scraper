
var vo = require('vo')
var fs = require('fs')

const findTags = require('./findTags')
const findUsers = require('./findUsers')

const getStats = require('./app/getstats')
const getPostUrls = require('./app/getPosts')
const getPostData = require('./app/getPostData')
const writeDataToDrive = require ('./app/writeDataToDrive.js')

var user = '';

if (process.argv[2] !== undefined) {
    user = process.argv[2]
} else {
    console.log('Please provide a Username');
    process.exit();
}

const util = require('util')


getPostUrls(user)
    //.then( b => console.log(b.postUrls))
    .then( a => getPostData(a.postUrls))
    .then( b => {
        console.log(util.inspect(b, true, 10))
        writeDataToDrive(user, b)
})


//getPostData(['https://www.instagram.com/p/BTCMauxl8gn/', 'https://www.instagram.com/p/BQ8ZXDTADGO/?taken-by=tarpier', 'avjowieoiojwf']).then( a => console.log(util.inspect(a, true, 10)));