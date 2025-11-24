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
    schemes: ['http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);