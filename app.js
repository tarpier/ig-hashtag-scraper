const getStats = require('./app/getstats');
const getPosts = require('./app/getPosts');
const getPostData = require('./app/getPostData')
const argv = require('minimist')(process.argv.slice(2));

const scrapeProfile = async (users) => {
    //TODO make this work typeof userName === array
    output = []
    for (user of users) {
        const userName = user
        const stats = await getStats(userName)
        const postUrls = await getPosts(userName)
        const postData = await getPostData(postUrls)

        output.push({
            scrapingDate: Date.now(),
            username: userName,
            stats: stats,
            posts: postData
        })
    }
    return output;
}


if (typeof argv._ == undefined || argv._.length < 1) {
    console.log('Please provide one or more username(s)')
    process.exit()
}

scrapeProfile(argv._)
    .then((data) => {
        console.log(require('util').inspect(data, false, null))
    })