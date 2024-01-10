$("#contact-form").submit(function(e) {
  return false;
});
$(".massge").hide();
$("#loader").hide();
$("#contact-btn").click(function(e) {
  $("#contact-form").validate({
    rules: {
      name: {
        required: true
      },
      email: {
        required: true,
        email: true
      },
      phone: {
        required: true
      },
      subject: {
        required: true
      }
    },
    messages: {
      name: {
        required:
          "<span style='font-size:14px; color: red;'>Please enter full name</span>"
      },

      email: {
        required:
          "<span style='font-size:14px; color: red;'>Please enter email id</span>"
      },
      phone: {
        required:
          "<span style='font-size:14px; color: red;'>Please enter mobile number</span>"
      },
      subject: {
        required:
          "<span style='font-size:14px; color: red;'>Please enter subject</span>"
      }
    },

    submitHandler: function() {
      contactformformSubmition();
      $("#contact-btn").attr("disabled");
    }
  });
});

function contactformformSubmition() {
  let contactobj = {};
  contactobj.name = $("#name").val();

  contactobj.email = $("#email").val();
  contactobj.phone = $("#phone").val();
  contactobj.message = $("#message").val();
  contactobj.subject = $("#subject").val()
  console.log(contactobj)
  const currentURL = window.location.origin;

  // Get the reCAPTCHA response
  contactobj.recaptchaResponse = grecaptcha.getResponse();
  if (contactobj.recaptchaResponse === "") {
    alert("Please Validate Captcha");
  } else {
    $("#loader").show();
    $.ajax({
      url: `${currentURL}/send-email`,
      contentType: "application/json; charset= utf-8",
      type: "POST",
      data: JSON.stringify(contactobj),
      dataType: "json",
      success: function(data) {
        if ((data.status = true)) {
          $("#contact-form").hide();
          $("#form-title").empty();
          $('html, body').animate({ scrollTop: 0 }, 'slow');
          $("#form-title").append(
            `<h2>Thank you, ${contactobj.name}, <br>  For reaching out to us! <br> We appreciate your interest.<h2>`
          );
          $(".massge").show();
        }
      },
      // Error handling
      error: function(error) {
        console.log(`Error ${error}`);
        $("#form-title").text(
          `Oops! There was an error processing your request. Please try again later.`
        );
      }
    });
  }
}
