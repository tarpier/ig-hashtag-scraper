const getStats = require('./getstats')
const getPostUrls = require('./getPosts')
const getPostData = require('./getPostData')
const writeDataToDrive = require('./writeDataToDrive.js')

module.exports = ((users) => {
    for (user of users) {
        const userInfo = {
            time: Date.now(),
            username: user,
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
    }
})
