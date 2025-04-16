import requests
from bs4 import BeautifulSoup
import re
import spacy
import csv
from news_urls import news_urls
query = "crime against women in Delhi after:2024 before:2026 site:timesofindia.indiatimes.com"

            
# for url in search(query, num_results=10):
#     print(url)
#     news_urls.append(url)

print(f"\nTotal URLs collected: {len(news_urls)}")

nlp = spacy.load("en_core_web_sm")

delhi_areas = sorted(list(set([
    "rohini", "dwarka", "pitampura",
    "janakpuri", "vikaspuri", "uttam nagar", "palam", "mayur vihar", "preet vihar", "laxmi nagar",
    "geeta colony", "shahdara", "gokalpuri", "nand nagri", "karawal nagar", "seelampur", "burari",
    "timarpur", "civil lines", "model town", "kingsway camp", "adarsh nagar", "ashok vihar",
    "shalimar bagh", "netaji subhash place", "azadpur", "jahangirpuri", "mukherjee nagar",
    "kamla nagar", "gtb nagar", "karol bagh", "rajinder nagar", "connaught place", "rajouri garden",
    "tilak nagar", "kirti nagar", "subhash nagar", "paschim vihar", "moti nagar", "punjabi bagh",
    "indra vihar", "shastri nagar", "naraina", "sadar bazar", "chandni chowk", "daryaganj",
    "kashmere gate", "paharganj", "okhla", "jamia nagar", "sangam vihar", "badarpur",
    "tughlakabad", "sarita vihar", "jasola", "kalkaji", "govindpuri", "malviya nagar", "saket",
    "mehrauli", "vasant vihar", "vasant kunj", "harkesh nagar", "green park", "hauz khas", "munirka",
    "ber sarai", "katwaria sarai", "rk puram", "chanakyapuri", "defence colony", "lodhi colony",
    "greater kailash", "cr park", "nehru place", "lajpat nagar", "east of kailash", "ashram",
    "friends colony", "moolchand", "moti bagh", "sarojini nagar", "majnu ka tila", "badli",
    "narela", "bawana", "bijwasan", "najafgarh", "kapashera", "mahavir enclave", "madhu vihar",
    "patparganj", "vasundhara enclave", "kondli", "trilokpuri", "khichripur", "kalyanpuri",
    "maujpur", "yamuna vihar", "bhajanpura", "welcome", "anand vihar", "anand parbat", "mandawali",
    "ghazipur", "pandav nagar", "ip extension", "bapu dham", "delhi cantt", "vishwas nagar",
    "vijay vihar", "mangolpuri", "sultanpuri", "budh vihar", "rohini sector 3", "rohini sector 7","mahipalpur",
    "rohini sector 13", "rohini west", "rohini east", "shahbad dairy","ito", "noida", "gurugram", "mayur vihar", "aiims", 

    "adarsh nagar", "ashok vihar", "keshav puram", "shalimar bagh", "shastri nagar", "azadpur", "greater noida", "dairy"
    "hakikat nagar", "kamla nagar", "kashmiri gate", "daryaganj", "sarai rohilla", "gtb nagar",
    "majnu-ka-tilla", "new aruna nagar", "aruna nagar", "dilshad garden", "naveen shahdara",
    "shastri park", "bhikaji cama place", "gole market", "paharganj", "patel chowk",
    "janpath metro", "ito", "jama masjid", "rk ashram park", "aerocity", "lodhi colony",
    "mahipalpur", "rajiv chowk", "pragati maidan", "rajendra place", "mayur vihar phase i",
    "mayur vihar phase ii", "akshardham", "nirman vihar", "mayur vihar", "anand vihar",
    "green park", "hauz khas", "iit", "kailash colony", "maharani bagh", "munirka", "r.k. puram",
    "safdarjung enclave", "shaheen bagh", "south extension", "ashram chowk", "khan market",
    "okhla nsic", "nizamuddin", "sarai kale khan", "jangpura", "nehru enclave", "greater kailash",
    "gk 1/2", "okhla phase i", "okhla phase ii", "tughlaqabad", "dwarka", "dwarka sector 8",
    "dwarka sector 10", "dwarka sector 11", "dwarka sector 12", "dwarka sector 13",
    "dwarka sector 14", "dwarka sector 9", "dwarka sector 21", "dashrath puri",
    "delhi cantonment", "dhaula kuan", "ghitorni", "moti bagh", "rama krishna puram",
    "sagar pur", "ashok nagar", "ramesh nagar", "nawada", "dwarka mor", "mayapuri",
    "shivaji place", "west patel nagar", "hari nagar", "gtb enclave", "ghaziabad", "gurgao"
])))




crime_keywords = [
    "rape", "gang rape", "molestation", "eve teasing", "sexual harassment",
    "domestic violence", "assault", "kidnapping", "stalking", "sexual",
    "harassed", "harassment", "trafficking", "abuse", "sexually assaulted",
    "groping", "dowry", "dowry death", "acid attack", "acid thrown",
    "cyber stalking", "cyberbullying", "obscene call", "forced marriage",
    "blackmail", "voyeurism", "outraging modesty", "verbal abuse",
    "physical abuse", "mental torture", "misbehaved", "touched inappropriately",
    "under influence", "intoxicated", "dragged", "forced", "exploited",
    "marital rape", "threatened", "beaten", "abducted", "intimidated",
    "indecent exposure", "sex racket", "porn circulation", "child marriage",
    "sexual exploitation", "manhandled", "murder"
]



# def extract_location_with_spacy(text):
#     doc = nlp(text)
#     for ent in doc.ents:
#         if ent.label_ == "GPE":
#             if 'delhi' in ent.text.lower():
#                 return ent.text.title()
#             # Against known localities
#             for area in delhi_areas:
#                 if area in ent.text.lower():
#                     return area.title()
#     return "Unknown"

def extract_location_with_spacy(text):
    text_lower = text.lower()
    for area in delhi_areas:
        if area in text_lower:
            return area.title()
    # if "delhi" in text_lower:
    #     return "Delhi"
    return "Unknown"



# Extraction of data from one article
def extract_crime_data(url):
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        text = soup.get_text(separator=' ', strip=True).lower()

        # 1. Extract date using regex
        date_match = re.search(r'\b(\d{1,2} \w+ \d{4})\b', text) 
        date = date_match.group(1).title() if date_match else "Unknown"

        # 2. Extract location using spaCy
        location = extract_location_with_spacy(text)

        # 3. Extract type of crime
        crime_type = "Unknown"
        for keyword in crime_keywords:
            if keyword in text:
                crime_type = keyword.title()
                break

        return {
            "date": date,
            "location": location,
            "crime_type": crime_type
        }

    except Exception as e:
        print(f"Error with {url}: {e}")
        return {
            "date": "Error",
            "location": "Error",
            "crime_type": "Error"
        }


scraped_data=[]

for url in news_urls:
    print(f"Scapin: {url}")
    data=extract_crime_data(url)
    scraped_data.append(data)
    
with open("crime_data.csv", mode="w", newline="", encoding="utf-8") as file:
    writer = csv.DictWriter(file, fieldnames=["date", "location", "crime_type"])
    writer.writeheader()
    writer.writerows(scraped_data)
