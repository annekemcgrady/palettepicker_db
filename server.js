const app = require('./app.js')

app.set('port', process.env.PORT || 3000);

app.get('/', (request, response) => {
  response.status(200).json('Initial SetUp Complete')
})




app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});