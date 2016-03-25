Life Cycle
--
Business
    Pharma has a bunch of these bottles
    They get an Prescripion Order from doctor
    Program the bottle with prescription - Locally - Really Secure
    Only people who can change - Pharma - BLE used?
    Everythings gets set up so that Doctor and Consumer can see Everything
    Count of Pills

Consumer
    Bottle
        BLE
            Send Notifications
        Cloud
            Sends Notifications if BLE not available
        Data
            Prescription
            Local Log of Button Presses
        Tessel
            Sends the log to database
    App/Website
        Views Prescription, Doctor, Patient, Logs
        Consumer App helps you set Notifications
        Doctors gives sharing code to other doctors/family on family's & patient's request

Data Model
--
Prescription Object
    Name of the Pill
    Number of Pills
    Functionality of the Pill
    Side Effects
    Doctor Info/Hospital Info/Pharma Info - Emergency Stuff

    Number of Times to take the Pill in a Day (User Controlled) | Time interval (Pharma Controlled)
    Num of Pills per interval
    Lock Pills

Log - Button Press - ButtonPress Object
        Timestamp
        Pill Came out or Not

Use Cases - Together
--


Presentations
--
Aeris will be needed to integrated into the workflow of the Pharmaceuticals/Doctors
Future IoT projects will be preferred with Aeris