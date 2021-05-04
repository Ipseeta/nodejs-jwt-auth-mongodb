const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();



const db = require('./app/models');
const dbConfig = require('./app/config/db.config');
const Role = db.role;

db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected successfully to mongodb');
    initial();
}).catch(err => {
    console.log('Error in mongodb connection', err);
    process.exit();
});

const corsOptions = {
    origin: 'http://localhost:8081'
}
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to JWT auth' });
});
require('./app/routes/user.routes')(app);
require('./app/routes/auth.routes')(app);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({ name: 'user' }).save(err => {
                if (err) console.log('Error creating User');
                console.log('user added to roles collection');
            });
            new Role({ name: 'moderator' }).save(err => {
                if (err) console.log('Error creating moderator');
                console.log('moderator added to roles collection');
            });
            new Role({ name: 'admin' }).save(err => {
                if (err) console.log('Error creating Admin');
                console.log('admin added to roles collection');
            });
        }
    })
}