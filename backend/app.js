const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const HttpError = require('./models/http-error');
const userRoutes = require('./routes/user-routes');
const partyRoutes = require('./routes/party-routes');

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

app.use('/img-uploads', express.static(path.join('img-uploads')));

app.use((req, res, next)=> {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use(userRoutes);
app.use('/parties', partyRoutes);

app.use((req, res, next)=> {
    const error = new HttpError('Cannot find this route', 404);
    throw error;
});

app.use((error, req, res, next)=> {
    if (req.file) {
        fs.unlink(req.file.path, err => console.log(err));
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
});

mongoose
    .connect('mongodb+srv://davegb313:Goldberg313@cluster.aa0z4.mongodb.net/Cluster?retryWrites=true&w=majority')
    .then(()=> {
        app.listen(port, () => console.log(`example on port ${port}`));
    })
    .catch()