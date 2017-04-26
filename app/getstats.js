const Nightmare = require('nightmare')

//TODO does user exist / is it a private user?
module.exports = async (user) => {
    console.log(`getting followers of: ${user}`)
    const nightmare = Nightmare({
        show: true
    });
    try {
        const stats = await nightmare
            .goto(`https://www.instagram.com/${user}/`)
            .evaluate( () => {
                return [...document.querySelectorAll('._bkw5z')]
                    .map( (el, i) => {
                        if(i == 1){
                            return el.title
                        }else{
                            return el.textContent;
                        }
                    });
            })
            .end()
            .catch( (err) => console.error(err))
            
            return {posts: stats[0], followers: stats[1], following: stats[2]};
            
    } catch (e) {
        console.error(e)
        return undefined
    }

}