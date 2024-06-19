const express = require('express');
const mongoose = require('mongoose');
const app = express();

const url = 'mongodb://127.0.0.1/Products';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const con = mongoose.connection;

con.on('open', () => {
    console.log('connected to Mongodb');
});

app.use(express.json());

const productsRouter = require('./routes/products');
app.use('/api', productsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});