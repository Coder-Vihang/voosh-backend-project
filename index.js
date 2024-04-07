const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const passport=require('passport');
require('dotenv').config();

const swaggerDocument = require('./docs/swagger.json');
require('./GoogleStratergy');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const session = require('express-session');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const authMiddleware = require('./middleware/authMiddleware');


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const config = require('./config');

app.use('/Voosh',(req,res)=>{
    res.status(200).json({message:'Welcome to Voosh', isSuccess:true});
})

  app.use(session({ secret: config.JWTSecretKey, resave: false, saveUninitialized: true }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
  });

app.use('/auth', authRoutes);
app.use('/user', authMiddleware.authenticateToken, userRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.get('/auth/google/callback',
    passport.authenticate( 'google', {
      successRedirect: '/auth/googleCallBack',
      failureRedirect: '/auth/googleFailure'
    })
  );

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
