from googlegeocoder import GoogleGeocoder
import csv

geocoder = GoogleGeocoder("TOKEN GO HERE")
visited = set()
rawData = []

states_hash = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'District Of Columbia': 'DC',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Guam': 'GU',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virginia': 'VA',
    'Washington': 'WA',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
  }

def mapState(currentAddress):
    currentAddress = str(currentAddress)
    addressList = currentAddress.split(',')
    stateZip = addressList[-2].strip()
    try:
        state, zipcode = stateZip.split(' ')
        for stateName, statePh in states_hash.items():
            if statePh == state:
                state = stateName
                break
    except:
        state = 'Null'
    return state

with open('../P5 Datasets/colleges.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    i = 0
    for row in readCSV:
        if i == 0:
            i += 1
            continue
        schoolName = row[0]
        area = row[4]
        if (schoolName not in visited):
            visited.add(schoolName)
        else:
            schoolName += ' - ' + area
        print(schoolName)
        search = geocoder.get(schoolName)
        state = mapState(search[0])
        latitude, longitude = search[0].geometry.location.lat, search[0].geometry.location.lng
        rawData.append({'schoolName': schoolName, 'longitude': longitude, 'latitude': latitude, 'state': state, 'admission': row[6], 'act': row[7], 'sat': row[8], 'radius': 1, 'control' : row[3], 'population': row[9], 'white' : row[10], 'black': row[11], 'hispanic': row[12], 'asian': row[13], 'indian': row[14], 'islander': row[15]})


# Write data to new csv
with open('../collegesLocation.csv', mode='w') as csv_file:
    fieldnames = ['schoolName', 'longitude', 'latitude', 'state', 'admission', 'act', 'sat', 'radius', 'control', 'population', 'white', 'black', 'hispanic', 'asian', 'indian', 'islander']
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    writer.writeheader()
    for row in rawData:
        writer.writerow(row)