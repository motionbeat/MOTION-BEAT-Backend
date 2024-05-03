import swaggerUi from "swagger-ui-express";
import swaggereJsdoc from "swagger-jsdoc";

const options = {
    swaggerDefinition: {
        info: {
            title: 'MotionBeat API',
            version: '1.0.0',
            description: 'MotionBeat API with Express',
        },
        host: 'localhost:5001',
        basePath: '/'
    },
    apis: ['./routes/*.js', './swagger/*']
};

const specs = swaggereJsdoc(options);

export { swaggerUi , specs };