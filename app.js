var Nightmare = require('nightmare')
var vo = require('vo')
var fs = require('fs')

var a = [];
var user = 'derblitz'

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
                a.push(result);    
            });
    }

    yield nightmare.end();

})(function (err) {
    if (err) {
        console.log('caught', err);
    } else {
        console.log('done', a);
        fs.writeFile(`data/${user}.json`, JSON.stringify(a), (err) => {
            if(err) { 
                console.log(err);
            }
        });
    }
});