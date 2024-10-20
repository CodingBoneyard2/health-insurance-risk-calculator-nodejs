const express = require('express')
app = express()

const cors = require("cors")

var url = require('url');

const port = process.env.PORT || 3000
const majorVersion = 1
const minorVersion = 3

// Use Express to publish static HTML, CSS, and JavaScript files that run in the browser. 
app.use(express.static(__dirname + '/static'))
app.use(cors({ origin: '*' }))

app.get('/version', (request, response) => {
	console.log('Calling "/version" on the Node.js server.')
	response.type('text/plain')
	response.send('Version: '+majorVersion+'.'+minorVersion)
})

app.get('/api/ping', (request, response) => {
	console.log('Calling "/api/ping"')
	response.type('text/plain')
	response.send('ping response')
})

// Template for calculating BMI using height in feet/inches and weight in pounds.
app.get('/bmi-calculator', (request, response) => {
    console.log('Calling "/bmi-calculator" on the Node.js server.');
    var inputs = url.parse(request.url, true).query;
    const heightFt = parseInt(inputs.feet);
    const heightIns = parseInt(inputs.inches);
    const weight = parseInt(inputs.lbs);

    console.log('Height: ' + heightFt + '\'' + heightIns + '\"');
    console.log('Weight: ' + weight + ' lbs.');

    // Converts height to inches
    const totalHeightIns = (heightFt * 12) + heightIns;

    // Converts the height over to meters
    const heightMtr = totalHeightIns * 0.0254;

    // Converts the weight from pounds to kilograms
    const weightKg = weight * 0.453592;

    // Does the equation to solve for bmi
    const bmi = weightKg / (heightMtr * heightMtr);

    // This decides the status
    let points;
    let bmiResult;
    if (bmi < 18.5) {
        points = 30;
        bmiResult = 'Underweight';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        points = 0;
        bmiResult = 'Normal';
    } else if (bmi >= 25.0 && bmi <= 29.9) {
        points = 30;
        bmiResult = 'Overweight';
    } else {
        points = 75;
        bmiResult = 'Obese';
    }

    // Return points and category
    response.type('text/plain');
    response.send(`${bmiResult}`);
})

// Template for calculating points
app.get('/point-system', (request, response) => {
  console.log('Calling "/point-system" on the Node.js server.');
  var inputs = url.parse(request.url, true).query;
  const ageGroup = parseInt(inputs.agegroup);
  const bmiResults = parseInt(inputs.bmiresults);
  const bloodPressure = parseInt(inputs.bloodpressure);
  const familyDiseases = parseInt(inputs.familydiseases);

  let points;

  // Age Group
  if (ageGroup === 'age-1') {
    points += 0;
  } else if (ageGroup === 'age-2') {
    points += 10;
  } else if (ageGroup === 'age-3') {
    points += 20;
  } else {
    points += 30;
  }

  // BMI points
  if (bmiResults === "Results Will Display Here") {
    points +=0;
  }
  else if (bmiResults === "Normal") {
    points += 0;
  } else if (bmiResults === "Overweight") {
    points += 30;
  } else if (bmiResults === "Underweight") {
    points += 30;
  }else {
    points += 75;
  }

  // Blood Pressure points
  if (bloodPressure === 'normal') {
    points += 0;
  } else if (bloodPressure === 'elevated') {
    points += 15;
  } else if (bloodPressure === 'st-1') {
    points += 30;
  } else if (bloodPressure === 'st-2') {
    points += 75;
  } else if (bloodPressure === 'crisis') {
    points += 100;
  }

  // family diseases points
  if (familyDiseases === 'None') {
  points += 10;
  } else if (familyDiseases === 'Cancer') {
  points += 10;
  } else if (familyDiseases === 'Diabetes') {
  points += 10;
  } else if (familyDiseases === 'Hypertension') {
  points += 10;
  }

  // Determine risk category
  let insuranceStatus;
  if (points <= 20) {
    insuranceStatus = 'Low risk';
  } else if (points <= 50) {
    insuranceStatus = 'Moderate risk';
  } else if (points <= 75) {
    insuranceStatus = 'High risk';
  } else {
    insuranceStatus = 'Uninsurable';
  }

  // Return points and category
  response.type('text/plain');
  response.send(${insuranceStatus});
})

// Custom 404 page.
app.use((request, response) => {
  response.type('text/plain')
  response.status(404)
  response.send('404 - Not Found')
})

// Custom 500 page.
app.use((err, request, response, next) => {
  console.error(err.message)
  response.type('text/plain')
  response.status(500)
  response.send('500 - Server Error')
})

app.listen(port, () => console.log(
  `Express started at \"http://localhost:${port}\"\n` +
  `press Ctrl-C to terminate.`)
)
