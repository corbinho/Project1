$(document).ready(function () {
    function openForm() {
        document.getElementById("myForm").style.display = "block";
      }
      
      function closeForm() {
        document.getElementById("myForm").style.display = "none";
      }


    var specialtyInput, symptomInput, zipInput;
    //on load, hide the content
    $("#results").hide();
    $(".footer").hide()

    $("#submit").on("click", function (event) {
        $("#results").show();
        $(".footer").show()
        //clear the table
        $("#table-body tr").remove();
        //get the user input
        event.preventDefault()
        specialtyInput = $("#specialty").val();
        specialtyInput = specialtyInput.toLowerCase();
        console.log("Specialty: " + specialtyInput);
        symptomInput = $("#symptoms").val();
        console.log("Symptoms: " + symptomInput);
        zipInput = $("#zip").val();
        console.log("Zip code: " + zipInput)

        //translate the zip code input into longitude and latitude
        var lat = '';
        var lng = '';
        var address = zipInput;
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                console.log(results);
                lat = results[0].geometry.location.lat();
                console.log(lat);
                lng = results[0].geometry.location.lng();
                console.log(lng);
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
            var docapikey = "3d8e6119d3a6fd86b2f6414e6f6ade72";
            var resource_url = 'https://api.betterdoctor.com/2016-03-01/doctors?query=' + symptomInput + "&specialty_uid=" + specialtyInput + "&location=" + lat + "%2c" + lng + "%2c5" + '&user_key=' + docapikey;
            console.log(resource_url)

            //get the response
            $.ajax({
                url: resource_url,
                method: "GET"
            }).then(function (response) {
                console.log(response)
                for (i = 0; i < 9; i++) {
                    //new table rows
                    var newTr = $("<tr>");
                    var newTd1 = $("<img>");
                    var newTd2 = $("<td>");
                    var newTd3 = $("<td>");
                    var newTd4 = $("<td>");
                    var newTd5 = $("<td>");

                    //new variables for doctor office locations

                    var myLatLng = {
                        lat: response.data[i].practices[0].lat,
                        lng: response.data[i].practices[0].lon
                    }
                    console.log(myLatLng)

                    newTd1.attr("src", response.data[i].profile.image_url);
                    newTd2.text(response.data[i].profile.first_name + " " + response.data[i].profile.last_name);
                    newTd3.text(response.data[i].specialties[0].name);
                    newTd4.text(response.data[i].practices[0].visit_address.city);
                    var newPatients = response.data[i].practices[0].accepts_new_patients;
                    console.log("accepting new patients: " + newPatients)
                    if (newPatients === true) {
                        newTd5.text("Yes");
                    } else {
                        newTd5.text("No");
                    }

                    //Append table data to table rows
                    newTr.append(newTd1, newTd2, newTd3, newTd4, newTd5);
                    //Append table row to the table body
                    var tableBody = $("#table-body")
                    //append my new row to the table body
                    tableBody.append(newTr)


                    //add markers to the map
                    var marker = new google.maps.Marker({
                        position: myLatLng,
                        map: map,
                        title: response.data[i].profile.first_name + " " + response.data[i].profile.last_name,
                    });
                    var infowindow = new google.maps.InfoWindow({
                        content: response.data[i].profile.first_name + " " + response.data[i].profile.last_name
                    });



                    //}
                }

            })
        });



    })


});