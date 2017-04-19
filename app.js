var Nightmare = require('nightmare')
var vo = require('vo')
var fs = require('fs')

let findTags = require('./findTags')
let findUsers = require('./findUsers')

var a = {}
var user = ''

if (process.argv[2] !== undefined) {
    user = process.argv[2]
} else {
    console.log('Please provide a Username');
    process.exit();
}

vo(function* () {
    var nightmare = Nightmare({
        show: true
    });

    let userStats = yield nightmare
        .goto(`https://www.instagram.com/${user}/`)
        .evaluate(() => {
            return Array.from(document.querySelectorAll('._bkw5z')).map(element => element.innerText);
        })

    console.log(userStats);
    a.userStats = {
        posts: userStats[0],
        followers: userStats[1],
        following: userStats[2]
    };

    const followers = yield nightmare
        .goto(`https://www.instagram.com/${user}/`)
        .evaluate( () => {
            return document.querySelector('a._s53mj > ._bkw5z').title;
        })
        .then( followerCount => {
            console.log('count: ', followerCount)
        })


    let imgSources = yield nightmare
        .goto(`https://www.instagram.com/${user}/`)
        .wait('._8imhp')
        //.click('._8imhp')
        .evaluate(function () {
            return Array.from(document.querySelectorAll('._8mlbc')).map(element => element.href);
        })

    a.posts = [];
    for (src in imgSources) {
        yield nightmare.goto(imgSources[src])
            // here should be some kind of check if the links have worked
            .wait('h1')
            .evaluate(function () {
                //is there a show all link? ._l086v._ifrvy
                let comment = Array.from(document.querySelectorAll('._nk46a span')).map(element => element.textContent);
                return comment;
            })
            .then(result => {
                //console.log(result)
                a.posts.push({
                    postUrl: imgSources[src],
                    comments: result
                });
            });
    }

    yield nightmare.end();

})(function (err) {
    if (err) {
        console.log('caught', err);
    } else {
        console.log(require('util').inspect(a, true, 3));

        fs.writeFile('a.json', JSON.stringify(a));

        //console.log('done', a);
        /*if (!fs.existsSync(`data/${user}`)) {
            fs.mkdirSync(`data/${user}`);
        }
        fs.writeFile(`data/${user}/${user}-general.json`, JSON.stringify({fullcontent: a}), (err) => {
            if(err) { 
                console.log('initial write', err);
            }
        })
        fs.writeFile(`data/${user}/${user}-tags.json`, JSON.stringify({tags: findTags(a) }), err => {
            if(err) { 
                console.log('append for tags', err);
            }
        })
        fs.writeFile(`data/${user}/${user}-users.json`, JSON.stringify({users: findUsers(a) }), err => {
            if(err) { 
                console.log('append for users', err);
            }
        })*/
    }
});