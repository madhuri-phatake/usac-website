var section = {
    base_url: null,
    api_url: null,
    init: function () {
        this.bind_events();
        this.load_section_data();
    },

    bind_events: function () {
        var self = this;
        $("#select_section_reference_block").hide();

        $("#select_section_type").on('change', function () {
            if($("#select_section_type").val() == "Topics") {
                let self = this;
                let $request = $.ajax({
                    url: section.api_url + "/api/get_all_topic_masters_for_table",
                    type: "GET",
                    dataType: "json"
                });
                $request.done(function (response) {
                    $("#select_section_reference").empty('');
                    $("#select_section_reference").append('<option value="">Select Section Reference *</option>');
                    if(response.data.length > 0) {
                        $("#select_section_reference_block").show();
                        response.data.forEach((obj, i) => {
                            let name = `<option value="` + obj._id + `" data-id="` + obj._id + `">` + obj.topic_name + `</option>`;
                            $("#select_section_reference").append(name);
                            $("#select_section_reference").formSelect();
                            $("#select_section_reference").focus();
                        });
                    }
                    else {
                        $("#select_section_reference_block").hide();
                    }
                })
            }
            if($("#select_section_type").val() == "Inner Banner") {
                let self = this;
                let $request = $.ajax({
                    url: section.api_url + "/api/get_featured_banner_list",
                    type: "GET",
                    dataType: "json"
                });
                $request.done(function (response) {
                    $("#select_section_reference").empty('');
                    $("#select_section_reference").append('<option value="">Select Section Reference *</option>');
                    if(response.data.length > 0) {
                        $("#select_section_reference_block").show();
                        response.data.forEach((obj, i) => {
                            if(obj.featured_banner_type == "hompage_featured_banner"){
                                let name = `<option value="` + obj._id + `" data-id="` + obj._id + `">` + obj.title + `</option>`;
                                $("#select_section_reference").append(name);
                                $("#select_section_reference").formSelect();
                                $("#select_section_reference").focus();
                            }
                        });
                    }
                    else {
                        $("#select_section_reference_block").hide();
                    }
                })
            }
        });

        $("#create_section").on('click', function (event) {
            $('form[id="section_form"]').validate({
                rules: {
                    select_section_type: {
                        required: true
                    },
                    section_priority : {
                        required: true
                    }
                },
                messages: {
                    select_section_type: {
                        required: "<span style='font-size:10px; color: red;'>Please enter section</span>",
                    },
                    section_priority: {
                        required: "<span style='font-size:10px; color: red;'>Please enter priority</span>",
                    }
                },
                errorElement: 'div',
                errorPlacement: function (error, element) {
                    var placement = $(element).data('error');
                    if (placement) {
                        $(placement).append(error)
                    } else {
                        let elem = element.closest('.input-field');
                        elem.append(error);
                    }
                },
                submitHandler: function () {
                    let select_section_type = $("#select_section_type").val();
                    if(select_section_type == "Topics" || select_section_type == "Inner Banner") {
                        if($("#select_section_reference").val() == "") {
                            $("#create_section_btn").attr("disabled", false);
                            toastr["error"]("Please select the reference of the section", "error");
                            return false;
                        }
                        else {
                            section.add_section();    
                        }
                    }
                    else {
                        section.add_section();
                    }
                }
            });
        });

    
    },

    //Add section
    add_section: function () {
        $("#create_section").prop("disabled", true);
        var self = this;
        let obj             = new Object();
        obj.section_color   = $("#section_color").val();
        obj.section_text_color   = $("#section_text_color").val();
        obj.priority        = $("#section_priority").val();
        obj.section_type    = $("#select_section_type").val();
        obj.reference_id    = $("#select_section_reference").val();
        obj.reference_name  = $("#select_section_reference :selected").text();
        let id = $("#section_id").val();

        if(id == "") {
            obj._id = null;
        }
        else {
            obj._id = id;
        }
        
        let $request = $.ajax({
            url: self.api_url + "/api/create_section_priority",
            contentType: "application/json; charset= utf-8",
            type: "POST",
            data: JSON.stringify(obj),
            dataType: "json"
        });
        $request.done(function (response) {
            $("#create_section_btn").attr("disabled", false);
            if (response.title == "success") {
                $("#create_section_btn").text("Submit");
                $("#section_form").trigger("reset");
                $("#section_id").val("");
                $("#select_section_reference_block").hide();
                toastr["success"](response.message, "Success");
                $("#create_section").prop("disabled", false);
                section.load_section_data();
            } else {
                $("#create_section_btn").attr("disabled", false);
                toastr["error"](response.message, "error");
            };
        });
    },

    load_section_data: function () {
        let self = this;
        $.ajax({
            type: "GET",
            url: self.api_url + "/api/get_all_section_priority",
            data: "",
            dataType: "json",
            contentType: "application/json; charset= utf-8",
            success: function (response) {
                $('#section_table').empty();
                $('#section_table').DataTable({
                    "serverSide": false,
                    "paging": true,
                    "destroy": true,
                    "bFilter": true,
                    "aaSorting": [],
                    "bLengthChange": false,
                    "autoWidth": false,
                    "dom": 'Blfrtip',
                    "data": response.data,
                    "lengthMenu": [
                        [100, 25, 50, -1],
                        [100, 25, 50, "All"]
                    ],
                    "destroy": true,
                    "buttons": [
                        {
                            text: 'Reset All Default Colors',
                            className: "ml-2 export-btn waves-effect waves-light btn mrm gradient-45deg-deep-orange-orange waves-effect float-right",
                            action: function ( e, dt, node, config ) {
                                section.resectSectionColor();
                            },
                        },
                    ],
                    "columnDefs": [{
                        "orderable": false,
                        "targets": 0
                    }],
                    "rowCallback": function (nRow, aData, iDisplayIndex) {
                        var oSettings = this.fnSettings();
                        $("td:first", nRow).html(oSettings._iDisplayStart + iDisplayIndex + 1);
                        return nRow;
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
                            'data': 'section_type',
                            'sTitle': 'Section'
                        },
                        {
                            'data': 'reference_name',
                            'sTitle': 'Reference',
                            'render': function(data, type, row) {
                                if(data == null || data == "") {
                                    return "-";
                                }
                                else {
                                    return data;
                                }
                            }
                        },
                        {
                            'data': 'priority',
                            'sTitle': 'Priority'
                        },
                        {
                            'data': 'section_color',
                            'sTitle': 'Section Color',
                            'render': function(data, type, row) {
                                if(data == null || data == "") {
                                    return "-";
                                }
                                else {
                                    return `<p class="sectionColor">${data}</p>`;
                                }
                            }
                        },
                        {
                            'data': 'section_text_color',
                            'sTitle': 'Section Text Color',
                            'render': function(data, type, row) {
                                if(data == null || data == "") {
                                    return "-";
                                }
                                else {
                                    return `<p>${data}</p>`;
                                }
                            }
                        },
                        {
                            'data': 'null',
                            'width': '10%',
                            'sTitle': 'Action',
                            'render': function (data, type, row) {
                                return '<a class="mb-6 btn-floating waves-effect waves-light gradient-45deg-green-teal disable-edit" onclick="section.edit_section(this)" title="Edit"> <i class="material-icons">create</i> </a> <a class="mb-6 btn-floating waves-effect waves-light gradient-45deg-purple-deep-orange disable-delete" onclick="section.delete_section(this)" title="Delete"> <i class="material-icons">delete_forever</i> </a>'
                            }
                        }
                    ],
        
                });
            }
        });
    },

    //number validation
    isNumberKey: function(evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode != 46 && charCode > 31 &&
            (charCode < 48 || charCode > 57))
            return false;

        return true;
    },

    edit_section: async function (e) {
        let self = this;
        if (self.edit == false) {
            swal(
                'Sorry!',
                'You dont have edit access',
                'error'
            )
            return false;
        }
        let row = $(e).closest('tr');
        let obj = $('#section_table').dataTable().fnGetData(row);

        $("#section_id").val(obj._id);
        $("#select_section_type").val(obj.section_type);
        $("#select_section_type").next("label").attr("class", "active");
        if(obj.reference_id != "" && obj.reference_id != null) {
            if(obj.section_type == "Topics") {
                let $request = $.ajax({
                    url: section.api_url + "/api/get_all_topic_masters_for_table",
                    type: "GET",
                    dataType: "json"
                });
                $request.done(function (response) {
                    $("#select_section_reference").empty('');
                    $("#select_section_reference").append('<option value="">Select Section Reference *</option>');
                    if(response.data.length > 0) {
                        $("#select_section_reference_block").show();
                        response.data.forEach((newObj, i) => {
                            let selectedOption = ``;
                            if(obj.reference_id.toString() == newObj._id.toString()) {
                                selectedOption = `selected`;
                            }
                            let name = `<option value="` + newObj._id + `" data-id="` + newObj._id + `" `+selectedOption+`>` + newObj.topic_name + `</option>`;
                            $("#select_section_reference").append(name);
                            $("#select_section_reference").formSelect();
                            $("#select_section_reference").focus();
                        });
                    }
                    else {
                        $("#select_section_reference_block").hide();
                    }
                })
            }
            if(obj.section_type == "Inner Banner") {
                let $request = $.ajax({
                    url: section.api_url + "/api/get_featured_banner_list",
                    type: "GET",
                    dataType: "json"
                });
                $request.done(function (response) {
                    $("#select_section_reference").empty('');
                    $("#select_section_reference").append('<option value="">Select Section Reference *</option>');
                    if(response.data.length > 0) {
                        $("#select_section_reference_block").show();
                        response.data.forEach((newObj, i) => {
                            let selectedOption = ``;
                            if(obj.reference_id.toString() == newObj._id.toString()) {
                                selectedOption = `selected`;
                            }
                            let name = `<option value="` + newObj._id + `" data-id="` + newObj._id + `"  `+selectedOption+`>` + newObj.title + `</option>`;
                            $("#select_section_reference").append(name);
                            $("#select_section_reference").formSelect();
                            $("#select_section_reference").focus();
                        });
                    }
                    else {
                        $("#select_section_reference_block").hide();
                    }
                })
            }
            $("#select_section_reference_block").show();
        }
        else {
            $("#select_section_reference_block").hide();
        }
        $("#create_section_btn").text("Update");
        $("#section_priority").val(obj.priority);
        $("#section_priority").next("label").attr("class", "active");
        $("#section_color").val(obj.section_color);
        $("#section_text_color").val(obj.section_text_color);
    },

    delete_section: function (e) {
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
        var obj = $('#section_table').dataTable().fnGetData(row);
        var section_id = obj._id;
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
                var $request = $.ajax({
                    url: self.api_url + "/api/delete_section_priority/"+section_id ,
                    type: "DELETE",
                    dataType: "json"
                });
                $request.done(function (response) { 
                    if (response.title == "success") {
                        $("#section_form").trigger("reset");
                        $("#section_id").val("");
                        $("#section_bar").css("width", "0%");
                        toastr.success('Deleted!', 'Success');
                        section.load_section_data();
                    } else {
                        $("#category_id").val("");
                        toastr.error('Something Went wrong!', 'Error');
                    };
                });
            } else {
                $("#section_id").val("");
                swal(
                    'Sorry!',
                    'Your data is safe :)',
                    'error'
                )
            }
        });
    },

    resectSectionColor: function (e) {
        var self = this;
        let sectionData = [];
        $(".sectionColor").each(function (){
            var row = $(this).closest('tr');
            var obj = $('#section_table').dataTable().fnGetData(row);
            let defaultColor = "";
            let defaultTextColor = "";
            
               if(obj.section_type == "Top Header"){

                    defaultColor = "#756251"
                    defaultTextColor = "#FFFFFF"

                } else if(obj.section_type == "Primary Header"){

                    defaultColor = "#FFF7EB"
                    defaultTextColor = "#000000"

                } else if(obj.section_type == "Quick links"){
                
                    defaultColor = "#F5F1EE"
                    defaultTextColor = "#000000"

                }else if(obj.section_type == "Category"){
                
                    defaultColor = "#FFFFFF"
                    defaultTextColor = "#000000"

                }else if(obj.section_type == "Why buy from us"){

                    defaultColor = "#F5F1EE"
                    defaultTextColor = "#AB8B67"

                }else if(obj.section_type ==  "Recently viewed products"){
                   
                    defaultColor  = "#FFF7EB"
                    defaultTextColor  = "#AB8B67"

                }else if(obj.section_type ==  "Featured products"){
                   
                    defaultColor = "#F5F1EE"
                    defaultTextColor  = "#AB8B67"

                }else if(obj.section_type ==  "Topics"){
                    
                    defaultColor = "#FFF7EB"
                    defaultTextColor  = "#AB8B67"

                }else if(obj.section_type ==  "Spotlight"){
                    
                    defaultColor  = "#F5F1EE"
                    defaultTextColor  = "#AB8B67"

                }else if(obj.section_type ==  "shop_by_concern_quick_links"){
                   
                    defaultColor = "#FFF7EB"
                    defaultTextColor  = "#AB8B67"

                }else if(obj.section_type ==  "Featured Blogs"){
                    
                    defaultColor =  "#ffff"
                    defaultTextColor  = "#AB8B67"

                }else if(obj.section_type ==  "Recipe"){
                    
                    defaultColor = "#ffff"
                    defaultTextColor  = "#AB8B67"

                }else if(obj.section_type ==  "Shop by Brand"){
                   
                    defaultColor = "#F5F1EE"
                    defaultTextColor  = "#AB8B67"

                }else if(obj.section_type ==  "Newsletter"){
                    
                    defaultColor =  "#FFF7EB"
                    defaultTextColor  = "#AB8B67"

                }else if(obj.section_type ==  "Gift Card"){
                    
                    defaultColor = "#FFFFFF"
                    defaultTextColor  = "#AB8B67"

                }else if(obj.section_type ==  "Our Happy Customers"){
                    
                    defaultColor = "#FFF7EB"
                    defaultTextColor  = "#AB8B67"

                }else if(obj.section_type ==  "Youcare TV"){
                   
                    defaultColor = "#FFFFFF"
                    defaultTextColor  = "#AB8B67"

                }else if(obj.section_type ==  "Media"){
                    
                    defaultColor = "#FFFFFF"
                    defaultTextColor  = "#AB8B67"

                }else if(obj.section_type ==  "Inner Banner"){
                    
                    defaultColor = "#FFFFFF"
                    defaultTextColor  = "#AB8B67"

                }else if(obj.section_type ==  "Recommended Products"){
                    
                    defaultColor = "#FFFFFF"
                    defaultTextColor  = "#AB8B67"

                }else if(obj.section_type ==  "Top Products"){
                  
                    defaultColor = "#e3b348"
                    defaultTextColor = "#FEE6C3"

                }else if(obj.section_type ==  "Footer Section"){

                    defaultColor = "#756251"
                    defaultTextColor = "#FFFFFF"

                }
            
            sectionData.push({
                _id           : obj._id,
                section_type  : obj.section_type,
                section_color : defaultColor,
                section_text_color : defaultTextColor
            });
        });

        swal({
            title: "Are you sure?",
            text: "Do You Want To Set Default Colors!",
            icon: 'warning',
            dangerMode: true,
            buttons: {
                cancel: 'No',
                delete: 'Yes, Reset All'
            }
        }).then((willRestore) => {
            if (willRestore) {
                
                // update defult color
                let obj             = new Object();
                obj.section_data     = sectionData
                let $request = $.ajax({
                    url: section.api_url + "/api/bulk_update_section_color",
                    contentType: "application/json; charset= utf-8",
                    type: "POST",
                    data: JSON.stringify(obj),
                    dataType: "json"
                });
                $request.done(function (response) {
                    if (response.title == "success") {
                        toastr["success"](response.message, "Success");
                        section.load_section_data();   
                    } else {
                        toastr["error"](response.message, "error");
                    };
                });

                
            } else {
                swal("Product is safe", {
                    title: 'Cancelled',
                    icon: "error",
                });
            }
        });
        
    }
};