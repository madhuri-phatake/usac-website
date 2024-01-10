// $(".owl-carousel").owlCarousel({

//   nav: true, // Show navigation arrows
//   navText: [
//     '<i class="fa fa-chevron-left"></i>', // Icon for the 'previous' button
//     '<i class="fa fa-chevron-right"></i>' // Icon for the 'next' button
//   ]
//   // Other options...
// });
$(document).ready(function() {
  $("#accredited-bodies").submit(function(event) {
    event.preventDefault();
  });
  $(".close-modal").on("click", () => {
    // Assuming these are the correct form elements
    $('#accredited-bodies').trigger("reset");
    $('#Organization').trigger("reset");
});
  $("#Organization").submit(function(event) {
    event.preventDefault();
  });
  $("#OrganizationPopup").on("click", function(event) {
    $("#accredited-bodies").validate({
      rules: {
        name: {
          required: true,
          minlength: 3
        }
      },
      messages: {
        name: {
          required: "Please enter a name"
        }
      },
      submitHandler: function(form) {
        const hostname = window.location.origin;
        // Callback for valid form
   
        $.ajax({
          url: hostname + "/certificate/search_certificate", // Replace with your API URL
          method: "POST", // or 'GET' based on your API endpoint
          data: {
            // Include any data you want to send to the server
            // For example, search parameters
            certificationtitle: $("#accreditedname").val() // Example search parameter
          },
          success: function(response) {
            let data = response.data[0];

            $(".modal-body").empty();
            $(".modal-body").append(`

            <div class="col-sm-12 ">

                <div class="pe-3 pe-sm-5 pb-3 pb-sm-0 border-right-light card-flex">
                    <h5 class="m-0 popuptitle" id="name"></h5>
                    <p class="m-0 lead" id="filed-1" >Test Certification</p>
                </div>

            </div>
            <hr>
            <div class="col-sm-12 ">

                <div class="pe-3 pe-sm-5 pb-3 pb-sm-0 border-right-light card-flex">
                    <h5 class="m-0 popuptitle" id="Address"></h5>
                    <p class="m-0 lead" id="filed-2">Test Certification Address</p>
                </div>

            </div>
            <hr>
            <div class="col-sm-12 ">

                <div class="pe-3 pe-sm-5 pb-3 pb-sm-0 border-right-light card-flex">
                    <h5 class="m-0 popuptitle" id="Registration">Accredited Scope </h5>
                    <p class="m-0 lead" id="filed-3">Test</p>
                </div>

            </div>
            <hr>
            <div class="col-sm-12">

                <div class="pe-3 pe-sm-5 pb-3 pb-sm-0 border-right-light card-flex">
                    <h5 class="m-0 popuptitle" id="country">Registration Date</h5>
                    <p class="m-0 lead" id="filed-4" >12-Aug-2023</p>
                </div>

            </div>
            <hr>
            <div class="col-sm-12 ">

                <div class="pe-3 pe-sm-5 pb-3 pb-sm-0 border-right-light ">
                    <h5 class="m-0 popuptitle" id="photo"></h5>
                    <div class="photo">

                    </div>
                    <br>
                </div>

            </div>
            <hr>
            <div class="col-sm-12 ">

                <div class="pe-3 pe-sm-5 pb-3 pb-sm-0 border-right-light card-flex">
                    <h5 class="m-0 popuptitle" id="Certificateno">Status</h5>
                    <p class="m-0 lead" id="filed-6">Active</p>
                </div>

            </div>
    `);
            $(".modal-title").text("ACCREDITED BODIES");
            $("#name").text("Certification Name");
            $("#filed-1").text(data.certificationtitle);
            $("#Address").text("Status");
            $("#filed-2").text(data.is_active);
            $("#Registration").text("Address");
            $("#filed-3").text(data.certificationaddress);
            $("#country").text("Accredited Scope");
            $("#filed-4").text(data.certificationscope);
            $("#Certificateno").text("Certificate Expiry Date");
            const originalDate = new Date(data.certificationexpiry);
            const formattedDate = new Intl.DateTimeFormat('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }).format(originalDate);
            $("#filed-6").text(formattedDate);
            if (data.certificationregistration === "") {
              $("#photo").hide();
              $("#filed-5").hide();
            } else {
              const originalDate1 = new Date(data.certificationregistration);
              const formattedDate1 = new Intl.DateTimeFormat('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }).format(originalDate1);
              $("#photo").show().text("Certification Registration");
              $(".photo").empty();
              $(".photo").append(
                `<p class="m-0 lead"  >${formattedDate1}</p>`
              );
            }

            // Show the modal or handle data as needed
            $("#popup").click();
          },
          error: function(xhr, status, error) {
            // Handle errors if the AJAX call fails
            $("#popup").click();
            $(".modal-title").text("ACCREDITED BODIES");
            $(".modal-body").empty();
            $(".modal-body")
              .append(`<div class="pe-3 pe-sm-5 pb-3 pb-sm-0 border-right-light">
                        <h4 class="mb-2" id="name">Error</h4>
                        <p class="m-0 " id="filed-1" >No result found</p>
                    </div>`);
          }
        });
      }
    });
  });
  $("#AccreditedPopup").on("click", function(event) {
    // Perform AJAX call when AccreditedPopup is clicked

    $("#Organization").validate({
      rules: {
        name: {
          required: true,
          minlength: 3
        },
        certificatename: {
          required: true
        }
      },
      messages: {
        name: {
          required: "Please enter a name"
        },
        certificatename: {
          required: "Please enter a Certificate Number"
        }
      },
      submitHandler: function(form) {
        const hostname = window.location.origin;
        // Callback for valid form
        console.log("Form is valid. Submitting...");
        $.ajax({
          url: hostname + "/certificate/search_personnel_certificate", // Replace with your API URL
          method: "POST", // or 'GET' based on your API endpoint
          data: {
            // Include any data you want to send to the server
            // For example, search parameters
            personnel_name: $("#name_personnel").val(), // Example search parameter
            certificate_no: $("#certificatename").val() // Another example search parameter
          },
          success: function(response) {
            let data = response.data[0];

            $(".modal-title").text("CERTIFIED ORGANIZATIONS / PERSONNEL");
            $(".modal-body").empty();
            $(".modal-body").append(`
          
            <div class="col-sm-12 ">

                <div class="pe-3 pe-sm-5 pb-3 pb-sm-0 border-right-light card-flex">
                    <h5 class="m-0 popuptitle" id="name"></h5>
                    <p class="m-0 lead" id="filed-1" >Test Certification</p>
                </div>

            </div>
            <hr>
            <div class="col-sm-12 ">

                <div class="pe-3 pe-sm-5 pb-3 pb-sm-0 border-right-light card-flex">
                    <h5 class="m-0 popuptitle" id="Address"></h5>
                    <p class="m-0 lead" id="filed-2">Test Certification Address</p>
                </div>

            </div>
            <hr>
            <div class="col-sm-12 ">

                <div class="pe-3 pe-sm-5 pb-3 pb-sm-0 border-right-light card-flex">
                    <h5 class="m-0 popuptitle" id="Registration">Accredited Scope </h5>
                    <p class="m-0 lead" id="filed-3">Test</p>
                </div>

            </div>
            <hr>
            <div class="col-sm-12 ">

                <div class="pe-3 pe-sm-5 pb-3 pb-sm-0 border-right-light card-flex">
                    <h5 class="m-0 popuptitle" id="country">Registration Date</h5>
                    <p class="m-0 lead" id="filed-4" >12-Aug-2023</p>
                </div>

            </div>
            <hr>
            <div class="col-sm-12">

                <div class="pe-3 pe-sm-5 pb-3 pb-sm-0 border-right-light photo-div">
                    <h5 class="m-0 popuptitle" id="photo"></h5>
                    <div class="photo">

                    </div>
                    <br>
                </div>

            </div>
            <hr>
            <div class="col-sm-12 ">

                <div class="pe-3 pe-sm-5 pb-3 pb-sm-0 border-right-light card-flex">
                    <h5 class="m-0 popuptitle" id="Certificateno">Status</h5>
                    <p class="m-0 lead" id="filed-6">Active</p>
                </div>

            </div>`);
            $("#name").text("Name");
            $("#filed-1").text(data.personnel_name);
            $("#Address").text("Course name");
            $("#filed-2").text(data.personnel_course);
            $("#Registration").text("Registration Date");
            const originalDate = new Date(data.personnel_registration);
            const formattedDate = new Intl.DateTimeFormat('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }).format(originalDate);

            $("#filed-3").text(formattedDate);
            $("#country").text("Country");
            $("#filed-4").text(data.personnel_country);
            $("#Certificateno").text("Certificate Number");
            $("#filed-6").text(data.personnel_certificate_no);
         
            if (data.personnel_photo === "" || data.personnel_photo === undefined ) {
              $(".photo-div").hide();
              $("#filed-5").hide();
            } else {
              $("#photo").show().text("Photo");
              $(".photo").empty();
              $(".photo").append(
                `<img src="${data.personnel_photo}" alt="${data.personnel_name}" width="100" height="100">`
              );
            }

            // Show the modal or handle data as needed
            $("#popup").click();
          },
          error: function(xhr, status, error) {
            // Handle errors if the AJAX call fails
            $("#popup").click();
            $(".modal-title").text("CERTIFIED ORGANIZATIONS / PERSONNEL");
            $(".modal-body").empty();
            $(".modal-body")
              .append(`<div class="pe-3 pe-sm-5 pb-3 pb-sm-0 border-right-light">
                      <h4 class="mb-2" id="name">Error</h4>
                      <p class="m-0 " id="filed-1" >No result found</p>
                  </div>`);
          }
        });
      }
    });
  });
});
