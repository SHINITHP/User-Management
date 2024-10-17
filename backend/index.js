const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));


app.use('/api/auth', authRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
