const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: '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' });

//const fs = require('fs');

const prompt = 'create a 1024x1024 image of a cat sitting on a couch';

// openai.complete({
//     engine: 'davinci',
//     prompt: prompt,
//     max_tokens: 100,
//     temperature: 0.7,
//     top_p: 1.0,
//     frequency_penalty: 0.0,
//     presence_penalty: 0.0,
//     n: 1,
//     stop: '\n',
// }).then(response => {
//     const image = response.choices[0].text.trim();
//     const base64Data = image.replace(/^data:image\/png;base64,/, '');
//     fs.writeFile('generated_image.png', base64Data, 'base64', (err) => {
//         if (err) throw err;
//         console.log('Image saved successfully!');
//     });
// }).catch(err => {
//     console.error('Error:', err);
// });


const response = await openai.createImage({
    model: "dall-e-3",
    prompt: "a white siamese cat",
    n: 1,
    size: "1024x1024",
});
image_url = response.data.data[0].url;

const fs = require('fs');
const https = require('https');

https.get(image_url, (res) => {
    const filePath = './cat.jpg';
    const file = fs.createWriteStream(filePath);
    res.pipe(file);
});




// const OpenAI = require('openai');
// const openai = new OpenAI({ apiKey: 'oVZnE4I5B' });


// const prompt = 'create a 1024x1024 image of a cat sitting on a couch';

// const response = await openai.createImage({
//     model: "dall-e-3",
//     prompt: prompt,
//     n: 1,
//     size: "1024x1024",
// });
// image_url = response.data.data[0].url;

// const fs = require('fs');
// const https = require('https');

// https.get(image_url, (res) => {
//     const filePath = './cat.jpg';
//     const file = fs.createWriteStream(filePath);
//     res.pipe(file);
// });




