from flask import Flask, request, jsonify
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

script_dir = os.path.dirname(os.path.abspath(__file__))
data_file = os.path.join(script_dir, 'assets', 'galaxy.json')

with open(data_file, 'r', encoding='utf-8') as f:
    data_store = json.load(f)

@app.route('/search', methods=['GET'])
def search():
    filters = request.args.get('filters', '').lower().split(',')

    filtered_results = []

    if filters and filters != ['']:
        for item in data_store:
            for filter_keyword in filters:
                if filter_matches(item, filter_keyword):
                    filtered_results.append(item)
                    break  # Item nur einmal hinzufügen
    else:
        # Keine Filter gesetzt: Alles anzeigen
        filtered_results = data_store

    return jsonify({'results': filtered_results})

def filter_matches(item, filter_keyword):
    keyword = filter_keyword.lower()
    if filter_keyword == 'station' and 'station' in item.lower():
        return True
    if filter_keyword == 'system' and 'system' in item.lower():
        return True
    if filter_keyword == 'point' and 'point' in item.lower():
        return True
    return False

if __name__ == '__main__':
    app.run(debug=True, port=5000)
