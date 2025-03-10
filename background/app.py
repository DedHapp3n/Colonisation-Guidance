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
    min_planets = int(request.args.get('minPlanets', 0)) 

    filtered_results = []

    if filters and filters != ['']:
        for item in data_store:
            if item.get("population", -1) == 0 and 'bodies' in item:  # Sicherstellen, dass bodies existiert
                if any(filter_matches(item, filter_keyword) for filter_keyword in filters):
                    planet_count = sum(1 for body in item['bodies'] if body['type'] == "Planet")
                    if planet_count >= min_planets:
                        filtered_results.append(item)
    else:
        filtered_results = [item for item in data_store if 'bodies' in item]  # Nur Objekte mit bodies zurückgeben

    return jsonify({'results': filtered_results})


def filter_matches(item, filter_keyword):
    keyword = filter_keyword.lower()
    bodies = item.get('bodies', [])
    special_star_types = ['Black Hole', 'Neutron Star']  #define special

    # Prüfe, ob ein Himmelskörper Ringe enthält
    if keyword == 'rings' and any('rings' in body and body['rings'] for body in bodies):
        return True

    # Falls nach bestimmten Ringtypen gefiltert werden soll (z. B. "Rocky")
    if keyword in ['rocky', 'metal rich', 'icy'] and any(
        'rings' in body and any(keyword in ring['type'].lower() for ring in body['rings'])
        for body in bodies
    ):
        return True

    # Standard-Filter für andere Objekttypen
    if keyword == 'star' and any('subType' in body and 'star' in body['subType'].lower() for body in bodies):
        return True
    if keyword == 'planet' and any('type' in body and 'planet' in body['type'].lower() for body in bodies):
        return True
    if keyword == 'station' and 'station' in item.get('name', '').lower():
        return True
    if keyword == 'system' and 'system' in item.get('name', '').lower():
        return True
    if keyword == 'specialstars' and any(
        'subType' in body and any(special_type.lower() in body['subType'].lower() for special_type in special_star_types)
        for body in bodies
    ):
        return True

    return False

if __name__ == '__main__':
    app.run(debug=True, port=5000)
