const express = require('express');
const hbs = require('hbs')
const path = require('path');
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

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Deepak Kumar',
        errorMessage: 'Page not found.'
    })
})

// // Middleware for handling unmatched routes
// app.use((req, res) => {
//     res.status(404).send('404 - Page Not Found');
// });

var server = app.listen(port, () => {
    var host = server.address().address;    
    console.log(`Server is running at address ${host} on port ${port}`);
});
