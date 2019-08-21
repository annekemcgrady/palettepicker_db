import {projectsData} from '../db/data.js'

const createProject = (knex, project) => {
  return knex('projects').insert({
    name: project.name,
  }, 'id')
  .then(projectId => {
    let palettePromises = [];

    project.palettes.forEach(palette => {
      palettePromises.push(
        createPalette(knex, {
          name: palette.name,
          color_one: palette.color_one,
          color_two: palette.color_two,
          color_three: palette.color_three,
          color_four: palette.color_four,
          color_five: palette.color_five,
          project_id: projectId[0]
        })
      )
    });

    return Promise.all(palettePromises);
  })
  };

  const createPalette = (knex, palette) => {
    return knex('palettes').insert(palette)
  };

exports.seed = (knex) => {
  return knex('palettes').del()
  .then(() => knex('projects').del())
  .then(() => {
    let projectPromises = [];

    projectsData.forEach(project => {
      projectPromises.push(createProject(knex,project));
    });

    return Promise.all(projectPromises);
  })
  .catch(error => console.log(`Error seeding data: ${error}`))
};