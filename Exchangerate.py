import urllib.request
import json

def get_data():
	req = urllib.request.urlopen('https://api.exchangeratesapi.io/history?start_at=2018-01-01&end_at=2018-09-01&base=USD')
	raw = json.loads(req.read().decode())

