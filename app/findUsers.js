module.exports = input => {
    let users = [];

    let user = input.match(/@[\u00c4\u00e4\u00d6\u00f6\u00dc\u00fc\u00dfa-zA-Z0-9_\.]*/g)
    if (user) {
        users.push(user)
    }

    if(!users.length > 0){
        return undefined
    }

    //flatten array
    users = [].concat.apply([], users)

    //throw out duplicates & sort by occurence
    let uniq = users
        .map((user) => {
            return { count: 1, user: user }
        })
        .reduce((a, b) => {
            a[b.user] = (a[b.user] || 0) + b.count
            return a
        }, {})

    let sorted = Object.keys(uniq).sort((a, b) => uniq[a] < uniq[b])

    return sorted;
}