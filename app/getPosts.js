const Nightmare = require('nightmare')

module.exports = async (user) => {
    console.log(`getting postUrls of: ${user}`)
    const nightmare = Nightmare({
        //show: true
    });
    try {
        const postUrls = await nightmare
            .goto(`https://www.instagram.com/${user}/`)
            .wait('._8imhp')
            .click('._8imhp') //TODO what happens when there are too few posts?
            .wait(1)
            .evaluate(() => {
                //does ._76rrx._yo2b4 exist? -> private profile = lets leave
                return [...document.querySelectorAll('._8mlbc')]
                    .map((el, i) => {
                        return el.href;
                    });
            })
            .end()
            .catch((err) => console.error(err))

        return postUrls;

    } catch (e) {
        console.error(e)
        return undefined
    }

}