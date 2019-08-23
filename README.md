# Palette Picker Back End

## Description
This database was created to store two tables: the secondary holds palettes of randomly generated hex codes, and the primary stores the projects to which these palettes are assigned. 

### Tech Emphasis
1. NodeJS w/ Express
1. Knex
1. PostgreSQL

### Installation and SetUp
From the command line:
1. `git clone https://github.com/annekemcgrady/palettepicker_db.git <PROJECT_NAME>`
1. Run `npm install`
1. Run `npm start`

In your browser:
Open localhost://3000/api/v1/projects

### Endpoints

| url           |     method    | options  | Sample Response |
| ------------- |-------------|    -----|      ---         |
| `/api/v1/projects/`  | GET | none needed | `[{ name: 'Kitchen }, { name: 'Master Bath'}]` |
| `/api/v1/palettes/  |   GET    | none needed | `[{name: 'Cold Fusion', color_one: '#bfe9d4', color_two:'#5f9ee5', color_three: '#f28e98', color_four:'#4740b7', color_five: '#7939da'},
{name: 'Rainbow', color_one: '#bfe9d4', color_two:'#5f9ee5', color_three: '#f28e98', color_four:'#4740b7', color_five: '#7939da'}]` |
| `/api/v1/projects/:id` |   GET   |  none needed | ` { name: 'Rumpus Room' }`|
| `/api/v1/palettes/:id` | GET | none needed |  `{name: 'Rainbow', color_one: '#bfe9d4', color_two:'#5f9ee5', color_three: '#f28e98', color_four:'#4740b7', color_five: '#7939da'}` |

| `/api/v1/projects/` | POST | `{name: <String> }` | `{ id: 33}` |
| `/api/v1/palettes/` | POST | `{name: <String>, color_one: <String>, color_two: <String>', color_three: <String>, color_four:<String>, color_five: <String>}` | `{ id: 33}` |
| `/api/v1/projects/:id` | PATCH | `{name: <String> }` | `{ id: 33}` |
| `/api/v1/palettes/` | PATCH | `{name: <String>  or color_(n): <String> }` | `{ id: 33}` |

| `/api/v1/projects/:id/` | DELETE | none needed | `Project with id ${id} has been deleted.` |
| `/api/v1/palettes/:id/` | DELETE | none needed | `Palette with id ${id} has been deleted.`` |


