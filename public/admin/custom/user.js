var user = {
    base_url: null,
    init: function () {
        this.bind_events();
        this.get_users();
    },

    bind_events: function () {
        var self = this;
        if (self.edit == false) {
            $('.access-controll').each(function (i) {
                $(this).attr("disabled", "disabled");
            });
        }
        // $('#user_access_modal').modal();
        $("#user_access").click(function () {
            $("#user_access_modal").modal("open")
        });
        
        $("#create_user").on('click', function (event) {
            $('form[id="user_form"]').validate({
                rules: {
                    name: {
                        required: true
                    },
                    mobile_number: {
                        minlength: 10,
                        maxlength: 10,
                        required: true,
                        number: true
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    address: {
                        required: true
                    },
                    user_type: {
                        required: true
                    },
                    user_status: {
                        required: true
                    },
                },
                messages: {
                    name: {
                        required: "<span style='font-size:10px; color: red;'>Please enter name</span>",
                    },
                    mobile_number: {
                        required: "<span style='font-size:10px; color: red;'>Please enter mobile number</span>",
                        minlength: "<span style='font-size:10px; color: red;'>Please enter 10 digit mobile number</span>",
                        maxlength: "<span style='font-size:10px; color: red;'>Please enter 10 digit valid mobile number</span>",
                        number: "<span style='font-size:10px; color: red;'>Alphabets not allowed</span>"
                    },
                    email: {
                        required: "<span style='font-size:10px; color: red;'>Please enter email id</span>",
                        email: "<span style='font-size:10px; color: red;'>Please enter valid email id</span>",
                    },
                    address: {
                        required: "<span style='font-size:10px; color: red;'>Please enter address</span>",
                    },
                    user_type: {
                        required: "<span style='font-size:10px; color: red;'>Please select user type</span>"
                    },
                    user_status: {
                        required: "<span style='font-size:10px; color: red;'>Please select user status</span>"
                    },
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
                    user.add_user();
                }
            });
        });

    },
    add_user: function () {
        var self = this;
        let obj = new Object();
        let user_id = $("#user_id").val();
        obj.name = $("#name").val();
        obj.mobile_number = $("#mobile_number").val();
        obj.email = $("#email").val();
        obj.address = $("#address").val();
        obj.user_type = $('#user_type').val();
        obj.user_status = $('#user_status').val();

        if (user_id == null || user_id == "") {
            let $request = $.ajax({
                url: self.base_url + "/users/add_user",
                type: "POST",
                contentType: "application/json; charset= utf-8",
                data: JSON.stringify(obj),
                dataType: "json"
            });
            $request.done(function (response) {
                if (response.title == "success") {
                    $("#user_form").trigger("reset");
                    toastr["success"](response.message, "success");
                    user.get_users();
                } else {
                    toastr["error"](response.message, "error");
                };
            });
        } else {
            obj.id = user_id;
            let $request = $.ajax({
                url: self.base_url + "/users/update_user",
                type: "POST",
                contentType: "application/json; charset= utf-8",
                data: JSON.stringify(obj),
                dataType: "json"
            });
            $request.done(function (response) {
                if (response.title == "success") {
                    $("#user_form").trigger("reset");
                    $("#user_id").val("");
                    $("#create_user_btn").text("Add User");
                    toastr["success"](response.message, "Success");
                    user.get_users();
                } else {
                    toastr["error"](response.message, "Error");
                };
            });
        }
    },
    isNumeric: function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode != 46 && charCode > 31 &&
            (charCode < 48 || charCode > 57))
            return false;

        return true;
    },
    get_users: function () {
        let self = this;
        $('#user_table').DataTable({
            "aaSorting": [],
            "lengthMenu": [
                [10, 25, 50, -1],
                [10, 25, 50, "All"]
            ],
            "destroy": true,
            "ajax": {
                "url": self.base_url + "/users/get_users_for_table",
                "type": "POST",
                "datatype": "json"
            },
            "columns": [{
                    'data': '_id',
                    'visible': false
                },
                {
                    'data': null,
                    'sTitle': 'Sr.',
                    //'class': 'center'
                },
                {
                    'data': 'name',
                    'sTitle': 'User Name',
                    //'class': 'center'
                },
                {
                    'data': 'mobile_number',
                    'sTitle': 'Mobile No.',
                    //'class': 'center'
                },
                {
                    'data': 'email_id',
                    'sTitle': 'Email-id',
                    //'class': 'center'
                },
                {
                    'data': 'user_type',
                    'sTitle': 'User Type',
                    //'class': 'center'
                },
                {
                    'data': 'user_access',
                    'visible': false
                },
                {
                    'data': 'user_status',
                    'sTitle': 'User Status',
                    //'class': 'center',
                    'render': function (data, type, row) {
                        if (data == "active") {
                            return '<span style="font-size: 12px !important;" class="badge gradient-45deg-green-teal">Active</span>'

                        } else
                        if (data == "inactive") {
                            return '<span style="font-size: 12px !important;" class="badge gradient-45deg-deep-orange-orange">Inactive</span>'

                        } else {
                            return "NA";
                        }
                    }
                },
                {
                    'data': 'null',
                    'width': '10%',
                    'sTitle': 'Action',
                    //'class': 'center',
                    'render': function (data, type, row) {
                        // if ((row.user_access[0].web_master_access.indexOf("edit") > -1) == true || (row.user_access[0].web_master_access.indexOf("delete") > -1) == true) {
                        //     return `<button type="button" class="mb-6 btn-floating waves-effect waves-light gradient-45deg-green-teal" onclick="user.edit_user(this)" title="Edit User"> <i class="material-icons">create</i> </button> 
                        //             <button type="button" class="mb-6 btn-floating waves-effect waves-light gradient-45deg-purple-deep-orange" onclick="user.delete_user(this)" title="Delete User"> <i class="material-icons">delete_forever</i> </button>`
                        //         } else if ((row.user_access[0].web_master_access.indexOf("edit") > -1) == true || (row.user_access[0].web_master_access.indexOf("delete") > -1) == false) {
                        //             return `<button type="button" class="mb-6 btn-floating waves-effect waves-light gradient-45deg-green-teal" onclick="user.edit_user(this)" title="Edit User"> <i class="material-icons">create</i> </button> 
                        //             <button type="button" class="mb-6 btn-floating waves-effect waves-light" title="No access"> <i class="material-icons">delete_forever</i> </button>`
                        // } else if ((row.user_access[0].web_master_access.indexOf("edit") > -1) == false || (row.user_access[0].web_master_access.indexOf("delete") > -1) == true) {
                        //     return `<button type="button" class="mb-6 btn-floating waves-effect waves-light" title="No access" disabled="true"> <i class="material-icons">create</i> </button> 
                        //     <button type="button" class="mb-6 btn-floating waves-effect waves-light gradient-45deg-purple-deep-orange" title="Delete" onclick="user.edit_user(this)"> <i class="material-icons">delete_forever</i> </button>`
                        // } else {
                        //     return `<button type="button" class="mb-6 btn-floating waves-effect waves-light" title="No access" disabled="true"> <i class="material-icons">create</i> </button> 
                        //     <button type="button" class="mb-6 btn-floating waves-effect waves-light" title="No access" disabled="true"> <i class="material-icons">delete_forever</i> </button>`
                        // }
                        return `<button type="button" class="mb-6 btn-floating waves-effect waves-light gradient-45deg-green-teal" onclick="user.edit_user(this)" title="Edit User"> <i class="material-icons">create</i> </button> 
                                <button type="button" class="mb-6 btn-floating waves-effect waves-light gradient-45deg-purple-deep-orange" onclick="user.delete_user(this)" title="Delete User"> <i class="material-icons">delete_forever</i> </button>`
                    }
                }

            ],
            "rowCallback": function (nRow, aData, iDisplayIndex) {
                var oSettings = this.fnSettings ();
                $("td:first", nRow).html(oSettings._iDisplayStart+iDisplayIndex +1);
                return nRow;
            },
        });
    },
    edit_user: function (e) {
        let self = this;
        if (self.edit == false) {
            swal(
                'Sorry!',
                'You dont have edit access',
                'error'
            )
            return false;
        }
        var row = $(e).closest('tr');
        var obj = $('#user_table').dataTable().fnGetData(row);
        
        $("#access_form").trigger("reset");

        let app_master_access_edit = obj.user_access[0].app_master_access.includes("edit");
        let app_master_access_view = obj.user_access[0].app_master_access.includes("view");
        let app_master_access_delete = obj.user_access[0].app_master_access.includes("delete");

        let web_master_access_edit = obj.user_access[0].web_master_access.includes("edit");
        let web_master_access_view = obj.user_access[0].web_master_access.includes("view");
        let web_master_access_delete = obj.user_access[0].web_master_access.includes("delete");
        let web_master_access_email = obj.user_access[0].web_master_access.includes("admin_email");
        let web_master_access_delete_email = obj.user_access[0].web_master_access.includes("delete_report_email");
        let web_master_order_cancel_email = obj.user_access[0].web_master_access.includes("order_cancel_email");
        
        let recipe_access_edit = obj.user_access[0].recipe_access.includes("edit");
        let recipe_access_view = obj.user_access[0].recipe_access.includes("view");
        let recipe_access_delete = obj.user_access[0].recipe_access.includes("delete");
        
        let reports_access_edit = obj.user_access[0].reports_access.includes("edit");
        let reports_access_view = obj.user_access[0].reports_access.includes("view");
        let reports_access_delete = obj.user_access[0].reports_access.includes("delete");
        
        let couponCode_access_edit = false;
        let couponCode_access_view = false;
        let couponCode_access_delete = false;
        let gurukul_access_edit = false;
        let gurukul_access_view = false;
        let gurukul_access_delete = false;
        let healthTips_access_edit = false;
        let healthTips_access_view = false;
        let healthTips_access_delete = false;
        let lukeSession_access_edit = false;
        let lukeSession_access_view = false;
        let lukeSession_access_delete = false;
        let policies_access_edit = false;
        let policies_access_view = false;
        let policies_access_delete = false;
        let processCode_access_edit = false;
        let processCode_access_view = false;
        let processCode_access_delete = false;
        let deleteProductReport_view = false;
        let deleteProductReport_delete = false;

        (obj.user_access[0].couponCode_access !== undefined) ? couponCode_access_edit = obj.user_access[0].couponCode_access.includes("edit") : "";
        (obj.user_access[0].couponCode_access !== undefined) ? couponCode_access_view = obj.user_access[0].couponCode_access.includes("view") : "";
        (obj.user_access[0].couponCode_access !== undefined) ? couponCode_access_delete = obj.user_access[0].couponCode_access.includes("delete") : "";


        (obj.user_access[0].gurukul_access !== undefined) ? gurukul_access_edit = obj.user_access[0].gurukul_access.includes("edit") : "";
        (obj.user_access[0].gurukul_access !== undefined) ? gurukul_access_view = obj.user_access[0].gurukul_access.includes("view") : "";
        (obj.user_access[0].gurukul_access !== undefined) ? gurukul_access_delete = obj.user_access[0].gurukul_access.includes("delete") : "";


        (obj.user_access[0].healthTips_access !== undefined) ? healthTips_access_edit = obj.user_access[0].healthTips_access.includes("edit") : "";
        (obj.user_access[0].healthTips_access !== undefined) ? healthTips_access_view = obj.user_access[0].healthTips_access.includes("view") : "";
        (obj.user_access[0].healthTips_access !== undefined) ? healthTips_access_delete = obj.user_access[0].healthTips_access.includes("delete") : "";


        (obj.user_access[0].lukeSession_access !== undefined) ? lukeSession_access_edit = obj.user_access[0].lukeSession_access.includes("edit") : "";
        (obj.user_access[0].lukeSession_access !== undefined) ? lukeSession_access_view = obj.user_access[0].lukeSession_access.includes("view") : "";
        (obj.user_access[0].lukeSession_access !== undefined) ? lukeSession_access_delete = obj.user_access[0].lukeSession_access.includes("delete") : "";


        (obj.user_access[0].policies_access !== undefined) ? policies_access_edit = obj.user_access[0].policies_access.includes("edit") : "";
        (obj.user_access[0].policies_access !== undefined) ? policies_access_view = obj.user_access[0].policies_access.includes("view") : "";
        (obj.user_access[0].policies_access !== undefined) ? policies_access_delete = obj.user_access[0].policies_access.includes("delete") : "";


        (obj.user_access[0].processCode_access !== undefined) ? processCode_access_edit = obj.user_access[0].processCode_access.includes("edit") : "";
        (obj.user_access[0].processCode_access !== undefined) ? processCode_access_view = obj.user_access[0].processCode_access.includes("view") : "";
        (obj.user_access[0].processCode_access !== undefined) ? processCode_access_delete = obj.user_access[0].processCode_access.includes("delete") : "";

        (obj.user_access[0].deleteProductReport_access !== undefined) ? deleteProductReport_view = obj.user_access[0].deleteProductReport_access.includes("view") : "";
        (obj.user_access[0].deleteProductReport_access !== undefined) ? deleteProductReport_delete = obj.user_access[0].deleteProductReport_access.includes("delete") : "";

        if(app_master_access_edit){
            $(".app_master_edit").prop('checked', true);
        }else{
            $(".app_master_edit").prop('checked', false);
        };
        if(app_master_access_view){
            $(".app_master_view").prop('checked', true);
        }else{
            $(".app_master_view").prop('checked', false);
        };
        if(app_master_access_delete){
            $(".app_master_delete").prop('checked', true);
        }else{
            $(".app_master_delete").prop('checked', false);
        };

        if(web_master_access_edit){
            $(".web_master_edit").prop('checked', true);
        }else{
            $(".web_master_edit").prop('checked', false);
        };
        
        if(web_master_access_email){
            $(".web_master_email").prop('checked', true);
        }else{
            $(".web_master_email").prop('checked', false);
        };

        if(web_master_access_delete_email){
            $(".web_master_delete_email").prop('checked', true);
        }else{
            $(".web_master_delete_email").prop('checked', false);
        };

        if(web_master_order_cancel_email){
            $(".order_cancel_request_email").prop('checked', true);
        }else{
            $(".order_cancel_request_email").prop('checked', false);
        };

        if(web_master_access_view){
            $(".web_master_view").prop('checked', true);
        }else{
            $(".web_master_view").prop('checked', false);
        };
        if(web_master_access_delete){
            $(".web_master_delete").prop('checked', true);
        }else{
            $(".web_master_delete").prop('checked', false);
        };

        if(reports_access_edit){
            $(".reports_edit").prop('checked', true);
        }else{
            $(".reports_edit").prop('checked', false);
        };
        if(reports_access_view){
            $(".reports_view").prop('checked', true);
        }else{
            $(".reports_view").prop('checked', false);
        };
        if(reports_access_delete){
            $(".reports_delete").prop('checked', true);
        }else{
            $(".reports_delete").prop('checked', false);
        };

        if(recipe_access_edit){
            $(".recipe_edit").prop('checked', true);
        }else{
            $(".recipe_edit").prop('checked', false);
        };
        if(recipe_access_view){
            $(".recipe_view").prop('checked', true);
        }else{
            $(".recipe_view").prop('checked', false);
        };
        if(recipe_access_delete){
            $(".recipe_delete").prop('checked', true);
        }else{
            $(".recipe_delete").prop('checked', false);
        };

        if(couponCode_access_edit){
            $(".couponCode_edit").prop('checked', true);
        }else{
            $(".couponCode_edit").prop('checked', false);
        }
        if(couponCode_access_view){
            $(".couponCode_view").prop('checked', true);            
        }else{
            $(".couponCode_view").prop('checked', false);
        }
        if(couponCode_access_delete){
            $(".couponCode_delete").prop('checked', true);
        }else{
            $(".couponCode_delete").prop('checked', false);
        }
        if(gurukul_access_edit){
            $(".gurukul_edit").prop('checked', true);
        }else{
            $(".gurukul_edit").prop('checked', false);
        }
        if(gurukul_access_view){
            $(".gurukul_view").prop('checked', true);
        }else{
            $(".gurukul_view").prop('checked', false);
        }
        if(gurukul_access_delete){
            $(".gurukul_delete").prop('checked', true);
        }else{
            $(".gurukul_delete").prop('checked', false);
        }
        if(healthTips_access_edit){
            $(".healthTips_edit").prop('checked', true);
        }else{
            $(".healthTips_edit").prop('checked', false);
        }
        if(healthTips_access_view){
            $(".healthTips_view").prop('checked', true);
        }else{
            $(".healthTips_view").prop('checked', false);
        }
        if(healthTips_access_delete){
            $(".healthTips_delete").prop('checked', true);
        }else{
            $(".healthTips_delete").prop('checked', false);
        }
        if(lukeSession_access_edit){
            $(".lukeSession_edit").prop('checked', true);
        }else{
            $(".lukeSession_edit").prop('checked', false);
        }
        if(lukeSession_access_view){
            $(".lukeSession_view").prop('checked', true);
        }else{
            $(".lukeSession_view").prop('checked', false);
        }
        if(lukeSession_access_delete){
            $(".lukeSession_delete").prop('checked', true);
        }else{
            $(".lukeSession_delete").prop('checked', false);
        }
        if(policies_access_edit){
            $(".policies_delete").prop('checked', true);
        }else{
            $(".policies_delete").prop('checked', false);
        }
        if(policies_access_view){
            $(".policies_edit").prop('checked', true);
        }else{
            $(".policies_edit").prop('checked', false);
        }
        if(policies_access_delete){
            $(".policies_delete").prop('checked', true);
        }else{
            $(".policies_delete").prop('checked', false);
        }
        if(processCode_access_edit){
            $(".processCode_edit").prop('checked', true);
        }else{
            $(".processCode_edit").prop('checked', false);
        }
        if(processCode_access_view){
            $(".processCode_view").prop('checked', true);
        }else{
            $(".processCode_view").prop('checked', false);
        }
        if(processCode_access_delete){
            $(".processCode_delete").prop('checked', true);
        }else{
            $(".processCode_delete").prop('checked', false);
        }

        if(deleteProductReport_view){
            $(".deleteProductReport_view").prop('checked', true);
        }else{
            $(".deleteProductReport_view").prop('checked', false);
        }
        if(deleteProductReport_delete){
            $(".deleteProductReport_delete").prop('checked', true);
        }else{
            $(".deleteProductReport_delete").prop('checked', false);
        }

        $("#user_id").val(obj._id);
        $("#create_user_btn").text("Update User");

        $('#user_type').val(obj.user_type).focus();
        $('#user_type').formSelect();

        $('#user_status').val(obj.user_status).focus();
        $('#user_status').formSelect();

        $("#name").val(obj.name);
        $("#name").next("label").attr("class", "active");

        $("#mobile_number").val(obj.mobile_number);
        $("#mobile_number").next("label").attr("class", "active");

        $("#email").val(obj.email_id);
        $("#email").next("label").attr("class", "active");

        $("#address").val(obj.address);
        $("#address").next("label").attr("class", "active");
    },
    
    delete_user: function (e) {
        let self = this;
        if (self.del == false) {
            swal(
                'Sorry!',
                'You dont have delete access',
                'error'
            )
            return false;
        }
        var row = $(e).closest('tr');
        var obj = $('#user_table').dataTable().fnGetData(row);
        if (self.user_id == obj._id) {
            swal(
                'Sorry!',
                'You cannot delete your own profile',
                'error'
            )
            return false;
        }
        // swal({
        //     title: 'Are you sure?',
        //     text: "You won't be able to revert this!",
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonText: 'Yes, delete it!',
        //     cancelButtonText: 'No, cancel!',
        //     reverseButtons: true
        // })
        swal({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: 'warning',
            dangerMode: true,
            buttons: {
                cancel: 'No, cancel',
                delete: 'Yes, delete It'
            }
        })
        .then((willDelete) => {
            if (willDelete) {
                let $request = $.ajax({
                    url: self.base_url + "/users/delete_user/" + obj._id,
                    type: "delete",
                    dataType: "json"
                });
                $request.done(function (response) {
                    if (response.title == "success") {
                        $("#user_form").trigger("reset");
                        $("#user_id").val("");
                        swal(
                            'Deleted!',
                            'User has been deleted.',
                            'success'
                        )
                        user.get_users();
                    } else {
                        $("#user_id").val("");
                        swal(
                            'Error!',
                            'Something Went Wrong!',
                            'error'
                        )
                    };
                });
            } else {
                $("#user_id").val("");
                swal(
                    'Cancelled',
                    'Your data is safe :)',
                    'error'
                )
            }
        });
    },
};