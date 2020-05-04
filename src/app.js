const path = require('path');
const express = require('express');
const hbs = require('hbs');
const router = require('./routers/routers')
const bodyParser = require('body-parser');

const dbModels = require('./models/dbModels');

hbs.registerHelper('for', function(from, to, incr, block) {
    var accum = '';
    for(var i = from; i < to; i += incr)
        accum += block.fn(i);
    return accum;
});

hbs.registerHelper('modulus2', function(index) {
    if( index % 2) {
        return true;
    } else {
        return false;
    }
});

hbs.registerHelper('matchIndex', (index1, index2) => {
    console.log(index1);
    console.log(index2);
    return index1 == index2;
});

hbs.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});

const init = async () => {
    await dbModels.UserInfo.sync({force: true});
    console.log('Tables have synced!');
}

init();

const app = express();
const port = process.env.PORT || 5000;

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.use(express.static(publicDirectoryPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.urlencoded());

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.json());
app.use(router);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});