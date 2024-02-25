const axios = require('axios');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
// use express's JSON parser for input
app.use(express.json());

const port = process.env.PORT;

app.post('/calculate', async (req, res) => {
    if(!req || !req.body || !req.body.file){
        if(!req.body.file){
            res.json({
                file: req.body.file==null? null:req.body.file,
                error: "Invalid JSON input."
            });
        }
        return;
    }

    const hostname = process.env.SECOND_SERVICE_HOSTNAME || "localhost";
    const second_port = process.env.SECOND_SERVICE_PORT || 6000;

    console.log(`calling computation service on: host ${hostname} and port ${second_port}`);
    // calling the 2nd service;
    const result = await axios({
        url: `http://${hostname}:${second_port}/compute`,
        method: "POST",
        data: {
            file: req.body.file,
            product: req.body.product
        }
    }).catch(error => {
        console.log(error.message);
        return  {data:{error: error.message}};
    });

    let resultJson = {};

    resultJson.file = req.body.file;
    if(result.data.sum !== null && result.data.sum !== undefined && !result.data.error){
        resultJson.sum = result.data.sum;
    }
    else{
        resultJson.error = result.data.error;
    }

    res.json(resultJson);
    return;
});

app.listen(port, () => console.log(`inputValidation is listening on port ${port}`));