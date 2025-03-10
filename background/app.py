from flask import Flask, request, jsonify,send_from_directory
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

script_dir = os.path.dirname(os.path.abspath(__file__))
data_file = os.path.join(script_dir, 'assets', 'galaxy.json')
assets_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'video')

with open(data_file, 'r', encoding='utf-8') as f:
    data_store = json.load(f)
    
@app.route('/icons/<path:filename>')
def serve_icon(filename):
    return send_from_directory(os.path.join(app.root_path, 'assets/icons'), filename)

@app.route('/video/<filename>')
def serve_video(filename):
    return send_from_directory(assets_dir, filename)


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
    if filter_keyword == 'specialstars' and 'special stars' in item.lower():
        return True
    return False

if __name__ == '__main__':
    app.run(debug=True, port=5000)
