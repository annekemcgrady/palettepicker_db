import request from 'supertest'
import app from './app'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration)

describe('Server', () => {
    describe('init', () => {
        it('should return a 200 status', async () => {
            const res = await request(app).get('/')
            expect(res.status).toBe(200)
        })
    })
});

describe('API', () => {
    beforeEach(async () => {
        await database.seed.run()
    })

    describe('GET /projects', () => {
        it('should return a status of 200 and all projects', async () => {
            const expectedProjects = await database('projects').select();

            const response = await request(app).get('/api/v1/projects');
            const projects = response.body
            
            expect(response.status).toBe(200);
            expect(projects[0].name).toEqual(expectedProjects[0].name);

        })
    })

    describe('GET /projects/:id', () => {
        it('should return 200 status and one project based on id', async () => {
            const expectedId = await database('projects').first('id').then(object => object.id)
            const expectedProject = await database('projects').select().where({ id: expectedId })
            const response = await request(app).get(`/api/v1/projects/${expectedId}`)
            const project = response.body
      
            expect(response.status).toBe(200)
            expect(project.name).toEqual(expectedProject.name)
        })
    })

describe('GET /palettes', () => {
    it('should return a status of 200 and all palettes', async () => {
        const expectedPalettes = await database('palettes').select();

        const response = await request(app).get('/api/v1/palettes');
        const palettes = response.body
        
        expect(response.status).toBe(200);
        expect(palettes[0].name).toEqual(expectedPalettes[0].name);

    })
})

describe('GET /projects/:id/palettes', () => {
    it('should return 200 status and all palettes for a project', async () => {
        const expectedId = await database('projects').first('id').then(object => object.id)
        const expectedPalettes = await database('palettes').where({ project_id: expectedId }).select()
        const response = await request(app).get(`/api/v1/projects/${expectedId}/palettes`)
        const palettes = response.body
  
        expect(response.status).toBe(200)
        expect(palettes[0].name).toEqual(expectedPalettes[0].name)
    })
})

})
