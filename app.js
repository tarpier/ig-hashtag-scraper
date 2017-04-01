var Nightmare = require('nightmare')
var vo = require('vo')
var fs = require('fs')

let findTags = require('./findTags')
let findUsers = require('./findUsers')

var a = []
var user = ''

if(process.argv[2] !== undefined){
    user = process.argv[2]
} else {
    console.log ('Please provide a Username');
    process.exit();
}


vo(function* () {
    var nightmare = Nightmare({
        show: true
    });

    let imgSources = yield nightmare
        .goto(`https://www.instagram.com/${user}/`)
        .wait('._8imhp')
        .click('._8imhp')
        .evaluate(function () {
            return Array.from(document.querySelectorAll('._8mlbc')).map(element => element.href);
        })

    for (src in imgSources) {
        yield nightmare.goto(imgSources[src])
            // here should be some kind of check if the links have worked
            .wait('h1') 
            .evaluate(function () {
                //is there a show all link? ._l086v._ifrvy
                let input = Array.from(document.querySelectorAll('._nk46a span')).map(element => element.textContent);
                return input;
            })
            .then(result => {
                //console.log(result)
                a.push({
                    post: imgSources[src],
                    comments: result
                });
            });
    }

    yield nightmare.end();

})(function (err) {
    if (err) {
        console.log('caught', err);
    } else {
        //console.log('done', a);
        if (!fs.existsSync(`data/${user}`)) {
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
        })
    }
});