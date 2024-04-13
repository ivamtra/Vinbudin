import requests
from bs4 import BeautifulSoup
import time
import random
#TODO: Setja bið til að vera ekki blokkaður

def query_wine_from_vivino(wine_name : str, tries=0) -> int | None:
    print(wine_name)
    try:

        time.sleep(0.1 + random.random()/10.0 )

        url = f"https://www.vivino.com/search/wines?q={wine_name}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0"
        }
        r = requests.get(url, headers=headers)

        while r.status_code == 429:
            print(f"Too many requests")
            print(f"Sleeping for {tries+1} minutes before trying again")
            time.sleep((tries+1)*60)
            r = requests.get(url,headers=headers)
            tries +=1


        website = r.text

        soup = BeautifulSoup(website, 'html.parser')
        target_div = soup.find('div', class_='average__number')

        if target_div == None:
            return None

        div_text = target_div.get_text(strip=True)
        number_int = int(div_text.replace(",", ""))
        print(f"Score: {number_int}")

        return number_int
    except Exception as e:
        print(f"An error occurred while querying Vivino for {wine_name}: {e}")
        return None



if __name__ == '__main__':
    print(query_wine_from_vivino('pinot noir'))