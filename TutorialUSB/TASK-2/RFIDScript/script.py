import requests
#Create Data Model - id : My First Data Model
url = 'https://api.aercloud.aeris.com/v1/'+'Enter-your-accountId'+'/scls/dataModels'
params = {"apiKey":"Enter-your-accountApiKey"}
data = '{"id":"FirstDM","sclDataSchema":{"encodings":["JSON","CSV"],"parameters":[{"type":"STRING","name":"UID"}
headers = {"Content-type": "application/json"}
try:
 response = requests.post(url, params=params, data=data, headers=headers)
 print "---------------------------------------------------------"
 print "Data Model create - Status Code = ",response.status_code
 print "---------------------------------------------------------"
 if response.status_code == 200:

   #Create Container - id : FirstContainer
   url = 'https://api.aercloud.aeris.com/v1/'+'Enter-your-accountId'+'/containers'
   params = {"apiKey":"Enter-your-accountApiKey"}
   data = '{"id":"FirstContainer","sclDataModelId":"FirstDM"}'
   headers = {"Content-type": "application/json"}
   response = requests.post(url, params=params, data=data, headers=headers)
   print "---------------------------------------------------------"
   print "Container create - Status Code = ",response.status_code
   print "---------------------------------------------------------"
   if response.status_code == 200:

    #Create Subscription - id : FirstSubs
    url = 'https://api.aercloud.aeris.com/v1/'+'Enter-your-accountId'+'/containers/subscriptions'
    params = {"apiKey":"Enter-your-accountApiKey"}
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


#Create Device- id : rfid-pn532
url = 'https://api.aercloud.aeris.com/v1/'+'Enter-your-accountId'+'/scls'
params = {"apiKey":"Enter-your-accountApiKey"}
data = '{"groups":[],"sclId":"rfid-pn532"}'
headers = {"Content-type": "application/json"}
url_info = 'https://api.aercloud.aeris.com/v1/'+'Enter-your-accountId'+'/scls/rfid-pn532/mgmtObjs/etsiDeviceInfo'
data_info = '{"deviceLabel":"RFIDREADER09","manufacturer":"Tessel","deviceType":"RFID reader"}'
try:
 response = requests.post(url, params=params, data=data, headers=headers)
 response_info = requests.post(url_info, params=params, data=data_info, headers=headers)
 print "---------------------------------------------------------"
 print "Device create - Status Code = ",response.status_code
 print "Device Info create - Status Code = ",response_info.status_code
 print "---------------------------------------------------------"
except Exception, e:
 print "EXCEPTION!!-",e

