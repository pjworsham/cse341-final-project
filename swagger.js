const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Holiday Party Manager',
        description: 'A simple API to help manage holiday parties'
    },
  
/* ******************************************
 * Before deploy on Render, we need to change
 * host: 'https://holidaypartymanager.onrender.com'
 * schemes: ['https'] -vy
 *******************************************/
    host: 'localhost:3000',
    schemes: ['http'],
    tags: [
    {
      name: 'Gifts',
      description: 'Endpoints for managing gifts'
    },
    {
      name: 'Food',
      description: 'Endpoints for managing dishes/food'
    }
  ]
    host: 'https://cse341-final-project-4au6.onrender.com',
    schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);