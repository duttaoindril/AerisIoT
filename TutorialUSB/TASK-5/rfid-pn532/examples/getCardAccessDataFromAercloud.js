var https = require('https');
var json2csv = require('json2csv');
var fs = require('fs');
var pathFile = 'main/';
var dataResponse='';
var httpResponse='';

writeAercloudDataToCsv(); //function call

function writeAercloudDataToCsv() {
	console.log("Preparing to write the card access data from Aercloud to CSV");
    /*
    * HTTP Options 
    * The below GET call GETs the most recent 100 rows. To get more, add queryparam "max"
    * Eg: url?apiKey=<apiKey>&max =200
    */
    var options = {
        host :  'api.aercloud.aeris.com',
        port : 443,
        path : '/v1/your-account-id/scls/rfid-pn532/containers/FirstContainer/contentInstances?apiKey='+ 'your-api-Key',
        method : 'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'         
        }
    }
    
    var getReq = https.request(options, function(res) {
        console.log("\nstatus code: ", res.statusCode); //statuscode = 200 means success
           //get the Data from the response
           res.on('data', function(data) {
            dataResponse += data;
           });
           //parse the response to JSON
           res.on('end', function() {
            httpResponse = JSON.parse(dataResponse);

           if(!isEmpty(httpResponse)){
                    var contentTypeBinaryData = [];
                    var contentTypeBinaryFields = [];   
                    //Prepare the Data array with JSON elements with UID(Card Id) and CreateTime data      
                    for (var key in httpResponse.contentInstances){
                        var jsonObject = JSON.parse(httpResponse.contentInstances[key].content.contentTypeBinary);
                        jsonObject["creationTime"] = new Date(httpResponse.contentInstances[key].creationTime).toLocaleString();
                        contentTypeBinaryData.push(jsonObject);
                    }
                    //Treat each JSON element as key:value pair. Key is the header
                    for (var key in contentTypeBinaryData[0]){
                         contentTypeBinaryFields.push(key);
                    }
                    //Preparing to CSV file.
                    json2csv({ data: contentTypeBinaryData, fields: contentTypeBinaryFields }, function(err, csv) {
                        if (err) console.log(err);
                        //if we don't specify the path, it takes root of the project ,
                        // e.g. node main/nodeWriteJSONTOCSV , the main path is main/
                        if(!fileExists('file.csv')) {
                             console.log("Create new file");
                            fs.writeFile('file.csv', csv, function(err) {
                            if (err) {
                            console.log("\nERROR:Error writing to a File-Please verify.",err);
                            } else {
                            console.log('file saved');
                            }
                          });
                        } else {
                            console.log("\nERROR: File already exists. Please rename the existing file and rerun.");
                        }
                   });
            } else {
                console.log("Empty response received. No Data to write to File.");
            }
        });
    });

 //end the request
    getReq.end();
    getReq.on('error', function(err){
        console.log("Error: ", err);
    });  

//Function: Used to check if the File already exists
function fileExists(filePath)
    {
        console.log("Checking if the file.csv already exists....");
        try
        {
            return fs.statSync(filePath).isFile();
        }
        catch (err)
        {
            return false;
        }
    } 
    
//Funtion: Used to check if the object is empty 
var isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
}  

}
