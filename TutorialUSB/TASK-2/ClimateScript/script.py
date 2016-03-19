import requests

#Create Data Model - id : My First Data Model
url = 'https://api-aercloud-preprod.aeriscloud.com/v1/'+'<your-account-id>'+'/scls/dataModels'
params = {"apiKey":"<your-api-key>"}
data = '{"id":"FirstDM","sclDataSchema":{"encodings":["JSON","CSV"],"parameters":[{"type":"FLOAT","name":"Temperature","metainfo":{"uom":"Farenheit"}},{"type":"FLOAT","name":"Humidity","metainfo":{"uom":"RH Percentage"}}],"encoding":"JSON"},"name":"First Data Model","description":"First Data Model for Account"}'
headers = {"Content-type": "application/json"}
try:
 response = requests.post(url, params=params, data=data, headers=headers)
 print "---------------------------------------------------------"
 print "Data Model create - Status Code = ",response.status_code
 print "---------------------------------------------------------"
 if response.status_code == 200:
   #Create Container - id : FirstContainer
   url = 'https://api-aercloud-preprod.aeriscloud.com/v1/'+'<your-account-id>'+'/containers'
   params = {"apiKey":"<your-api-key>"}
   data = '{"id":"FirstContainer","sclDataModelId":"FirstDM"}'
   headers = {"Content-type": "application/json"}
   response = requests.post(url, params=params, data=data, headers=headers)
   print "---------------------------------------------------------"
   print "Container create - Status Code = ",response.status_code
   print "---------------------------------------------------------"
   if response.status_code == 200:
    #Create Subscription - id : FirstSubs
    url = 'https://api-aercloud-preprod.aeriscloud.com/v1/'+'<your-account-id>'+'/containers/subscriptions'
    params = {"apiKey":"<your-api-key>"}
    data = '{"id":"FirstSubs","subscriptionType":"LONGPOLLING","rule":{"assumptions":[]},"containerIds":["FirstContainer"],"contact":"","description":"My First Subscription"}'
    headers = {"Content-type": "application/json"}
    response = requests.post(url, params=params, data=data, headers=headers)
    print "---------------------------------------------------------"
    print "Subscription create - Status Code = ",response.status_code
    print "---------------------------------------------------------" 
   else:
   	print "ERROR : Container Creation Failed. Please check for valid API Key and Account number"
 else:
  print "ERROR : Data Model  Creation Failed. Please check for valid API Key and Account number"
except Exception, e:
 print "EXCEPTION!!-",e

#Create Device- id : ClimateDevice
url = 'https://api-aercloud-preprod.aeriscloud.com/v1/'+'<your-account-id>'+'/scls'
params = {"apiKey":"<your-api-key>"}
data = '{"groups":[],"sclId":"ClimateDevice"}'
headers = {"Content-type": "application/json"}
url_info = 'https://api-aercloud-preprod.aeriscloud.com/v1/'+'<your-account-id>'+'/scls/ClimateDevice/mgmtObjs/etsiDeviceInfo'
data_info = '{"deviceLabel":"si7020","manufacturer":"Tessel","deviceType":"Climate"}'
try:
 response = requests.post(url, params=params, data=data, headers=headers)
 response_info = requests.post(url_info, params=params, data=data_info, headers=headers)
 print "---------------------------------------------------------"
 print "Device create - Status Code = ",response.status_code
 print "Device Info create - Status Code = ",response_info.status_code
 print "---------------------------------------------------------"
except Exception, e:
 print "EXCEPTION!!-",e