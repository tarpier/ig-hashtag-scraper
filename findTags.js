module.exports = input => {
    let tags = [];
    let comments = input.map( element => element.comments );
    
    comments.map( elementsArray => {
        elementsArray.map( element =>{
            let tag = element.match(/#[\u00c4\u00e4\u00d6\u00f6\u00dc\u00fc\u00dfa-zA-Z0-9]*/g)
            if(tag) {
                tags.push(tag)    
            } 
        })
    })
    //flatten array
    tags = [].concat.apply([], tags)
    
    //throw out duplicates & sort by occurence
    let uniq = tags
    .map((tag) => {
        return {count: 1, tag: tag}
    })
    .reduce((a, b) => {
        a[b.tag] = (a[b.tag] || 0) + b.count
        return a
    }, {})

    let sorted = Object.keys(uniq).sort((a, b) => uniq[a] < uniq[b])

    return sorted;
}