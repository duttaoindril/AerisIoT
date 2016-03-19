var https = require('https');
var json2csv = require('json2csv');
var fs = require('fs');
var pathFile = 'main/';

checkSubscription(); //function call

function checkSubscription() {
	console.log("Checking for subscription");
    //set https options
    var options = {
        host :  'aercloud-preprod-r4-longpoll.aeriscloud.com',
        port : 443,
        path : '/v1/<your-accountId>/containers/subscriptions/FirstSubs/notificationChannels/longPoll?apiKey='+ 'your-apiKey',
        method : 'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'         
        }
    }
    
    var getReq = https.request(options, function(res) {
        console.log("\nstatus code: ", res.statusCode);
           res.on('data', function(data) {
            httpResponse = JSON.parse(data);
            console.log("\nhttpResponse: ", httpResponse);

            if(!isEmpty(httpResponse)){
                    var contentTypeBinaryData = [];
                    var contentTypeBinaryFields = [];         
                    for (var key in httpResponse.sclContentInstances){
                        console.log("Key1:", key);
                         contentTypeBinaryData.push(JSON.parse(httpResponse.sclContentInstances[key].contentInstance.content.contentTypeBinary));
                    }
                    for (var key in contentTypeBinaryData[0]){
                         contentTypeBinaryFields.push(key);
                    }
                    console.log("contentTypeBinaryData-",contentTypeBinaryData);
                    console.log("contentTypeBinaryFields-",contentTypeBinaryFields);

                    json2csv({ data: contentTypeBinaryData, fields: contentTypeBinaryFields }, function(err, csv) {
                        if (err) console.log(err);
                        //if we don't specify the path, it takes root of the project ,
                        // e.g. node main/nodeWriteJSONTOCSV , the main path is main/
                        if(!fileExists('file.csv')) {
                             console.log("Create new file");
                            fs.writeFile('file.csv', csv, function(err) {
                            if (err) {
                            console.log("\nError writing to a File-Please verify.",err);
                            } else {
                            console.log('file saved');
                            }
                          });
                        } else {
                            console.log("File already exists")
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
