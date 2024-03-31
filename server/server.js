// const express = require('express');
// const cors = require('cors');
// const MySQL = require('./src/connection.js');
// const avmRoute = require('./src/route/avm.js');
// const bodyParser = require('body-parser');
import express from 'express';
import cors from 'cors';
import MySQL from './src/connection.js';
import avmRoute from './src/route/avm.js';
import bodyParser from 'body-parser';

MySQL.connect();
const app = express();
app.use(cors());

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const port = process.env.PORT||5000
app.listen(port, ()=>{
    console.log(`API Server is up on port ${port}.`)
})


app.use('/api/avm', avmRoute)

app.post('/api/avm/del_account_subjects', (req, res) => {
    if (jsonData) {
        res.json({ message: 'String data received and processed successfully' });
      } else {
        res.status(400).json({ error: 'Invalid JSON data format' });
      }

});