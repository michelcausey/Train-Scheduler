$(document).ready(function () {
    console.log("start!");
});

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCp9VqxMnwdmqbKxSDGptRuMtwmBU4U_3I",
    authDomain: "train-project-6ed38.firebaseapp.com",
    databaseURL: "https://train-project-6ed38.firebaseio.com",
    projectId: "train-project-6ed38",
    storageBucket: "train-project-6ed38.appspot.com",
    messagingSenderId: "563053025528"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// Add Button
$("#add-train-button").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDest = $("#destination-input").val().trim();
  var firstDeparture = $("#departure-time-input").val().trim();
  var departureFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding employee data
  var addTrain = {
    name: trainName,
    destination: trainDest,
    start: firstDeparture,
    frequency: departureFrequency
  };

  // Push addTrain data to firebase
  database.ref().push(addTrain);

  // Logs everything to console
  console.log(addTrain.name);
  console.log(addTrain.destination);
  console.log(addTrain.start);
  console.log(addTrain.frequency);

 // alert("Employee successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#departure-time-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().destination;
  var firstDeparture = childSnapshot.val().start;
  var departureFrequency = childSnapshot.val().frequency;

  // Train Info
  console.log("----------")
  console.log("Added Train Name: " + trainName);
  console.log("Added Train Destination: " + trainDest);
  console.log("Added Train First Departure: " + firstDeparture);
  console.log("Added Train Departure Frequency: " + departureFrequency);
  

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstDeparture, "HH:MM").subtract(1, "years");
  console.log("First Time Converted" + firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % departureFrequency;
  console.log("Time to Next Train: " + tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = departureFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // Create the add row
  var addRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDest),
    $("<td>").text(firstDeparture),
    $("<td>").text(departureFrequency),
    $("<td>").text(nextTrain)
  );

  // Append the add row to the table
  $("#train-table > tbody").append(addRow);
});
