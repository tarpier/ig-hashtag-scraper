
var fs = require('fs')
const util = require('util')

const findTags = require('./findTags')
const findUsers = require('./findUsers')

const getStats = require('./app/getstats')
const getPostUrls = require('./app/getPosts')
const getPostData = require('./app/getPostData')
const writeDataToDrive = require('./app/writeDataToDrive.js')

//TODO does user exist / is it a private user?
var user = ' '
if (process.argv[2] !== undefined) {
    user = process.argv[2]
} else {
    console.log('Please provide a Username')
    process.exit()
}

const userInfo = {
    time: Date.now(),
    stats: {},
    posts: []
}

getStats(user).then((userStats) => {
    userInfo.stats = userStats
    getPostUrls(user).then((urls) => {
        getPostData(urls).then((postData) => {
            userInfo.posts = postData
            writeDataToDrive(user, userInfo)
        })
    })

})




//getPostData(['https://www.instagram.com/p/BTCMauxl8gn/', 'https://www.instagram.com/p/BQ8ZXDTADGO/?taken-by=tarpier', 'avjowieoiojwf']).then( a => console.log(util.inspect(a, true, 10)));