const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Holiday Party Manager',
    description: 'A simple API to help manage holiday parties'
  },
  
/* ******************************************
 * Local Testing URL -vy
 *******************************************/
  // host: 'localhost:3000',
  // schemes: ['http'],

/* ******************************************
 * Production URL -vy
 *******************************************/
  host: 'cse341-final-project-4au6.onrender.com',
  schemes: ['https'],
    
/* ******************************************
 * Testing URL -vy
 *******************************************/
  // host: 'localhost:3000',
  // schemes: ['http' ],
    tags: [
    {
      name: 'Gifts',
      description: 'Endpoints for managing gifts'
    },
    {
      name: 'Food',
      description: 'Endpoints for managing dishes/food'
    },
    {
      name: 'Locations',
      description: 'Endpoints for managing locations'
    },
    {
      name: 'Participants',
      description: 'Endpoints for managing participants'
    }
  ]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);