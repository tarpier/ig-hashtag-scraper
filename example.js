const Nightmare = require('nightmare');
const fs = require('fs');

const nightmare = Nightmare({
  show: true,
  //dock: true
});

nightmare
  .goto('https://www.instagram.com/ackerfestival/')
  .wait('._8imhp')
  .click('._8imhp')
  .evaluate(function () {
    return Array.from(document.querySelectorAll('._8mlbc')).map(element => element.href);
  })
  .end()
  .then((hrefs) => {
    /*fs.writeFile('data/a.json', JSON.stringify(hrefs), (err) => {
      if(err) { 
        console.log(err);
      }
    });*/
    let counter = 1;
    for (a in hrefs) {
      console.log('step ' + counter + ' ' + hrefs[a]);
      counter++;

      nightmare.goto(hrefs[a])
      .title()
      .then( (title) => {
        console.log(title);
      })
    };
  })
  .catch(function (error) {
    console.error('Houston we have a problem:', error);
  });
