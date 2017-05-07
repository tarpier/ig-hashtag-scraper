const Nightmare = require('nightmare')
const cheerio = require('cheerio')

const getPostStats = (callback) => {
    if ($('._4zhc5.notranslate._lx2l2').length > 0) {
        //under 10 likes -> so likers are shown by name/profile link
        return callback({likes: 'under 10'})
    } else if ($('._9jphp').length > 0) {
        //this is video/boomerang/gif(?) stuff -> no likes but # of plays are shown
        const plays = $('._9jphp span').text()
        return callback({ plays: plays })
    } else {
        //over 10 likes -> instagram shows something like "liked xxx times"
        const likes = $('._tf9x3 span').text()
        return callback({ likes: likes })
    }
}

const getPostAge = (callback) => {
    return callback($('._379kp').attr('datetime'))
}


module.exports = async (urls) => {
    let postData = []
    for (let url of urls) {

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

        getPostStats ( (stats) => {
            singlePostData.postStats = stats
        })

        getPostAge ( (age) => {
            singlePostData.postAge = age
        })

        //TODO: get H1 Comment (definitely done by author)
        //TODO: filter hashtags from comment
        //TODO: filter user mentions from comment
        //TODO: (low prio) get more comments


        postData.push({
            data: singlePostData
        })

    }
    console.log('done getting post data')
    return postData;
}





/*postData.push({
            posturl: url,
            postdata: singlePostData,
            commentators: commentatorsOnPost,
            comments: commentsOnPost
        })*/




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