const express = require('express');
const app = express();
const cors = require('cors');

app.locals.title = 'Palette Picker';
app.use(cors());

app.get('/', (request, response) => {
  response.send('Oh hey Palette Picker');
});

//REQUIRED ENDPOINTS

//GET PROJECTS
//GET ONE PROJECT BY ID
//GET PALETTES BY PROJECT
//GET ONE PALETTE BY ID
//POST NEW PROJECT
//POST NEW PALETTE (FOR A PROJECT)
//PUT/PATCH ON A PROJECT
//PUT/PATCH ON A PALETTE
//DELETE A PROJECT
//DELETE A PALETTE 