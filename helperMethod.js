function Interpolate(start, end, steps, count) {
    var s = start,
        e = end,
        final = s + (((e - s) / steps) * count);
    return Math.floor(final);
}

function Color(_r, _g, _b) {
    var r, g, b;
    var setColors = function (_r, _g, _b) {
        r = _r;
        g = _g;
        b = _b;
    };

    setColors(_r, _g, _b);
    this.getColors = function () {
        var colors = {
            r: r,
            g: g,
            b: b
        };
        return colors;
    };
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getPositionDetail(data, index) {
    let promises = [];
    while (promises.length == 0 && indexToBegin > 0) {
        for (let i = index; i < data.length; i++) {
            promises.push(new Promise((resolve) => {
                asyncCallHelper(data[i].Name).then((response) => {
                    console.log(i, response.status);
                    if (response.status == "Success") {
                        resolve(response.data);
                    } else {
                        getPositionDetail(data, i);
                    }
                });
            }))
            // if (++processes >= data.length) {
            //     // return {"success": Promise.all(promises), "fail" : Promise.all(lost_addresses)};
            //     return Promise.all(promises);
            // }
        }
    }
}

async function asyncCallHelper(schoolName) {
    return await new Promise(resolve => {
        var geocoder = new google.maps.Geocoder();
        var holder = {"schoolName": schoolName, "state": "", "latitude" : 0, "longitude": 0};
        geocoder.geocode({"address": schoolName}, (result, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                var i = 0;
                var state = "";
                while (!states_hash.hasOwnProperty(state) && i < 6) {
                    state = result[0].address_components[i].long_name;
                    i += 1;
                }
                holder.state = state;
                holder.latitude = result[0].geometry.location.lat();
                holder.longitude = result[0].geometry.location.lng();
                resolve({"data": holder, "status" : "Success"});
            } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                resolve({"data": schoolName, "status" : "Fail"});
            }
        });
    });
}

var states_hash =
  {
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