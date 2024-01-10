var user = {
    base_url: null,
    init: function() {
        this.bind_events();
        this.loadusers();


    },

    bind_events: function() {
        var self = this;
        $('select[required]').css({
            position: 'absolute',
            display: 'inline',
            height: 0,
            padding: 0,
            border: '1px solid rgba(255,255,255,0)',
            width: 0
        });
        $("#create_user").on('click', function(event) {
            $('form[id="user_form"]').validate({
                rules: {
                    name: { required: true },
                    mobile_number: {
                        minlength: 10,
                        maxlength: 10,
                        required: true,
                        number: true
                    },
                    email_id: { required: true, email: true },
                    status: { required: true }
                },
                messages: {
                    name: { required: "Please enter user name" },
                    mobile_number: {
                        required: "please enter user mobile number",
                        minlength: "please enter 10 digit mobile number",
                        maxlength: "Please enter 10 digit valid mobile number",
                        number: "Please enter digits alphabets not allowed"
                    },
                    email_id: { required: "please enter email-id", email: "please enter valid email-id" },
                    status: { required: "please select user status " }


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
                    user.add_user();

                }
            });
        });

        // $('#Password').on('blur', this.check_password_exist);
        // $('#edit_user').on('click', function() {
        //     $('#name').prop('disabled', false)
        //     $('#email_id').prop('disabled', false)
        //     $('#edit_user').hide();
        //     $('#update_user').show();
        // });

        $("#create_new_password").on('click', function(event) {
            $('form[id="new_password"]').validate({
                rules: {

                    "n_password": {
                        required: true,
                        minlength: 6
                    },
                    "confirm_password": {
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
                    "confirm_password": {
                        required: "please enter confirm password",
                        minlength: "Passwords must be minimum 6 characters",
                        equalTo: "Confirm password not match"
                    }
                },
                submitHandler: function() {
                    user.create_new_password();

                }
            });
        });



        $("#update_user").on('click', function(event) {
            $('form[id="profile_form"]').validate({
                rules: {
                    name: { required: true },
                    email_id: { required: true }
                },
                messages: {
                    name: { required: "Please enter user name" },
                    email_id: { required: "please enter email-id" }
                },
                submitHandler: function() {
                    user.update_user();

                }
            });
        })
    },

    create_new_password: function() {
        var self = this;
        var obj = new Object();
        obj.password = $("#n_password").val();
        obj.id = $("#user_id").val();
        $.ajax({
            type: "put",
            contentType: "application/json; charset= utf-8",
            dataType: "JSON",
            data: JSON.stringify(obj),
            url: self.base_url + '/login/create_password',
            success: function(responce) {
                toastr[responce.title](responce.message, responce.title);
                document.getElementById("new_password").reset();
                if (responce.title == 'success') {
                    $(".password").hide();
                    document.getElementById('logout-form').submit();
                }
            }
        });
    },

    check_password_exist: function() {
        var self = this;
        var password = $('#Password').val();
        var obj = new Object;
        obj.password = password;
        $.ajax({
            type: "post",
            contentType: "application/json; charset= utf-8",
            dataType: "JSON",
            url: user.base_url + "/users/check_password_exist",
            data: JSON.stringify(obj),
            success: function(data) {
                if (data.title == "success") {
                    $('.password').show();
                    $('#create_new_password').attr('type', 'submit');
                    $('#create_new_password').html("Update");
                } else {
                    $('.password').hide();
                    toastr.error('Your password dose not match', 'Error')
                }

            }
        });
    },

    update_user: function() {
        var self = this;
        var upObj = new Object();
        var name = $("#name").val();
        var email_id = $("#email_id").val();
        var user_id = $("#user_id").val();
        upObj.name = name;
        upObj.email_id = email_id;
        $.ajax({
            type: 'put',
            contentType: 'application/json',
            dataType: 'json',
            url: self.base_url + "/users/update_user/" + user_id,
            data: JSON.stringify(upObj),
            success: function(data) {
                toastr[data.title](data.message, data.title);
                if (data.title = "success") {
                    $("#name").val(name);
                    $("#email_id").val(email_id);
                    $('#name').prop('disabled', true)
                    $('#email_id').prop('disabled', true)
                    $('#edit_user').show();
                    $('#update_user').hide();
                }

            }
        });

    },
    add_user: function() {
        var self = this;
        var upObj = new Object();
        var user_id = $("#user_id").val();
        if (user_id == "") {
            upObj.name = $("#name").val();
            upObj.mobile_number = $("#mobile_number").val();
            upObj.email_id = $("#email_id").val();
            upObj.user_status = $("#user_status").val();
            $.ajax({
                type: 'post',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                url: self.base_url + "/users/add_user",
                data: JSON.stringify(upObj),
                success: function(data) {
                    if (data.title == "success") {
                        toastr[data.title](data.message, data.title);
                        $("#name").val('');
                        $("#email_id").val('');
                        $("#mobile_number").val('');
                        $("#user_status").val(1);

                        $('#user_status').formSelect();
                        $("#user_id").val('');
                        $("#mobile_number").prop('disabled', false);
                        $("#create_user").html("Submit");
                        user.loadusers();
                    } else {
                        toastr[data.title](data.message, data.title);
                    }
                }
            });
        } else {
            upObj.name = $("#name").val();
            upObj.email_id = $("#email_id").val();
            upObj.user_status = $("#user_status").val();
            $.ajax({
                type: 'put',
                contentType: 'application/json',
                dataType: 'json',
                url: self.base_url + "/users/update_user/" + user_id,
                data: JSON.stringify(upObj),
                success: function(data) {

                    toastr[data.title](data.message, data.title);
                    $("#name").val('');
                    $("#email_id").val('');
                    $("#mobile_number").val('');
                    $("#user_status").val(1);

                    $('#user_status').formSelect();
                    $("#user_id").val('');
                    $("#mobile_number").prop('disabled', false);
                    $("#create_user").html("Submit");
                    user.loadusers();
                }
            });
        }

    },
    loadusers: function() {
        var self = this;
        $.ajax({
            type: 'get',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url: self.base_url + "/users/get_user",
            success: function(data) {
                $('#users_table').DataTable({
                    data: data,
                   // "responsive": true,
                    "lengthMenu": [
                        [10, 25, 50, -1],
                        [10, 25, 50, "All"]
                    ],
                    "paging": true,
                    destroy: true,
                    "bSort": false,

                    // "aoColumnDefs": [{
                    //     'bSortable': false,
                    //     'aTargets': [0, 2, 3, 4, 5, 6, 7]
                    // }],
                    columns: [
                        { 'data': '_id', 'visible': false },
                        { 'data': null, 'sTitle': 'Sr.' },
                        { 'data': 'name', 'sTitle': 'User Name' },
                        { 'data': 'mobile_number', 'sTitle': 'Mobile No.' },
                        { 'data': 'email_id', 'sTitle': 'Email-id' },
                        {
                            'data': 'user_status',
                            'sTitle': 'User Status',
                            'render': function(data, type, row) {
                                if (data == "1") {
                                    return '<span class="badge pink lighten-5 pink-text text-accent-2">Active</span>'

                                } else
                                if (data == "0") {
                                    return '<span class="badge green lighten-5 pink-text text-accent-2">Deactive</span>'

                                } else {
                                    return "";
                                }
                            }
                        },
                        {
                            'data': 'null',
                            'width': '10%',
                            'sTitle': 'Action',
                            'render': function(data, type, row) {
                                return '<a href="javascript:void(0)" onclick="user.edit_user(this)" class="edit" data-toggle="tooltip" title="" data-original-title="Edit"><i class="material-icons dp26">edit</i></a>'
                                    // <a href="javascript:void(0)" onclick="user.delete_user(this)" data-id="' + row._id + '" class="text-inverse trash  p-r-10" data-toggle="tooltip" title="" data-original-title="Delete"><i class="la la-trash font-26"></i></a>';
                            }
                        }

                    ],
                    "fnRowCallback": function(nRow, aData, iDisplayIndex) {
                        var index = iDisplayIndex + 1;
                        $('td:eq(0)', nRow).html(index);
                        return nRow;
                    }

                });

                $('select').formSelect();

            }
        });
    },

    edit_user: function(obj) {
        // alert("asdasg");
       // window.scrollTo(500, 0);
       
        var row = $(obj).closest('tr');
        var id2 = $('#users_table').dataTable().fnGetData(row);
        console.log(id2.name);
        $("#name").val(id2.name).focus();
        $("#email_id").val(id2.email_id).focus();;
        $("#mobile_number").val(id2.mobile_number).focus();;
        $("#user_id").val(id2._id);
        // $('#user_status').find('option[value="' + id2.user_status + '"]').prop('selected', true);
        // const selectedCategory = document.querySelector('#user_status');
        // const materializeSelectedCategory = M.FormSelect.init(selectedCategory);
        // materializeSelectedCategory.value = id2.user_status; // This does not work...

        $("#user_status").val(id2.user_status).focus();

        $('#user_status').formSelect();

        $("#mobile_number").prop('disabled', true);
        $("#create_user").html("Update");
    },



    delete_user: function(ev) {
        var self = this;
        var id = $(ev).data("id");
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: {
                cancel: {
                    text: "No, cancel plx!",
                    value: null,
                    visible: true,
                    className: "",
                    closeModal: false,
                },
                confirm: {
                    text: "Yes, delete it!",
                    value: true,
                    visible: true,
                    className: "",
                    closeModal: false
                }
            }
        }).then((isConfirm) => {
            if (isConfirm) {
                $.ajax({
                    type: 'delete',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    url: self.base_url + "/users/delete_user/" + id,
                    success: function(data) {
                        if (data.title == "success") {
                            user.loadusers();
                            swal(
                                'Deleted!',
                                'Your data has been deleted.',
                                'success'
                            );

                        } else {
                            swal('Error!',
                                'Something get wrong!.',
                                'error');
                        }
                    }
                });
            } else {
                swal("Cancelled", "Your data is safe :)", "error");
            }
        });

    },
    isName: function(event) {
        var inputValue = event.charCode;
        if (!(inputValue >= 65 && inputValue <= 122) && (inputValue != 32 && inputValue != 0)) {
            event.preventDefault();
        }
    },
    isNumberKey: function(evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode != 46 && charCode > 31 &&
            (charCode < 48 || charCode > 57))
            return false;

        return true;
    }
};