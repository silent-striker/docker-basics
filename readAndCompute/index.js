const express = require('express');
const csv = require('csvtojson');
// for the use of env variables
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT;

app.post("/compute", async (req, res) => {
    console.log(`received POST request`);

    const fileName = req.body.file;
    const product = req.body.product;

    const filePath = `../data/${fileName}`;

    const fileData = await csv({delimiter: ",", checkType: true, checkColumn: true})
        .fromFile(filePath)
        .then((dataObj) => {
            return {data: dataObj};
        })
        .catch((err) => {
            let errorMsg = "";
            if(err.message.includes("File does not exist")){
                errorMsg = "File not found."
            }else{
                errorMsg = "Input file not in CSV format.";
            }
            return {error: errorMsg};
        });

    let resJson = {};
    resJson.file = fileName;

    if(fileData.error){
        resJson.error = fileData.error;
        console.log(`errors in computation: \n ${fileData.error}`);
    }
    else{
        let sum=0;
        fileData.data.forEach((obj) => {
            if(obj.product == product){
                sum += obj.amount;
            }
        });
        resJson.sum = sum;
    }
    res.json(resJson);
});

app.listen(port, () => {console.log(`readAndCompute listening on port ${port}`)});