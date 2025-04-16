import csv
import re
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from selenium.common.exceptions import NoSuchElementException

# Load URLs from CSV
def load_urls_from_csv(csv_file):
    urls = []
    with open(csv_file, 'r') as file:
        reader = csv.reader(file)
        next(reader, None)  # Skip header
        for row in reader:
            if row and row[0]:  # Ensure there's a URL
                urls.append(row[0])
    return urls

# Extract offense type from text
def extract_offense_type(text):
    # List of common offense types to look for
    offense_types = [
        "rape", "sexual assault", "gang rape", "molestation", 
        "sexual harassment", "domestic violence", "kidnapping", 
        "trafficking", "stalking", "voyeurism"
    ]
    
    found_offenses = []
    for offense in offense_types:
        if re.search(r'\b' + re.escape(offense) + r'\b', text.lower()):
            found_offenses.append(offense)
    
    if found_offenses:
        return ", ".join(found_offenses)
    return "Unknown"

# Extract more specific location from text
def extract_location(text):
    # Try to find specific areas in Delhi
    delhi_areas = [
         "Saket", "Hauz Khas Village", "Hauz Khas Enclave", "Malviya Nagar", "Sheikh Sarai",
    "Kalkaji", "Govindpuri", "Nehru Place", "Greater Kailash I", "Greater Kailash II",
    "Chittaranjan Park", "Lajpat Nagar I", "Lajpat Nagar II", "Lajpat Nagar III", "Lajpat Nagar IV",
    "Defence Colony", "Green Park", "South Extension I", "South Extension II", "Vasant Kunj Sector A",
    "Vasant Kunj Sector B", "Vasant Kunj Sector C", "Vasant Vihar", "Munirka", "R.K. Puram Sector 1",
    "R.K. Puram Sector 2", "R.K. Puram Sector 3", "R.K. Puram Sector 4", "R.K. Puram Sector 5",
    "R.K. Puram Sector 6", "R.K. Puram Sector 7", "R.K. Puram Sector 8", "R.K. Puram Sector 9",
    "R.K. Puram Sector 10", "R.K. Puram Sector 11", "R.K. Puram Sector 12", "R.K. Puram Sector 13",

    # Central Delhi
    "Connaught Place", "Karol Bagh", "Paharganj", "Patel Nagar", "Rajendra Nagar",
    "Jhandewalan", "Daryaganj", "I.T.O", "Minto Road", "Gole Market", "Ajmeri Gate",
    "Chawri Bazar", "Turkman Gate", "Ramlila Maidan", "Barakhamba Road",

    # North Delhi
    "Civil Lines", "Model Town Phase I", "Model Town Phase II", "Model Town Phase III",
    "Kamla Nagar", "Mukherjee Nagar", "Kingsway Camp", "GTB Nagar", "Ashok Vihar Phase I",
    "Ashok Vihar Phase II", "Ashok Vihar Phase III", "Ashok Vihar Phase IV", "Timarpur",
    "Wazirabad", "Inderlok", "Shakti Nagar", "Subzi Mandi",

    # West Delhi
    "Punjabi Bagh West", "Punjabi Bagh East", "Paschim Vihar", "Janakpuri Block A",
    "Janakpuri Block B", "Janakpuri Block C", "Janakpuri Block D", "Tilak Nagar",
    "Vikaspuri", "Hari Nagar", "Rajouri Garden", "Subhash Nagar", "Kirti Nagar",
    "Moti Nagar", "Shivaji Enclave", "Ramesh Nagar", "Tagore Garden", "Mayapuri",

    # East Delhi
    "Laxmi Nagar", "Preet Vihar", "Karkardooma", "Krishna Nagar", "Shakarpur",
    "Anand Vihar", "Mayur Vihar Phase I", "Mayur Vihar Phase II", "Patparganj",
    "Geeta Colony", "Mandawali", "Vivek Vihar", "Nirman Vihar", "Pandav Nagar",
    "IP Extension", "Chander Nagar",

    # North West Delhi
    "Rohini Sector 3", "Rohini Sector 7", "Rohini Sector 11", "Rohini Sector 13",
    "Rohini Sector 16", "Rohini Sector 18", "Pitampura", "Shalimar Bagh",
    "Netaji Subhash Place", "Prashant Vihar", "Kohat Enclave", "Saraswati Vihar",
    "Mangolpuri", "Rani Bagh", "Keshav Puram", "Lawrence Road",

    # South West Delhi
    "Dwarka Sector 6", "Dwarka Sector 10", "Dwarka Sector 12", "Dwarka Sector 14",
    "Dwarka Sector 18", "Palam", "Bijwasan", "Najafgarh", "Uttam Nagar", "Om Vihar",
    "Bindapur", "Sagarpur", "Mahavir Enclave", "Vikas Puri", "Janakpuri Extension",

    # North East Delhi
    "Seelampur", "Yamuna Vihar Block A", "Yamuna Vihar Block B", "Bhajanpura",
    "Shahdara", "Welcome Colony", "Maujpur", "Jafrabad", "Dilshad Garden",
    "Gokulpuri", "Nand Nagri", "Karawal Nagar", "Mustafabad", "Ghonda",
    "Babarpur", "Chauhan Bangar",
    "Chanakyapuri", "Sarojini Nagar", "Moti Bagh", "Lodhi Colony", "Sundar Nagar",
    "Panchsheel Marg", "Race Course Road", "Tughlak Road", "Pandara Road",
    "Janpath", "Rajpath", "India Gate Circle", "Connaught Place Inner Circle",
    "Connaught Place Outer Circle"
    ]
    
    location_matches = []
    # Search for Delhi areas mentioned in the text
    for area in delhi_areas:
        if re.search(r'\b' + re.escape(area) + r'\b', text):
            location_matches.append(area)
    
    # Also look for specific patterns indicating location
    location_patterns = [
        r'in\s+([A-Z][a-z]+(?: [A-Z][a-z]+)*)\s+area',
        r'at\s+([A-Z][a-z]+(?: [A-Z][a-z]+)*)\s+in Delhi',
        r'in\s+([A-Z][a-z]+(?: [A-Z][a-z]+)*)\s+of Delhi',
        r'in\s+([A-Z][a-z]+(?: [A-Z][a-z]+)*),?\s+Delhi',
    ]
    
    for pattern in location_patterns:
        matches = re.findall(pattern, text)
        for match in matches:
            if match not in location_matches and len(match) > 3:  # Avoid short abbreviations
                location_matches.append(match)
    
    # Look for police station mentions as they often indicate areas
    police_station_match = re.search(r'([A-Za-z\s]+)\s+police\s+station', text)
    if police_station_match:
        ps_area = police_station_match.group(1).strip()
        if ps_area not in location_matches and len(ps_area) > 3:
            location_matches.append(f"{ps_area} (Police Station Area)")
    
    if location_matches:
        return ", ".join(set(location_matches))
    
    # If no specific locations found, check for general areas
    general_areas = ["North Delhi", "South Delhi", "East Delhi", "West Delhi", "Central Delhi", "New Delhi"]
    for area in general_areas:
        if area in text:
            return area
            
    return "Delhi (specific area not mentioned)"

