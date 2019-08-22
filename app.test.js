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

    describe('POST /projects', () => {
        it('should return 201 status and add new project to the databse', async () => {
            const mockProject = {
                name: 'Living Room'
            }

            const response = await request(app).post('/api/v1/projects').send(mockProject);
            const projects = await database('projects').where({ id: response.body.id})
            const addedProject = projects[0]

            expect(response.status).toBe(201)
            expect(addedProject.name).toEqual(mockProject.name)
        })
    });

    describe('POST /palettes', () => {
        it('should return 201 status and add new palette to the database', async () => {
            const mockPalette = {
                name: 'London Fog',
                color_one: '#bfe9d4', 
                color_two:'#5f9ee5', 
                color_three: '#f28e98', 
                color_four:'#4740b7', 
                color_five: '#7939da'
            }

            const response = await request(app).post('/api/v1/palettes').send(mockPalette);
            const palettes = await database('palettes').where({ id: response.body.id })
            const addedPalette = palettes[0]

            expect(response.status).toBe(201)
            expect(addedPalette.name).toEqual(mockPalette.name)
        })
    })

})
