var express = require('express');
var jwt = require('jsonwebtoken');

const app = express();

app.use(express.static(__dirname+'/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname+'index.html');
})

app.get('/api', function(req, res) {
    res.json({
        text: 'my api!'
    });
});

app.get('/api/login', function(req, res) {
    //auth user
    const user = {id: 3};
    const token = jwt.sign({user}, 'my_secret_key');
    res.json({
        token: token
    });
});

// app.get('/api/protective', function(req, res) {
app.get('/api/protective', ensureToken ,function(req, res) {

    jwt.verify(req.token, 'my_secret_key', function(err, data) {
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({
                text: 'this is protective api!',
                data: data
            });
        }
    });
});

//This is a middleware
function ensureToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else{
        res.sendStatus(403);
    }
}

app.listen(3000, function() {
    console.log('App listening on port 3000!');
})