const express = require("express");
const app = express();
const cors = require("cors");
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);

app.locals.title = "Palette Picker";
app.use(express.json());
app.use(cors());

app.get("/", (req, response) => {
  response.send("Welcome to Palette Picker");
});

app.get("/api/v1/projects", (req, res) => {
  database("projects")
    .select()
    .then(projects => {
      if (!projects.length) {
        res.status(404).json("No projects found");
      } else {
        res.status(200).json(projects);
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

app.get("/api/v1/projects/:id", (req, res) => {
  database("projects")
    .where({ id: req.params.id })
    .select()
    .then(project => {
      if (!project.length) {
        res.status(404).json("No project with this id found");
      } else {
        res.status(200).json(project);
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

app.get("/api/v1/palettes", (req, res) => {
  database("palettes")
    .select()
    .then(palettes => {
      if (!palettes.length) {
        res.status(404).json("No palettes found");
      } else {
        res.status(200).json(palettes);
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

app.get("/api/v1/projects/:id/palettes", (req, res) => {
  database("palettes")
    .where("project_id", req.params.id)
    .select()
    .then(palettes => {
      if (!palettes.length) {
        res.status(404).json("No palettes found");
      } else {
        res.status(200).json(palettes);
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    })
  });

  app.post("/api/v1/projects", (req, res) => {
    const project = req.body;
    for (let requiredParameter of ["name"]) {
      if (!project[requiredParameter]) {
        return res
          .status(422)
          .send({
            error: `Expected format: { name: <String> } You're missing a "${requiredParameter}" property.`
          });
      }
    }

    database("projects")
      .insert(project, "id")
      .then(project => {
        res.status(201).json({ id: project[0] });
      });
  });


  //not adding a project id 
  app.post("/api/v1/palettes", (req, res) => {
    const palette = req.body;

    for (let requiredParameter of [
      "name",
      "color_one",
      "color_two",
      "color_three",
      "color_four",
      "color_five",
      "project_id"
    ]) {
      if (!palette[requiredParameter]) {
        return res
          .status(422)
          .send({
            error: `Expected format: { name: <String>, color_one: <String>, color_two: <String>, color_three: <String>, color_four: <String>, color_five: <String>, project_id: <Integer>} You're missing a "${requiredParameter}" property.`
          });
      }
    }

    database("palettes")
      .insert(palette, "id")
      .then(palette => {
        res.status(201).json({ id: palette[0] });
      })
      .catch(error => {
        res.status(500).json({ error });
      });
  });

  app.patch("/api/v1/projects/:id", (req, res) => {
    if(!req.body.name) {
      res.status(422).json('A name is required')
    } else {
    database("projects")
      .where("id", req.params.id)
      .update(req.body)
      .then(project => {
        res.status(201).json({id: project});
      })
      .catch(error => {
        res.status(500).json({ error });
      });
    }
  });

  //not sending correct msg when no req body
  app.patch("/api/v1/palettes/:id", (req, res) => {
    if(!req.body) {
      res.status(422).json('A request body is required')
    }

    database("palettes")
      .where("id", req.params.id)
      .update(req.body)
      .then(palette => {
        res.status(201).json({id: palette});
      })
      .catch(error => {
        res.status(500).json({ error });
      });
  });

  app.delete("/api/v1/projects/:id", (req, res) => {
    database("projects")
        .where("id", req.params.id)
        .del()
      .then(project => {
        if(!project) {
          res.status(404).json('No project witht this id found')
        } else {
        res
          .status(204)
          .json(`Project with id ${req.params.id} has been deleted.`);
        }
      })
      .catch(error => {
        res.status(500).json({ error });
      });
  });

  app.delete("/api/v1/palettes/:id", (req, res) => {
    database("palettes")
      .where("id", req.params.id).del().then(palette => {
        if(!palette) {
          res.status(404).json('No palette with that id found')
        } else {
        res.status(204).json(`Palette with id ${req.params.id} has been deleted.`);
        }
      })
      .catch(error => {
        res.status(500).json({ error });
      });
  });

  app.get("/api/v1/projects/search", (req, res) => {
    let query = req.query.name

  })

  
module.exports = app;
