from googlegeocoder import GoogleGeocoder
import csv

#AIzaSyBf_0LzPWvwVHR7DqEiie2-ChFLSRobbPc
geocoder = GoogleGeocoder("")
visited = set()
rawData = []

with open('../P5 Datasets/colleges.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    i = 0
    for row in readCSV:
        if i == 0:
            i += 1
            continue
        schoolName = row[0]
        if (schoolName not in visited):
            print(schoolName)
            search = geocoder.get(schoolName)
            latitude, longitude = search[0].geometry.location.lat, search[0].geometry.location.lng
            visited.add(schoolName)
            rawData.append({'schoolName': schoolName, 'longitude': longitude, 'latitude': latitude})
        else:
            continue


# Write data to new csv
with open('../collegesLocation.csv', mode='w') as csv_file:
    fieldnames = ['schoolName', 'longitude', 'latitude']
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    writer.writeheader()
    for row in rawData:
        writer.writerow(row)