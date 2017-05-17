const Clarifai = require('clarifai');
const dotenv = require('dotenv');
dotenv.load()

const app = new Clarifai.App(
    process.env.CLARIFAI_CLIENTID,
    process.env.CLARIFAI_CLIENTSECRET
);

module.exports = async imageUrl => {
    let imageContents = []
    try {
        const imageAnalysis = await app.models.predict(Clarifai.GENERAL_MODEL, imageUrl)
        const tags = imageAnalysis.outputs[0].data.concepts
        for (tag of tags) {
            imageContents.push({
                tag: tag.name,
                propability: tag.value
            })
        }
    } catch (err){
        console.log('There was an error retrieving data for the image', err)
        return undefined
    }
    return imageContents
}