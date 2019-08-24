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

        it('should return 404 status if passed a bad id param', async () => {
            const response = await request(app).get('/api/v1/projects/2')
            expect(response.status).toBe(404)
        })
    })

    //CUSTOM QUERY ENDPONT TEST
    describe('GET /search', () => {
        it('should return a 200 status code and the project by name', async () => {
            const mockName = await database('projects').first('name').then(object => object.name)
            const response = await request(app).get(`/api/v1/search?name=${mockName}`)
            expect(response.status).toBe(200)
            expect(response.body[0].name).toEqual(mockName)
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

        it('should return 404 status if passed a bad id param', async () => {
            const response = await request(app).get('/api/v1/projects/2/palettes')
            expect(response.status).toBe(404)
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

        it('should return a 422 error if missing required parameter', async () => {
            const mockProject = {title: 22}
            const response = await request(app).post('/api/v1/projects').send(mockProject);
            expect(response.status).toBe(422)
        })
    });

    describe('POST /palettes', () => {
        it('should return 201 status and add new palette to the database', async () => {
            const mockId = await database('projects').first('id').then(object => object.id)
            
            const mockPalette = {
                name: 'London Fog',
                color_one: '#bfe9d4', 
                color_two:'#5f9ee5', 
                color_three: '#f28e98', 
                color_four:'#4740b7', 
                color_five: '#7939da',
                project_id: mockId
            }

            const response = await request(app).post('/api/v1/palettes').send(mockPalette);
            const palettes = await database('palettes').where({ id: response.body.id })
            const addedPalette = palettes[0]
            expect(response.status).toBe(201)
            expect(addedPalette.name).toEqual(mockPalette.name)
        })

        it('should return a 422 error if missing required parameter', async () => {
            const mockPalette = {title: 22}
            const response = await request(app).post(`/api/v1/palettes`).send(mockPalette);
            expect(response.status).toBe(422)
        })
    })

    describe('PATCH /projects/:id', () => {
        it('should return 201 status and update project in the database', async () => {
            const mockProject = {
                name: 'She Shed', 
            }
            const selectedId = await database('projects').first('id').then(object => object.id)
            const response = await request(app).patch(`/api/v1/projects/${selectedId}`).send(mockProject);
            const updatedProject = await database('projects').where({ id: selectedId })
            expect(response.status).toBe(201)
            expect(updatedProject[0].name).toEqual(mockProject.name)
        })

        it('should return a 422 error if no request has no body', async () => {
            const mockProject = {}
            const selectedId = await database('projects').first('id').then(object => object.id)
            const response = await request(app).patch(`/api/v1/projects/${selectedId}`).send(mockProject);
            expect(response.status).toBe(422)
        })
    })

    describe('PATCH /palettes/:id', () => {
        it('should return 201 status and update palette in the database', async () => {
            const mockPalette = {
                color_one: '#NEW0NE', 
            }
            const selectedId = await database('palettes').first('id').then(object => object.id)
            const response = await request(app).patch(`/api/v1/palettes/${selectedId}`).send(mockPalette);
            const newPalette = await database('palettes').where({ id: selectedId })
            expect(response.status).toBe(201)
            expect(newPalette[0].color_one).toEqual(mockPalette.color_one)
        })
    })

    describe('DELETE /projects/:id', () => {
        it('should return a 204 status code and remove project from database', async () => {
            const selectedId = await database('projects').first('id').then(object => object.id)
            console.log(selectedId)
            const response = await request(app).delete(`/api/v1/projects/${selectedId}`)
            expect(response.status).toBe(204)
        })

        it('should return a 404 if a request id is bad', async () => {
            const response = await request(app).delete('/api/v1/projects/-2')
            expect(response.status).toBe(404)
        })
    })

    describe('DELETE /palettes/:id', () => {
        it('should return a 204 status code and remove palette from database', async () => {
            const selectedId = await database('palettes').first('id').then(object => object.id)
            const response = await request(app).delete(`/api/v1/palettes/${selectedId}`)
            expect(response.status).toBe(204)
        })

        it('should return a 404 if a request id is bad', async () => {
            const response = await request(app).delete('/api/v1/palettes/-2')
            expect(response.status).toBe(404)
        })
    })

})
