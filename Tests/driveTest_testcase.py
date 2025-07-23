import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


class G2TestScenarios(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox(service=Service(r"C:/geckodriver/geckodriver.exe"))
        self.driver.set_window_size(1280, 900)

    # Test case 1: Successful login for driver
    def test_01_successful_login_driver(self):
        driver = self.driver
        print("\n--- Test case1: Successful login for driver ---")
        driver.get("http://localhost:8000/login")

        # Scroll email input into view and clear
        email_input = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        driver.execute_script("arguments[0].scrollIntoView(true);", email_input)
        time.sleep(1)

        email_input.clear()
        email_input.send_keys("dd@gmail.com")  # Ensure this user exists

        password_input = driver.find_element(By.ID, "pwd")
        driver.execute_script("arguments[0].scrollIntoView(true);", password_input)
        time.sleep(1)

        password_input.clear()
        password_input.send_keys("123456")

        login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        driver.execute_script("arguments[0].scrollIntoView(true);", login_button)
        time.sleep(1)
        login_button.click()

        # Print current URL to diagnose redirection
        time.sleep(5)
        print(f"Current URL after login: {driver.current_url}")

        try:
            WebDriverWait(driver, 60).until(EC.url_contains("g2_test"))
            print("Successfully redirected to G2 Test page.")
        except Exception as e:
            print(f"Failed to redirect. Current URL: {driver.current_url}. Exception: {e}")
            driver.save_screenshot("screenshots/failed_login.png")
            self.fail(f"Failed to redirect to G2 Test page. Exception: {e}")

        self.assertIn("g2_test", driver.current_url)
        driver.save_screenshot("screenshots/successful_login_driver.png")
        print("Driver login successful..")

    # Test case 2: Update personal details
    def test_02_update_personal_details(self):
        driver = self.driver
        print("\n--- Test Case2: Update personal details ---")
        driver.get("http://localhost:8000/login")

        # Log in first
        email_input = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        driver.execute_script("arguments[0].scrollIntoView(true);", email_input)
        time.sleep(1)
        email_input.clear()
        email_input.send_keys("dd@gmail.com")

        password_input = driver.find_element(By.ID, "pwd")
        driver.execute_script("arguments[0].scrollIntoView(true);", password_input)
        time.sleep(1)
        password_input.clear()
        password_input.send_keys("123456")

        login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        driver.execute_script("arguments[0].scrollIntoView(true);", login_button)
        time.sleep(1)
        login_button.click()

        # Wait for redirection to the G2 Test page
        try:
            WebDriverWait(driver, 60).until(EC.url_contains("g2_test"))
        except Exception as e:
            print(f"Current URL after login attempt: {driver.current_url}")
            self.fail(f"Exception encountered: {e}")

        print("Logged in as driver. Proceeding to update personal details.")

        # Scroll to the Personal Details form
        first_name_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "inputFirstname"))
        )
        driver.execute_script("arguments[0].scrollIntoView(true);", first_name_input)
        time.sleep(1)

        first_name_input.clear()
        first_name_input.send_keys("UpdatedFirstName")

        last_name_input = driver.find_element(By.ID, "inputLastname")
        last_name_input.clear()
        last_name_input.send_keys("UpdatedLastName")

        age_input = driver.find_element(By.ID, "inputAge")
        age_input.clear()
        age_input.send_keys("30")

        dob_input = driver.find_element(By.ID, "inputDob")
        dob_input.clear()
        dob_input.send_keys("1990-01-01")

        # Scroll to the update button and click using JavaScript
        update_button = driver.find_element(By.ID, "updatePersonalDetailsButton")
        driver.execute_script("arguments[0].scrollIntoView(true);", update_button)
        time.sleep(1)

        # Execute JavaScript click to avoid interception
        print("Submitting updated personal details.")
        driver.execute_script("arguments[0].click();", update_button)
        time.sleep(2)

        try:
            success_message = WebDriverWait(driver, 30).until(
                EC.presence_of_element_located((By.CLASS_NAME, "alert-primary"))
            ).text
            self.assertIn("Details Updated Successfully", success_message)
        except Exception as e:
            print(f"Error in updating personal details: {e}")
            self.fail(f"Exception encountered: {e}")

        driver.save_screenshot("screenshots/successful_update.png")
        print("Personal details updated successfully.")

    # Test case 3: Examiner updates pass/fail
    def test_03_examiner_pass_fail_update(self):
        driver = self.driver
        print("\n--- Test Case3: Examiner pass/fail update ---")

        # Step 1: Go to the login page
        driver.get("http://localhost:8000/login")

        # Step 2: Login as examiner
        email_input = WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        driver.execute_script("arguments[0].scrollIntoView(true);", email_input)
        email_input.clear()
        email_input.send_keys("ee@gmail.com")  # Examiner email

        password_input = driver.find_element(By.ID, "pwd")
        driver.execute_script("arguments[0].scrollIntoView(true);", password_input)
        password_input.clear()
        password_input.send_keys("123456")  # Examiner password

        login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        driver.execute_script("arguments[0].scrollIntoView(true);", login_button)
        login_button.click()

        # Wait for navigation to Examiner page
        WebDriverWait(driver, 15).until(EC.url_contains("examiner"))

        # Step 3: Filter the appointment list by TestType (e.g., "G2")
        test_type_dropdown = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "inputTestType"))
        )
        test_type_dropdown.click()

        # Select "G2 Test" from the dropdown
        g2_option = driver.find_element(By.XPATH, "//option[@value='G2']")
        g2_option.click()

        # Wait for the list to be filtered and updated
        time.sleep(2)

        # Step 4: Select a driver from the filtered list (Scroll into view first)
        view_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.LINK_TEXT, "View"))
        )
        driver.execute_script("arguments[0].scrollIntoView(true);", view_button)  # Scroll the "View" button into view
        time.sleep(1)  # Allow time for the scroll action to complete
        view_button.click()

        # Step 5: Add a comment and mark the driver as "Pass"
        pass_radio = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "pass"))
        )
        pass_radio.click()

        comment_area = driver.find_element(By.ID, "comment")
        comment_area.clear()
        comment_area.send_keys("Driver performed well and passed the test.")  # Add comment

        # Step 6: Submit the update
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        driver.execute_script("arguments[0].scrollIntoView(true);", submit_button)
        time.sleep(1)  # Allow scrolling animation to finish
        submit_button.click()

        # Step 7: Verify that the driver’s status has been updated to "Pass"
        success_message = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "alert-primary"))
        ).text
        self.assertIn("Appointment Updated Successfully", success_message)

        # Take a screenshot for verification
        driver.save_screenshot("screenshots/examiner_pass_update.png")
        print("Examiner pass/fail update completed successfully.")

    # Test case 4: Attempt to book G2 without selecting date and time (Negative Test)
    def test_04_book_g2_without_date_and_time(self):
        driver = self.driver
        print("\n--- Starting test: Attempt to book G2 without selecting date and time ---")

        driver.get("http://localhost:8000/login")

        email_input = WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.ID, "email"))
        )
        driver.execute_script("arguments[0].scrollIntoView(true);", email_input)
        email_input.clear()
        email_input.send_keys("dd@gmail.com")

        password_input = driver.find_element(By.ID, "pwd")
        driver.execute_script("arguments[0].scrollIntoView(true);", password_input)
        password_input.clear()
        password_input.send_keys("123456")

        login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        driver.execute_script("arguments[0].scrollIntoView(true);", login_button)
        login_button.click()

        WebDriverWait(driver, 15).until(EC.url_contains("g2_test"))

        print("Logged in as driver. Proceeding to attempt booking G2 without date and time.")

        # Attempt to submit without selecting date or time
        book_button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "button[type='submit']"))
        )
        driver.execute_script("arguments[0].scrollIntoView(true);", book_button)
        time.sleep(1)
        book_button.click()

        try:
            error_message = WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.CLASS_NAME, "alert-primary"))
            ).text
            self.assertIn("Please select a Date and time", error_message)
        except Exception as e:
            print(f"Error in booking G2 without date/time: {e}")
            self.fail(f"Exception encountered: {e}")

        driver.save_screenshot("screenshots/g2_booking_without_date_time.png")
        print("Negative test for booking G2 without selecting date and time completed.")

    def tearDown(self):
        print("\n--- Browser closed ---")
        self.driver.quit()


if __name__ == "__main__":
    unittest.main()
