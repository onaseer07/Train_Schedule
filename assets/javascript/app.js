$(document).ready(function(){

// Firebase Config
    var config = {
        apiKey: "AIzaSyC-DcaBOCFBQjwkQdWd4PGgqf7Tu0i05uQ",
        authDomain: "trainschedule-ebf45.firebaseapp.com",
        databaseURL: "https://trainschedule-ebf45.firebaseio.com",
        projectId: "trainschedule-ebf45",
        storageBucket: "",
        messagingSenderId: "15990101701"
    };
//Firebase initialize connecting to the Backend service
    firebase.initializeApp(config); 

//Storing firebase.database variable into database variable container
    var database = firebase.database();

/* FROM FIREBASE DOCUMENTATION */

//Creating and selecting trainInfo child in the root directory and setting up active child added listener
    database.ref("trainInfo").on("child_added",function(snapshot){

//Creating variables to perform time calculations using Moment.js

        //Converting train start time into 1-12 subtracting a year from the day 
        var firstTrainTimeConversion = moment(snapshot.val().firstTrainTime, "hh:mm").subtract(1, "years");
        //Finding time difference between current time and the converted time
        var timeDifference = moment().diff(moment(firstTrainTimeConversion), "minutes");
        //storing the remainder of time difference and the frequency
        var timeRemainder = timeDifference % snapshot.val().Frequency;
        //storing the minutes away value by subtracting time remainder from the frequency
        var minutesAway = snapshot.val().Frequency - timeRemainder;
        //storing the next arrival by adding minutes away to current time
        var nextArrival = moment().add(minutesAway, "minutes");
        //formatting and storing formatted version of the next arrival value as 1-12 with AM/PM
        var nextArrivalFormatted = moment(nextArrival).format("hh:mm A");
        //Grab the tBody id element and add the trainName, Destination, Frequency values from the database

        // display the calculated nextArrival time & minutesAway local value 
        $("#tBody").append(`
        <tr>
        <td>${snapshot.val().trainName}</td>
        <td>${snapshot.val().Destination}</td>
        <td>${snapshot.val().Frequency}</td>
        <td>${nextArrivalFormatted}</td>
        <td>${minutesAway}</td>

        </tr>   
        `)
    });


    //Create an on click event listener
    $("#add").on("click", function(event){
        //prevent the button to reload the browser
        event.preventDefault();

        //create a trainInfo object with the nodes trainName, Destination, 1stTrainTime, Frequency assigning to user's input values
        var trainInfo = {
            trainName:$("#trainName").val(),
            Destination: $("#destination").val(),
            firstTrainTime: $("#firstTrainTime").val(),
            Frequency: $("#frequency").val(),
        };
        //Check to make sure that the inputs are not blank. If blank display the message to user to enter all inputs.
        if (trainInfo.trainName == "" || trainInfo.Destination == "" ||trainInfo.firstTrainTime =="" || trainInfo.Frequency =="") {
            $("#addTrainHeader").append(`
            <h6 style = "color:red;">Please complete all the fields. 
            `)
        } else {
        //push the user input to the database by sending the trainInfo Object
        database.ref("trainInfo").push(trainInfo);
        //clear out the form-controls value for the next input
        $(".form-control").val("");
        }

    });
    //adding bg slidshow for style
    $.backstretch([
        "assets/images/bg.jpg"
      , "assets/images/bg2.jpg"
      , "assets/images/bg3.jpg"
    ], {duration: 6000, fade: 750});
})