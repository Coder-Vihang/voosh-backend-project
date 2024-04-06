const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const passport=require('passport');
const swaggerDocument = require('./docs/swagger.json');

require('dotenv').config();
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const authMiddleware = require('./middleware/authMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/Voosh',(req,res)=>{
    res.status(200).json({message:'Welcome to Voosh',isSuccess:true});
})
app.use('/auth', authRoutes);
app.use('/user', authMiddleware.authenticateToken, userRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
