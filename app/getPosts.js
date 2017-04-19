const Nightmare = require('nightmare')

module.exports = async (user) => {
    console.log(`getting postUrls of: ${user}`)
    const nightmare = Nightmare({
        show: true
    });
    try {
        const postUrls = await nightmare
            .goto(`https://www.instagram.com/${user}/`)
            .wait('._8imhp')
            //.click('._8imhp')
            .wait(1)
            .evaluate(() => {
                return [...document.querySelectorAll('._8mlbc')]
                    .map((el, i) => {
                        return el.href;

                    });
            })
            .end()
            .catch((err) => console.error(err))

        return { postUrls: postUrls };

    } catch (e) {
        console.error(e)
        return undefined
    }

}