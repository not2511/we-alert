from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from selenium.common.exceptions import NoSuchElementException
import time
import csv

url = "https://www.ndtv.com/topic/rape-cases-in-delhi"


options = Options()
options.add_argument("--headless")
driver = webdriver.Firefox(options=options)
driver.get(url)

all_urls = []
page_count = 1

try:
    while True:
        time.sleep(2)
        
        articles = driver.find_elements(By.CSS_SELECTOR, ".SrchLstPg_ttl-lnk a")
        
        for article in articles:
            url = article.get_attribute("href")
            if url and url not in all_urls:
                all_urls.append(url)
                print(f"Found URL: {url}")
        
        print(f"Page {page_count} complete. Total URLs so far: {len(all_urls)}")
        
        try:
            more_button = driver.find_element(By.CLASS_NAME, "btn_bm")
            driver.execute_script("arguments[0].click();", more_button)
            page_count += 1
            time.sleep(3)
        except NoSuchElementException:
            print("No more pages to load.")
            break
            
except Exception as e:
    print(f"Error occurred: {e}")
finally:
    with open("ndtv_rape_cases_delhi_urls.csv", "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["URL"])
        for url in all_urls:
            writer.writerow([url])
    
    print(f"Scraping complete. Found {len(all_urls)} unique URLs.")
    driver.quit()