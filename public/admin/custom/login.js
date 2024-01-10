//const { response } = require("express");

//const { response } = require("express");

var login = {
    base_url: null,
    init: function () {
        this.bind_events();
    },
    bind_events: function () {
        let self = this;
        //$('#mobile_number').on('click', this.check_mobile_number_exist);

        //otp vrification
        $("#otp_submit").on('click', function (event) {
            $('form[id="otp-form"]').validate({
                rules: {
                    otp: {
                        required: true
                    }
                },
                messages: {
                    otp: {
                        required: "Please enter valid OTP"
                    }
                },
                errorElement: 'div',
                errorPlacement: function (error, element) {
                    var placement = $(element).data('error');
                    if (placement) {
                        $(placement).append(error)
                    } else {
                        error.insertAfter(element);
                    }
                },
                submitHandler: function () {
                    login.check_otp();

                }
            });
        });

        // login function
        $("#login_btn").on('click', function (event) {
            login.check_mobile_number_exist();
            $('form[id="login-form"]').validate({
                rules: {
                    mobile_number: {
                        required: true
                    },
                    password: {
                        required: true
                    }
                },
                messages: {
                    mobile_number: {
                        required: "Please enter mobile number"
                    },
                    password: {
                        required: "Please enter password"
                    }
                },
                errorElement: 'div',
                errorPlacement: function (error, element) {
                    var placement = $(element).data('error');
                    if (placement) {
                        $(placement).append(error)
                    } else {
                        error.insertAfter(element);
                    }
                },
                submitHandler: function () {
                    login.userlogin();
                }
            });
        });

        //create new password
        $("#create_new_password").on('click', function (event) {
            $('form[id="password-form"]').validate({
                rules: {
                    "n_password": {
                        required: true,
                        minlength: 6
                    },
                    "c_password": {
                        required: true,
                        minlength: 6,
                        equalTo: '[name="n_password"]'
                    }
                },
                messages: {
                    "n_password": {
                        required: "Please enter password",
                        minlength: "Passwords must be minimum 6 characters"
                    },
                    "c_password": {
                        required: "please enter confirm password",
                        minlength: "Passwords must be minimum 6 characters",
                        equalTo: "Passwords did not matched"
                    }
                },
                errorElement: 'div',
                errorPlacement: function (error, element) {
                    var placement = $(element).closest('.input-field').next(".error-div");
                    if (placement.length > 0) {
                        $(placement).append(error)
                    } else {
                        error.insertAfter(element);
                    }
                },
                submitHandler: function () {
                    login.create_new_password();

                }
            });
        });
    },
    check_mobile_number_exist: function () {
        var self = this;
        var obj = new Object;
        obj.mobile_number = $('#mobile_number').val();
        $.ajax({
            type: "post",
            contentType: "application/json; charset= utf-8",
            dataType: "JSON",
            url: login.base_url + "/login/check_mobile_number_exist",
            data: JSON.stringify(obj),
            success: function (data) {
    
                if (data.title == "success") {
                    if (data.password != null && data.password != undefined) {
                      $(".password").show();
                      $("#login_btn").attr("type", "submit");
                    } else {
                      login.user_id = data._id;
                      // forgot_pass.sendotp();
                      $("#login-form").hide();
                      $("#password-form").show();
                    }
                  } else {
                    $(".password").hide();
                    toastr.error("Mobile Number does not exist!", "Error");
                  }
            }
        });
    },
    send_otp: function () {
        var self = this;
        var obj = new Object();
        obj.mobile_number = $("#mobile_number").val();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset= utf-8",
            dataType: "JSON",
            data: JSON.stringify(obj),
            url: login.base_url + '/login/send_otp',
            success: function (responce) {
                if(responce.title == "success"){
                    toastr[responce.title](responce.message, responce.title);
                    login.OTP = responce.data;
                    if (responce.title == "success") {
                        $("#login-form").hide();
                        $("#otp-form").show();
                    }
                }
            }
        });
    },

    create_new_password: function () {
        var self = this;
        var obj = new Object();
        obj.password = $("#n_password").val();
        obj.id = login.user_id;
        $.ajax({
            type: "put",
            contentType: "application/json; charset= utf-8",
            dataType: "JSON",
            data: JSON.stringify(obj),
            url: self.base_url + '/login/create_password',
            success: function (responce) {
                if (responce.title == 'success') {
                    toastr[responce.title](responce.message, responce.title);
                    document.getElementById("password-form").reset();
                    location.reload();
                }
            }
        });
    },

    check_otp: function () {
        var self = this;
        var otp = $('#otp').val();
        var self = this;
        var obj = new Object;
        obj.otp = $('#otp').val();
        $.ajax({
            type: "post",
            contentType: "application/json; charset= utf-8",
            dataType: "JSON",
            url: self.base_url + "/login/check_otp",
            data: JSON.stringify(obj),
            success: function (data) {
                if (data.title == "success") {
                    $("#otp-form").hide();
                    $("#password-form").show();
                    toastr.success('Your OTP match successfully.', 'Success')

                } else {
                    toastr.error('Please enter valid otp.', 'Error')
                }
            }
        });
    },

    userlogin: function () 
    {
        let recentSearchData = [];
        recentSearchData = JSON.parse(localStorage.getItem("recentSearchData") || "[]");
        localStorage.clear();
        localStorage.setItem("recentSearchData", JSON.stringify(recentSearchData));
        var self = this;
        var obj = new Object();
        obj.mobile_number = $("#mobile_number").val();
        obj.password = $("#password").val();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset= utf-8",
            dataType: "json",
            data: JSON.stringify(obj),
            url: login.base_url + '/login/login_user',
            success: function (responce) {
                if (responce.title == "success") {
                    toastr.success(responce.message, 'Login Successful');
                    location.href = login.base_url + "/certificate-master";
                    localStorage.setItem("show_pop_up",1);
                } else {
                    toastr.error(responce.message, 'Error');
                }
            }
        });
    },

    isNumberKey: function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode != 46 && charCode > 31 &&
            (charCode < 48 || charCode > 57))
            return false;
        return true;
    }
};