# Extract timeframe information
def extract_timeframe(text, publish_date):
    # Try to find date patterns in the text
    date_patterns = [
        r'(?:on|dated)\s+(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December),?\s+\d{4})',
        r'(?:on|dated)\s+(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec),?\s+\d{4})',
        r'(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December),?\s+\d{4})',
        r'(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec),?\s+\d{4})',
        r'(?:on|dated)\s+(\d{1,2}-\d{1,2}-\d{4})',
        r'(?:on|dated)\s+(\d{1,2}/\d{1,2}/\d{4})'
    ]
    
    for pattern in date_patterns:
        match = re.search(pattern, text)
        if match:
            return f"Incident date: {match.group(1)}"
    
    # Look for relative time indicators
    time_indicators = [
        (r'yesterday', "1 day before article publication"),
        (r'last\s+night', "Night before article publication"),
        (r'last\s+week', "Week before article publication"),
        (r'last\s+month', "Month before article publication"),
        (r'few\s+days\s+ago', "Few days before article publication"),
        (r'(\d+)\s+days\s+ago', lambda m: f"{m.group(1)} days before article publication"),
        (r'(\d+)\s+weeks\s+ago', lambda m: f"{m.group(1)} weeks before article publication"),
        (r'(\d+)\s+months\s+ago', lambda m: f"{m.group(1)} months before article publication")
    ]
    
    for pattern, result in time_indicators:
        match = re.search(pattern, text.lower())
        if match:
            if callable(result):
                return f"Incident timeframe: {result(match)}"
            else:
                return f"Incident timeframe: {result}"
    
    return f"Timeframe unknown (article published on {publish_date})"

