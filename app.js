const getStats = require('./app/getstats');
const getPosts = require('./app/getPosts');
const getPostData = require('./app/getPostData')
const writeDataToDrive = require('./app/writeDataToDrive')
const argv = require('minimist')(process.argv.slice(2));

const scrapeProfile = async (users) => {
    output = []
    for (user of users) {
        const userName = user
        const stats = await getStats(userName)
        const postUrls = await getPosts(userName)
        const postData = await getPostData(postUrls)

        singleUserData = {
            scrapingDate: Date.now(),
            username: userName,
            stats: stats,
            posts: postData
        }
        output.push(singleUserData)
        writeDataToDrive(userName, singleUserData)
    }
    return output;
}


if (typeof argv._ == undefined || argv._.length < 1) {
    console.log('Please provide one or more username(s)')
    process.exit()
}

scrapeProfile(argv._)
    .then((data) => {
        console.log('output done')
    })