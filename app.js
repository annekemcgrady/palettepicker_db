const express = require('express');
const app = express();
const cors = require('cors');

app.locals.title = 'Palette Picker';
app.use(cors());

app.get('/', (request, response) => {
  response.send('Oh hey Palette Picker');
});