var fs = require('fs')

module.exports = (user, data) => {
    if (!fs.existsSync(`data/${user}`)) {
        fs.mkdirSync(`data/${user}`);
    }
    fs.writeFile(`data/${user}/${user}.json`, JSON.stringify(data), (err) => {
        if (err) {
            console.error(err);
        }
    })
}

