/* Swagger configuration */
const options = {
    openapi: 'OpenAPI 3',
    language: 'en-US',
    disableLogs: false,
    autoHeaders: false,
    autoQuery: false,
    autoBody: false
}

const msg = {
    response: {
        CAG001: { code: 200, message: 'Success' },
        CAGE002: { code: 400, message: 'Bad Request' },
        CAGE001: { code: 404, message: 'Forbidden' },
        CAGE003: { code: 500, message: 'Internal Server Error' }
    }
};

const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        version: '2.0.0',
        title: 'CloudAgent Apis',
        description: 'API for Managing User Details',
        contact: {
            'name': 'API Support',
            'email': 'vihangsubhash123@gmail.com'
        },
    },
    host: 'https://voosh-backend-project.onrender.com',
    basePath: '/',
    schemes: ['https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: 'Queue CRUD',
            description: 'Queue related apis',
        },
        {
            name: 'Health',
            description: 'Health Check'
        }
    ],
    securityDefinitions: {},
    definitions: {
        helathResponse: {
            code: msg.response.CAG001.code,
            message: msg.response.CAG001.message,
        },
        'errorResponse.400': {
            code: msg.response.CAGE002.code,
            message: msg.response.CAGE002.message,
        },
        'errorResponse.403': {
            code: msg.response.CAGE001.code,
            message: msg.response.CAGE001.message,
        },
        'errorResponse.404': {
            "code": "404",
            "message": "Not found",
        },
        'errorResponse.500': {
            code: msg.response.CAGE003.code,
            message: msg.response.CAGE003.message,
        }
    },
};

const outputFile = './docs/swagger.json';
const endpointsFiles = ['./index.js', './controllers/*.js'];


swaggerAutogen(outputFile, endpointsFiles, doc);

