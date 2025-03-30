const express = require('express');

const app = express();

const MOVIE_DETAILS = [
    {
        name:'Movie Name 1',
        yearRelease: 2021
    },
    {
        name:'Movie Name 2',
        yearRelease: 2025
    }
];

// middleware: 

app.use((req, res, next) => {
    console.log('Executing Middleware Code'); // Real world applications would have the authentication code here
    next();
})

app.get('/api/get', (req, res)=> {
    console.log('Executing Route Handler Code'); 
    res.send(MOVIE_DETAILS);
})

const PORT_NUMBER = 3001;
app.listen(PORT_NUMBER, () => {
    console.log(`Server Started on port ${PORT_NUMBER}`);
})