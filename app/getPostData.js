const Nightmare = require('nightmare')

module.exports = async (urls) => {
    let postData = []
    for (i in urls) {
        console.log(`getting postdata of: ${urls[i]}`)
        const nightmare = Nightmare({
            show: true
        });

        const singlePostData = await nightmare
            .goto(urls[i])
            //.wait('._mo9iw')
            .wait(2)
            .evaluate(() => {
                if (document.querySelector('._4zhc5.notranslate._lx2l2')) {
                    //under 10 likes -> so likers are shown by name/profile link
                    const likers = [...document.querySelectorAll('._4zhc5.notranslate._lx2l2')]
                        .map((el) => el.href)
                    return { likes: likers.length, likedBy: likers }
                } else if (document.querySelector('._9jphp')) {
                    //this is video/boomerang/gif(?) stuff -> no likes but # of plays are shown
                    const plays = document.querySelector('._9jphp span').textContent
                    return { plays: plays }
                } else {
                    //over 10 likes -> instagram shows something like "liked xxx times"
                    const likes = document.querySelector('._tf9x3 span').textContent
                    return { likes: likes }
                }
            })
            //.end()
            .catch((err) => console.error(err))

        /*const commentsOnPost = await nightmare
        .goto(urls[i])
        //.wait('._mo9iw')
        .wait(2)
        .evaluate(() => {
            return [...document.querySelectorAll('._nk46a span')]
                .map( (el) => el.textContent)
        })
        .end()
        .catch((err) => console.error(err))

        const commentatorsOnPost = await nightmare
        .goto(urls[i])
        //.wait('._mo9iw')
        .wait(2)
        .evaluate(() => {
            return [...document.querySelectorAll('._nk46a ._4zhc5')]
                .map( (el) => el.title)
        })
        .end()
        .catch((err) => console.error(err))*/

        postData.push({
            posturl: urls[i],
            postdata: singlePostData/*,
            commentators: commentatorsOnPost,
            comments: commentsOnPost*/
        })

    }
    console.log('done getting post data')
    return postData;
}