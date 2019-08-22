const express = require('express');
const app = express();
const cors = require('cors');
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

app.locals.title = 'Palette Picker';
app.use(cors());

app.get('/', (req, response) => {
  response.send('Oh hey Palette Picker');
});

app.get('/api/v1/projects', (req, res) => {
  database('projects')
  .select()
  .then(projects => {
    if(!projects.length) {
      res.status(404).json("No projects found")
    } else {
    res.status(200).json(projects)
    }
  })
});

app.get('/api/v1/projects/:id', (req, res) => {
  database('projects')
  .where({id: req.params.id})
  .select()
  .then(project => {
    res.status(200).json(project)
  })
});

app.get('/api/v1/palettes', (req, res) => {
  database('palettes')
  .select()
  .then(palettes => {
    if(!palettes.length) {
      res.status(404).json('No palettes found')
    } else {
    res.status(200).json(palettes)
    }
  })
});

app.get('/api/v1/projects/:id/palettes', (req, res) => {
  database('palettes').where('project_id', req.params.id)
  .select()
  .then(palettes => {
    if(!palettes.length) {
      res.status(404).json('No palettes found')
    } else {
    res.status(200).json(palettes)
    }
  })

  app.post('/api/v1/projects', (req, res) => {
    const project = req.body
    database('projects')
    .insert(project, 'id')
    .then(project => {
      res.status(201).json({ id: project[0] })
    })
  })

  app.post('/api/v1/palettes', (req, res) => {
    const palette = req.body
    database('palettes')
    .insert(palette, 'id')
    .then(palette => {
      res.status(201).json({ id: palette[0] })
    })
  })



  
});





module.exports = app;

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