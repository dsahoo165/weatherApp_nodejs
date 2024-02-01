const { OpenAI } = require("openai");
const fs = require('fs');
const https = require('https');
//#region 
//const apiKey = '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'; // Replace with your OpenAI API key
const apiKey = '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'
//#endregion
const openai = new OpenAI({ apiKey });


function downloadImage(url, destination) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);

    https.get(url, (response) => {
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });

      file.on('error', (err) => {
        fs.unlink(destination, () => reject(err));
      });
    }).on('error', (err) => {
      fs.unlink(destination, () => reject(err));
    });
  });
}

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs')
const path = require('path');
const sharp = require('sharp');
const app = express();
const port = 3000; 

// Define paths for Express config  
const publicDirectoryPath = path.join(__dirname, '/public');
const viewsPath = path.join(__dirname, '/templates/views');
const partialsPath = path.join(__dirname, '/templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');  
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);  

// Setup static directory to serve  
app.use(express.static(publicDirectoryPath));   
app.use(bodyParser.json());

// app.get('/', (req, res) => { 
//     //print the viewPath 
//     console.log(viewsPath, "viewsPath"); 
//     res.send('Server is up! Go ahead');
// });

app.get('/', (req, res) => {
    
    res.render('index', { 
        title: 'Home Page', 
        name: 'Deepak Kumar' 
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Deepak Kumar'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Andrew Mead'
    })
})


app.post("/generateIMG", async (req, res) => {
    try {

        let prompt = req.body.prompt;
        //console.log(req, "req.body");
        // Generate sample JSON data
        const jsonData = {
            location: prompt,
            img:""
        };        
        if (prompt) {


            const response = await openai.images.generate({
                model: "dall-e-2",// Update with the appropriate model name
                prompt,
                n: 1,
                quality:"hd",
                size:"512x512"
            });

            const imageUrl = response.data[0].url;                        
            console.log(imageUrl, "imageUrl");

            //Download image
            var randomValue = Math.floor(Math.random() * 1000000) + 1;
            var imageName = 'public/img/' + randomValue + '.png';
            await downloadImage(imageUrl, imageName);
            jsonData.img = "/img/" + randomValue + '.png';           
            
            res.status(200).json(jsonData);
        } else {
            const jsonData = {
                location: "No prompt found",
                img:""
            };
            res.status(200).json(jsonData);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

app.post("/editIMG", async (req, res) => {
    //try {
        const imagePathInRequest = req.body.img;
        const imageNameToEdit = imagePathInRequest.substring(imagePathInRequest.lastIndexOf("/") + 1);
        const imagePath = 'public/img/' + imageNameToEdit;
        const prompt = req.body.prompt;
        
        console.log(imagePathInRequest, "req.body.img");
        
        const jsonData = {
            location: prompt,
            img:""
        };        
        if (prompt) {           

            console.log(imagePath, "imagePath")

            // Load the image using sharp
            const image = sharp(imagePath);

            // Convert the image to RGBA format
            const rgbaImageData = await image.ensureAlpha().raw().toBuffer();

            // Compress the image data
            const compressedImageData = await sharp(rgbaImageData)
                .resize({ width: 512 })
                .toBuffer();

            const response = await openai.images.edit({
                //image: fs.createReadStream(imagePath),              
                image: compressedImageData,
                prompt: prompt,
                model: "dall-e-2",
                n: 1,                
                size:"512x512"
              });

            const imageUrl = response.data[0].url;
            console.log(imageUrl, "imageUrl");

            //Download image
            var randomValue = Math.floor(Math.random() * 1000000) + 1;
            var imageName = 'public/img/' + randomValue + '.png';
            await downloadImage(imageUrl, imageName);
            jsonData.img = "/img/" + randomValue + '.png';           
            
            res.status(200).json(jsonData);
        } else {
            const jsonData = {
                location: "No prompt found",
                img:""
            };
            res.status(200).json(jsonData);
        }
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: "Something went wrong" });
    // }
});


app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Deepak Kumar',
        errorMessage: 'Page not found.'
    })
})



app.post("/generateIMG").post(async (req, res) => {
    try {
      const { prompt } = req.body;
  console.log(req.body, "req.body");
    //   const response = await openai.createImage({
    //     prompt,
    //     n: 1,
    //     size: "1024x1024",
    //     response_format: "b64_json",
    //   });
  
    //   const image = response.data.data[0].b64_json;
  
      res.status(200).json({ location: "image" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Deepak Kumar',
        errorMessage: 'Page not found.'
    })
})

// Middleware for handling unmatched routes
app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

var server = app.listen(port, () => {
    var host = server.address().address;    
    console.log(`Server is running at address ${host} on port ${port}`);
});
