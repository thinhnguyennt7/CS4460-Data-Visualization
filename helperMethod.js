// Helper method to get out the list of tuition by filter
function tuitionChecking(data, averageTuitionSelected) {
    if (averageTuitionSelected.length) {
        var actualTuitionVal = data["TUITION"];
        var rateRange = '';
        switch(true) {
            case (actualTuitionVal <= 10000):
                rateRange = '0 - $10,000';
                break;
            case (actualTuitionVal >= 10000 && actualTuitionVal <= 20000):
                rateRange = '10,000 - $20,000';
                break;
            case (actualTuitionVal >= 20000 && actualTuitionVal <= 30000):
                rateRange = '20,000 - $30,000';
                break;
            case (actualTuitionVal >= 30000 && actualTuitionVal <= 40000):
                rateRange = '30,000 - $40,000';
                break;
            case (actualTuitionVal >= 40000 && actualTuitionVal <= 50000):
                rateRange = '40,000 - $50,000';
                break;
            case (actualTuitionVal >= 50000 && actualTuitionVal <= 60000):
                rateRange = '50,000 - $60,000';
                break;
            case (actualTuitionVal >= 60000 && actualTuitionVal <= 70000):
                rateRange = '60,000 - $70,000';
                break;
            case (actualTuitionVal >= 70000 && actualTuitionVal <= 80000):
                rateRange = '70,000 - $80,000';
                break;
            case (actualTuitionVal >= 80000 && actualTuitionVal <= 90000):
                rateRange = '80,000 - $90,000';
                break;
            default:
                rateRange = '90,000 - $100,000';
                break;
        }
        return averageTuitionSelected.includes(rateRange);
    }
    return true;
}

// Helper method to get out the list of region by filter
function regionChecking(data, regionSelected) {
    if (regionSelected.length) {
        return regionSelected.includes(data["REGION"]);
    }
    return true;
}

// Helper method to get out the list of admission by filter
function admissionChecking(data, admissionWeightSelected) {
    if (admissionWeightSelected.length) {
        var actualAdmissionVal = data["RATE"] * 100;
        var rateRange = '';

        switch(true) {
            case (actualAdmissionVal <= 10):
                rateRange = '0.0 - 10%';
                break;
            case (actualAdmissionVal >= 10 && actualAdmissionVal <= 20):
                rateRange = '10 - 20%';
                break;
            case (actualAdmissionVal >= 20 && actualAdmissionVal <= 30):
                rateRange = '20 - 30%';
                break;
            case (actualAdmissionVal >= 30 && actualAdmissionVal <= 40):
                rateRange = '30 - 40%';
                break;
            case (actualAdmissionVal >= 40 && actualAdmissionVal <= 50):
                rateRange = '40 - 50%';
                break;
            case (actualAdmissionVal >= 50 && actualAdmissionVal <= 60):
                rateRange = '50 - 60%';
                break;
            case (actualAdmissionVal >= 60 && actualAdmissionVal <= 70):
                rateRange = '60 - 70%';
                break;
            case (actualAdmissionVal >= 70 && actualAdmissionVal <= 80):
                rateRange = '70 - 80%';
                break;
            case (actualAdmissionVal >= 80 && actualAdmissionVal <= 90):
                rateRange = '80 - 90%';
                break;
            default:
                rateRange = '90 - 100%';
                break;
        }
        return admissionWeightSelected.includes(rateRange);
    }
    return true;
}

// Helper method to get out the list of control type by filter
function controlTypeChecking(data, controlTypeSelected) {
    if (controlTypeSelected.length) {
        return controlTypeSelected.includes(data["CONTROL"]);
    }
    return true;
}

// Helper method to update data from the list view
function updateData(data) {
    d3.select(".showSchoolDetail").remove();
}

function settingUpDropdown(area, control, admission, tuition, data) {
    var duplicatedSet = new Set();
    var set = new Set();
    var areaOption = '<option selected>Choose...</option>';
    var controlOption = '<option selected>Choose...</option>';
    for (var i = 0; i < data.length; i++) {
        var currentRegion = data[i].Region;
        var currentControl = data[i].Control;
        var currentAverage = data[i]['Average Cost'];

        // Check for duplicate control
        if (!set.has(currentControl)) {
            set.add(currentControl);
            controlOption += '<option value="'+ currentControl + '">' + currentControl + '</option>';
        }

        // Check for duplicate region
        if (!duplicatedSet.has(currentRegion)) {
            duplicatedSet.add(currentRegion);
            areaOption += '<option value="'+ currentRegion + '">' + currentRegion + '</option>';
        }
    }

    var admission = {
        "0" : "0.0 - 10%",
        "1" : "10 - 20%",
        "2" : "20 - 30%",
        "3" : "30 - 40%",
        "4" : "40 - 50%",
        "5" : "50 - 60%",
        "6" : "60 - 70%",
        "7" : "70 - 80%",
        "8" : "80 - 90%",
        "9" : "90 - 100%"
    }

    var averageCost = {
        "0" : "0 - $10,000",
        "1" : "10,000 - $20,000",
        "2" : "20,000 - $30,000",
        "3" : "30,000 - $40,000",
        "4" : "40,000 - $50,000",
        "5" : "50,000 - $60,000",
        "6" : "60,000 - $70,000",
        "7" : "70,000 - $80,000",
        "8" : "80,000 - $90,000",
        "9" : "90,000 - $100,000"
    }

    var admissionOption = '<option selected>Choose...</option>';
    var tuitionOption = '<option selected>Choose...</option>';
    for (var key in admission) {
        admissionOption += '<option value="'+ key + '">' + admission[key] + '</option>';
        tuitionOption += '<option value="'+ key + '">' + averageCost[key] + '</option>';
    }

    $('#areasFilter').append(areaOption);
    $('#controlTypeFilter').append(controlOption);
    $('#admissionFilter').append(admissionOption);
    $('#averageFilter').append(tuitionOption);
}

// Helper method to update single click view on chart
function updateSchoolDetailSingleView(schoolData) {
    // Clean up the view
    d3.select(".schoolDetailView").remove();
    var tableView = d3.select('#showSchoolDetail')
        .append("table")
        .attr("class", "schoolDetailView");

    var htmlView = tableView
        .append("htmlView")

    htmlView.append('tr')
        .text(schoolData["Name"])
        .style("font-weight", "bold")
        .style("font-size", "20px")
    htmlView.append('tr')
        .text("School Type: " + schoolData["CONTROL"])
    htmlView.append('tr')
        .text("School Region: " + schoolData["REGION"])
    htmlView.append('tr')
        .text("Admission Rate: " + schoolData["RATE"] * 100 + "%")
    htmlView.append('tr')
        .text("Average Tuition: $" + schoolData["TUITION"])
    htmlView.append('tr')
        .text("Undergraduate Population: " + schoolData["POPULATION"])
}