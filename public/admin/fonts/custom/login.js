var login = {

    //GLOBAL VARIABLE DECLERATION
    base_url: null,
    user_id: null,
    OTP: null,
    init: function() {
        this.bind_events();
    },


    //event Bindding
    bind_events: function() {
        //check mibile number is exist
        $('#mobile_number').on('blur', this.check_mobile_number_exist);
        //otp vrification
        $("#otp_submit").on('click', function(event) {
            $('form[id="otp-form"]').validate({
                rules: {
                    otp: { required: true }
                },
                messages: {
                    otp: { required: "Please enter valid OTP" }
                },
                errorElement: 'div',
                errorPlacement: function(error, element) {
                    var placement = $(element).data('error');
                    if (placement) {
                        $(placement).append(error)
                    } else {
                        error.insertAfter(element);
                    }
                },
                submitHandler: function() {
                    login.check_otp();

                }
            });
        });


        // login function
        $("#login_btn").on('click', function(event) {
            $('form[id="login-form"]').validate({
                rules: {
                    mobile_number: { required: true },
                    password: { required: true }
                },
                messages: {
                    mobile_number: { required: "Please enter mobile number" },
                    password: { required: "Please enter password" }
                },
                errorElement: 'div',
                errorPlacement: function(error, element) {
                    var placement = $(element).data('error');
                    if (placement) {
                        $(placement).append(error)
                    } else {
                        error.insertAfter(element);
                    }
                },
                submitHandler: function() {
                    login.userlogin();
                }
            });
        });

        //create new password
        $("#create_new_password").on('click', function(event) {
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
                        equalTo: "Confirm password not match"
                    }
                },
                errorElement: 'div',
                errorPlacement: function(error, element) {
                    var placement = $(element).data('error');
                    if (placement) {
                        $(placement).append(error)
                    } else {
                        error.insertAfter(element);
                    }
                },
                submitHandler: function() {
                    login.create_new_password();

                }
            });
        });

    },


    check_otp: function() {
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
            success: function(data) {
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

    check_mobile_number_exist: function() {
        var self = this;
        var mobile_no = $('#mobile_number').val();
        var obj = new Object;
        obj.mobile_number = mobile_no;
        console.log(obj);
        $.ajax({
            type: "post",
            contentType: "application/json; charset= utf-8",
            dataType: "JSON",
            url: login.base_url + "/login/check_mobile_number_exist",
            data: JSON.stringify(obj),
            success: function(data) {
                console.log(data);
                if (data != null) {
                    if (data.password != null && data.password != undefined) {
                        $('.password').show();
                        $('#login_btn').attr('type', 'submit');
                    } else {
                        login.user_id = data._id;
                        login.sendotp();
                    }

                } else {
                    $('.password').hide();
                    toastr.error('Mobile Number Not Exist.', 'Error')
                }

            }
        });
    },

    sendotp: function() {
        var self = this;
        var obj = new Object();
        obj.mobile_number = $("#mobile_number").val();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset= utf-8",
            dataType: "JSON",
            data: JSON.stringify(obj),
            url: login.base_url + '/login/send_otp',
            success: function(responce) {
                toastr[responce.title](responce.message, responce.title);
                login.OTP = responce.data;
                if (responce.title == "success") {
                    $("#login-form").hide();
                    $("#otp-form").show();

                }
            }
        });
    },

    create_new_password: function() {
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
            success: function(responce) {
                console.log(responce);
                toastr[responce.title](responce.message, responce.title);
                document.getElementById("password-form").reset();
                if (responce.title == 'success') {
                    $("#login-form").show();
                    $("#password-form").hide();
                    $("#mobile_number").val('');
                }
            }
        });
    },

    userlogin: function() {
        var self = this;
        var obj = new Object();
        obj.mobile_number = $("#mobile_number").val();
        obj.password = $("#password").val();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset= utf-8",
            dataType: "JSON",
            data: JSON.stringify(obj),
            url: login.base_url + '/login/login_user',
            success: function(responce) {
                if (responce.title == "success") {
                    toastr.success(responce.message, 'Successful');
                    location.href = login.base_url;
                } else {
                    toastr.error(responce.message, 'Error');
                }

            }
        });
    },

    //mobile number validation
    isNumberKey: function(evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode != 46 && charCode > 31 &&
            (charCode < 48 || charCode > 57))
            return false;

        return true;
    }

};