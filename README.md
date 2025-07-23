# DriveTestKiosk
A DriveTest Application developed using Node ,Express and Mongo Db. This application facilitates the registration of administrators,drivers and examiners as users. A driver can book G1,G2 or g test using the apploication. An admin can create timeslots for examinations and examiner can manage the results of G1,G2 or G exams.

#Automation Tet Cases

Drive Test Application 
Run the application using command : npm run dev 

The application will be then available on :  localhost:8000 

Then run the testcase using the command:  python .\driveTest_testcase.py 

Test case Description 

**1. Test Case 1: Successful Login for Driver (test_01_successful_login_driver) **
• Purpose: Verifies that a driver can successfully log in to the system. 
• Steps: 
o The test navigates to the login page. 
o Enters the driver’s email (dd@gmail.com) and password (123456). 
o Submits the login form and checks if the user is redirected to the "G2 Test" page. 
o If successful, it captures a screenshot of the logged-in page. 
• Expected Result: The driver should be successfully redirected to the "G2 Test" page after logging in. 
**2. Test Case 2: Update Personal Details (test_02_update_personal_details) **
• Purpose: Verifies that the driver can update their personal details (such as name, age, and date of birth). 
• Steps: 
o The test first logs in as a driver. 
o It navigates to the personal details section and updates the first name, last name, age, and date of birth. 
o Submits the update form and checks for the success message. 
o Takes a screenshot if the update is successful. 
• Expected Result: The driver’s personal details should be updated 
successfully, and a success message ("Details Updated Successfully") should be displayed. 

3. Test Case 3: Examiner Pass/Fail Update (test_03_examiner_pass_fail_update) 
• Purpose: Verifies that an examiner can filter the appointments by test type (G2) and mark a driver as passed or failed. 
• Steps: 
o The test logs in as an examiner (ee@gmail.com). 
o It filters the appointment list to show only G2 test appointments. 
o It selects a driver from the filtered list, adds a comment, and marks the driver as "Pass." 
o Submits the update and verifies that the appointment status has been updated successfully. 
o Takes a screenshot for verification. 
• Expected Result: The examiner should be able to successfully mark a driver’s test as passed, and a success message ("Appointment Updated Successfully") should be displayed. 

4. Test Case 4: Book G2 Test Without Selecting Date and Time (Negative Test) 
• Purpose: Verifies that an error message is displayed when a driver tries to book a G2 test without selecting a date or time. 
• Steps: 
o The test logs in as a driver. 
o Attempts to book a G2 test without selecting a date and time. 
o Submits the form and checks if the error message ("Please select a Date and time") is displayed. 
Expected Result: The system should display an error message indicating that the 
driver must select a date and time before booking the test.
