
from selenium import webdriver as wd
import chromedriver_binary
import chromedriver_autoinstaller
from selenium.webdriver import common
from selenium.common.exceptions import ElementClickInterceptedException, NoSuchElementException, ElementNotInteractableException
import time
import os
import sys
from dotenv import load_dotenv


load_dotenv()

from twilio.rest import Client
account_sid = os.getenv("twilio_SID")
auth_token = os.getenv("twilio_auth")
client = Client(account_sid, auth_token)
cell_phone_number = os.getenv("phone_number")


chromedriver_autoinstaller.install()

wd = wd.Chrome()
wd.implicitly_wait(5)

item_site = ((str(sys.argv[1]))[0:-1])
size = str(sys.argv[0][0])
cycle = 0
text = str()
wd.get(item_site)

try:
    current_price = wd.find_element_by_xpath('//*[@id="portal-product"]/div/div/section[2]/section[1]/div/div/span').text
except NoSuchElementException:
    current_price = wd.find_element_by_xpath('//*[@id="portal-product"]/div/div/section[2]/section[1]/div/div/span[1]').text

def send_message():
    global text
    message = client.messages.create(
                              messaging_service_sid='MG44bb1a6fae175a415fed124e96ea1d2c',
                              body=text,
                              to=cell_phone_number)
    print(message.sid)

def in_stock_check():
    global size
    global cycle
    global current_price
    global text
    global send_message
    item_name = wd.find_element_by_xpath('//*[@id="portal-product"]/div/div/section[2]/section[1]/div/h1').text
    item_color = wd.find_element_by_xpath('//*[@id="portal-product"]/div/div/section[2]/div[1]/h4/span').text

    def cookie_check():
        try:
            cookie_banner_close_button = wd.find_element_by_xpath('/html/body/div[5]/div[2]/div/div[2]/button')
            cookie_banner_close_button.click()
            time.sleep(2)
        except NoSuchElementException:
            print("Cookies already accepted.")

    while True:
        cycle += 1
        time.sleep(2)
        try:
            cookie_check()
            select_size_button = wd.find_element_by_xpath(f'//*[@id="size-select_{size}"]/span')
            select_size_button.click()
            text = f'Your item {item_name} - {item_color} is in stock in size {size.upper()} and is {current_price}.'
            send_message()
            break
        except (ElementNotInteractableException, ElementClickInterceptedException):
            text = f'Your item {item_name} - {item_color} is currently out of stock in size {size.upper()}. SharkBot will check on it later.'
            print(f"Been waiting for {cycle} cycles...")
            if cycle == 1 or (cycle % 48) == 0:
                send_message()
            time.sleep(1800)
            in_stock_check()

in_stock_check()
time.sleep(2)
#: ElementClickInterceptedException

add_to_cart_button = wd.find_element_by_xpath('/html/body/div[2]/div[2]/main/div[2]/div/div/div/div/section[2]/div[3]/button')
add_to_cart_button.click()

time.sleep(2)

close_bag_button = wd.find_element_by_xpath('//*[@id="minicart-close"]')
close_bag_button.click()

time.sleep(2)

click_account_button = wd.find_element_by_xpath('/html/body/div[2]/div[2]/div[1]/div[2]/div[3]/div/div/div[1]')
click_account_button.click()

time.sleep(2)

input_email_address = wd.find_element_by_xpath('/html/body/div[2]/div[2]/main/div[2]/section/div/div/div/div[1]/form/div[1]/input')
input_email_address.click()
type(input_email_address)
input_email_address.send_keys("mareenahart@gmail.com")

time.sleep(2)

input_password = wd.find_element_by_xpath('/html/body/div[2]/div[2]/main/div[2]/section/div/div/div/div[1]/form/div[2]/div/input')
input_password.click()
type(input_password)
input_password.send_keys("Earlyjuly98")

time.sleep(2)

sign_in_button = wd.find_element_by_xpath('/html/body/div[2]/div[2]/main/div[2]/section/div/div/div/div[1]/form/div[3]/div[1]/button')
sign_in_button.click()

time.sleep(2)

goto_cart_button = wd.find_element_by_xpath('/html/body/div[2]/div[2]/div[1]/div[2]/div[3]/header/div[3]/button')
goto_cart_button.click()

time.sleep(2)

goto_checkout_button = wd.find_element_by_xpath('//*[@id="checkout"]')
goto_checkout_button.click()

time.sleep(2)
wd.quit()
