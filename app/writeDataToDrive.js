const fs = require('fs')
const now = Date.now()

module.exports = (user, data) => {
    if (!fs.existsSync(`data/${user}`)) {
        fs.mkdirSync(`data/${user}`);
    }
    fs.writeFile(`data/${user}/${user}-${now}.json`, JSON.stringify(data), (err) => {
        if (err) {
            console.error(err);
        }
    })
}

