const Nightmare = require('nightmare')
const cheerio = require('cheerio')

const findTags = require('./findTags')
const findUsers = require('./findUsers')
const analyzeImage = require('./analyzeImage')


//TODO: these should return a promise instead of callbacks
const getPostStats = (callback) => {
    if ($('._4zhc5.notranslate._lx2l2').length > 0) {
        //under 10 likes -> so likers are shown by name/profile link
        return callback({
            type: 'post',
            likes: 'under 10'
        })
    } else if ($('._9jphp').length > 0) {
        //this is video/boomerang/gif(?) stuff -> no likes but # of plays are shown
        const plays = $('._9jphp span').text()
        return callback({
            type: 'video',
            plays: plays
        })
    } else {
        //over 10 likes -> instagram shows something like "liked xxx times"
        const likes = $('._tf9x3 span').text()
        return callback({
            type: 'post',
            likes: likes
        })
    }
}

const getImageData = async (imageType, callback) => {
    //differentiate between a "single image post" and video or multi image post
    //TODO get ai tags for other posttypes
    if (imageType === 'post') {
        const imgSrc = $('._jjzlb img').attr('src')
        const imageData = {
            url: imgSrc,
            imageRecognition: await analyzeImage(imgSrc)
        }

        return callback(imageData)
    }
}

const getPostAge = (callback) => {
    return callback($('._379kp').attr('datetime'))
}

const getPostComments = async (callback) => {
    const userDescription = await $('h1 > span').text()
    const mentions = await findUsers(userDescription)
    const hashtags = await findTags(userDescription)
    let comment = {}

    comment.userDescription = userDescription

    if ("undefined" !== typeof mentions) {
        comment.mentions = mentions
    }

    if ("undefined" !== typeof hashtags) {
        comment.hashtags = hashtags
    }
    return callback(comment)
}



module.exports = async (urls) => {
    const postData = []
    for (const url of urls) {

        const singlePostData = {}

        console.log(`getting postdata of: ${url}`)
        const nightmare = Nightmare({
            //show: true
        });

        const singlePostHtml = await nightmare
            .goto(url)
            //.wait('._mo9iw')
            .wait(5)
            .evaluate(() => {
                return document.querySelector('._ksjel').innerHTML
            })
            .end()
            .catch((err) => console.error(err))

        $ = cheerio.load(singlePostHtml);

        singlePostData.postUrl = url

        getPostStats((stats) => {
            singlePostData.postStats = stats
        })

        getPostAge((age) => {
            singlePostData.postAge = age
        })

        getPostComments((comments) => {
            singlePostData.comments = comments
            //TODO: (low prio) get more comments
        })

        getImageData(singlePostData.postStats.type, (imageData) => {
            singlePostData.image = imageData
        })


        postData.push(singlePostData)

    }
    console.log('done getting post data')
    return postData;
}


/*if (document.querySelector('._4zhc5.notranslate._lx2l2')) {
    //under 10 likes -> so likers are shown by name/profile link
    const likers = [...document.querySelectorAll('._4zhc5.notranslate._lx2l2')]
        .map((el) => el.href)
    return { likes: likers.length.toString(), likedBy: likers }
} else if (document.querySelector('._9jphp')) {
    //this is video/boomerang/gif(?) stuff -> no likes but # of plays are shown
    const plays = document.querySelector('._9jphp span').textContent
    return { plays: plays }
} else {
    //over 10 likes -> instagram shows something like "liked xxx times"
    const likes = document.querySelector('._tf9x3 span').textContent
    return { likes: likes }
}*/