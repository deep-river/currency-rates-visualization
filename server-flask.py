from flask import Flask, jsonify, render_template, request, make_response
import json
import urllib.request
from datetime import date,timedelta

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/dataToEcharts.js')
def dataToEcharts():
	return app.send_static_file('dataToEcharts.js')

@app.route('/data',  methods=['GET'])
def getData():
	if request.method == "GET":
		dateUntil = date.today()
		dateFrom = dateUntil - timedelta(days=30)
		currencylist = ["CAD", "CNY", "EUR", "HKD", "JPY"]
		timelist = []
		valuedict = {}
		res = urllib.request.urlopen('https://api.exchangeratesapi.io/history?start_at=%s&end_at=%s&base=USD' % (str(dateFrom),str(dateUntil)))
		res_lat = urllib.request.urlopen('https://api.exchangeratesapi.io/latest?base=USD')
		raw = json.loads(res.read().decode())
		raw_lat = json.loads(res_lat.read().decode())
		for dates in raw['rates']:
			timelist.append(dates)
			for cur in currencylist:
				if cur in valuedict:
					valuedict[cur].append(raw['rates'][dates][cur])
				else:
					valuedict[cur] = [raw['rates'][dates][cur]]
		vals = {'dates':timelist, 'currency':currencylist, 'values':valuedict, 'latest':raw_lat['rates']}
		data = json.dumps(vals, ensure_ascii=False)
		return data

@app.errorhandler(404)
def not_found(error):
	return make_response(jsonify({'error': 'Not found'}), 404)


if __name__ == '__main__':

	app.run()
