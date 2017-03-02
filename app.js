var Nightmare = require('nightmare');
var vo = require('vo');

vo(function* () {
    var nightmare = Nightmare({
        show: true
    });

    let imgSources = yield nightmare
        .goto('https://www.instagram.com/explore/tags/festival/')
        .wait('._8imhp')
        //.click('._8imhp')
        .evaluate(function () {
            return Array.from(document.querySelectorAll('._8mlbc')).map(element => element.href);
        })

    for (src in imgSources) {
        yield nightmare.goto(imgSources[src])
            // here should be some kind of check if the links has worked
            .wait('h1') 
            .evaluate(function () {
                let input = Array.from(document.querySelectorAll('._nk46a span')).map(element => element.textContent);
                //find Hashtags here
                return input;
            })
            .then(result => {
                console.log(result)
            });
    }

    yield nightmare.end();

})(function (err) {
    if (err) {
        console.log('caught', err);
    } else {
        console.log('done');
    }
});