def scrape_articles(urls):
    options = Options()
    options.add_argument("--headless")
    driver = webdriver.Firefox(options=options)
    
    results = []
    
    for i, url in enumerate(urls):
        try:
            print(f"Processing article {i+1}/{len(urls)}: {url}")
            driver.get(url)
            time.sleep(2)  # Give page time to load
            
            # Extract article data
            article_data = {
                "url": url,
                "title": "N/A",
                "publish_date": "N/A",
                "content": "N/A",
                "offense_type": "Unknown",
                "location": "Unknown",
                "timeframe": "Unknown"
            }
            
            # Get article title
            try:
                article_data["title"] = driver.find_element(By.CSS_SELECTOR, "h1.sp-ttl").text.strip()
            except NoSuchElementException:
                try:
                    article_data["title"] = driver.find_element(By.CSS_SELECTOR, "h1.entry-title").text.strip()
                except NoSuchElementException:
                    print(f"  - Could not find title for {url}")
            
            # Get publish date
            try:
                publish_date = driver.find_element(By.CSS_SELECTOR, ".pstdat, .pstdat_art, .update_date").text.strip()
                article_data["publish_date"] = publish_date
            except NoSuchElementException:
                print(f"  - Could not find publish date for {url}")
            
            # Get article content
            try:
                # Try different selectors for article content
                content_selectors = [
                    ".sp-cn, .story__content", 
                    ".content_text", 
                    "article .ins_storybody", 
                    ".story-details"
                ]
                
                for selector in content_selectors:
                    try:
                        content_elements = driver.find_elements(By.CSS_SELECTOR, selector)
                        if content_elements:
                            content = " ".join([el.text for el in content_elements])
                            article_data["content"] = content
                            break
                    except:
                        continue
            except:
                print(f"  - Could not find content for {url}")
            
            # Process the extracted content for offense type, location and timeframe
            if article_data["content"] != "N/A":
                full_text = f"{article_data['title']} {article_data['content']}"
                article_data["offense_type"] = extract_offense_type(full_text)
                article_data["location"] = extract_location(full_text)
                article_data["timeframe"] = extract_timeframe(full_text, article_data["publish_date"])
                
                # Save partial results as we go
                results.append(article_data)
                print(f"  - Successfully processed: {article_data['title']}")
                print(f"  - Offense type: {article_data['offense_type']}")
                print(f"  - Location: {article_data['location']}")
                print(f"  - Timeframe: {article_data['timeframe']}")
            else:
                print(f"  - Skipping analysis due to missing content")
            
            # Add a small delay between requests to be respectful to the server
            time.sleep(1)
        
        except Exception as e:
            print(f"  - Error processing {url}: {e}")
            continue
    
    driver.quit()
    return results

# Write results to CSV
def write_results_to_csv(results, output_file):
    with open(output_file, 'w', newline='', encoding='utf-8') as file:
        fieldnames = ["url", "title", "publish_date", "offense_type", "location", "timeframe", "content"]
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        
        writer.writeheader()
        for item in results:
            writer.writerow(item)

if __name__ == "__main__":
    csv_file = "ndtv_rape_cases_delhi_urls.csv"  # Your CSV with URLs
    output_file = "delhi_crime_data_for_ml.csv"  # Output file with extracted info
    
    # Load URLs
    urls = load_urls_from_csv(csv_file)
    print(f"Loaded {len(urls)} URLs from CSV file")
    
    # Scrape articles
    results = scrape_articles(urls)
    
    # Write results to CSV
    write_results_to_csv(results, output_file)
    print(f"Finished! Scraped data from {len(results)} articles saved to {output_file}")