var seo = {
    base_url: null,
    api_url: null,
    init: function () {
        this.bind_events();
        this.load_seos();
        this.readSitemapTime();
        this.load_products();
    },

    bind_events: function () {
        var self = this;
        $("#generateSitemap").click(function(){
            seo.createSitemap();
        });
        $("#downloadSitemap").click(function(){
            location.href =self.web_url + "/sitemap.zip";
        });
        $("#seo_type").on('change',function() {
            if($("#seo_type").val() == "product_details") {
                $("#seo_product1").css("display","block");
                $("#vendor_image").css("display","none");
            }
            else if($("#seo_type").val() == "blog_details") {
                seo.load_blogs();
                $("#seo_product1").css("display","block");
                $("#vendor_image").css("display","none");
            }
            else if($("#seo_type").val() == "product_list_by_category") {
                seo.load_categories();
                $("#seo_product1").css("display","block");
                $("#vendor_image").css("display","none");
            }
            else if($("#seo_type").val() == "product_list_by_subcategory") {
                seo.load_subcategories();
                $("#seo_product1").css("display","block");
                $("#vendor_image").css("display","none");
            }
            else if($("#seo_type").val() == "product_list_by_second_subcategory") {
                seo.load_subcategories2();
                $("#seo_product1").css("display","block");
                $("#vendor_image").css("display","none");
            }
            else if($("#seo_type").val() == "vendor_products") {
                seo.load_vendors();
                $("#seo_product1").css("display","block");
                $("#vendor_image").css("display","block");
            }
            else {
                $("#seo_product1").css("display","none");
                $("#vendor_image").css("display","none");
            }
        })
        $("#create_seo").on('click', function (event) {
            $('form[id="seo_form"]').validate({
                rules: {
                    seo_title: {
                        required: true
                    },
                    seo_description: {
                        required: true
                    },
                    seo_type: {
                        required: true
                    },
               },
                messages: {
                    seo_title: {
                        required: "<span style='font-size:10px; color: red;'>Please enter seo title</span>",
                    },
                    seo_description: {
                        required: "<span style='font-size:10px; color: red;'>Please enter description</span>",
                    },
                    seo_type: {
                        required: "<span style='font-size:10px; color: red;'>Please select the page</span>",
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
                    if ($("#seo_type").val().trim() == "") {
                        toastr["error"]("Please select page", "error");
                        return false;
                    }
                    else if ($("#seo_title").val().trim() == "") {
                        toastr["error"]("Enter valid title", "error");
                        return false;
                    }
                    else if ($("#seo_description").val().trim() == "") {
                        toastr["error"]("Enter description", "error");
                        return false;
                    }
                    else {
                        seo.add_seo();
                    }
                }
            });
        });
    },
    createSitemap: function() {
        let self = this;
        swal({
            title: "Are you sure?",
            text: "You won't be able to revert this action!",
            icon: 'warning',
            dangerMode: true,
            buttons: {
                cancel: 'No, cancel',
                delete: 'Yes, Generate'
            }
        })
        .then((willDelete) => {
            if (willDelete) {
                $("#generateSitemap span").text("Please Wait...");
                let $request = $.ajax({
                    url: self.base_url + "/api/generateSitemap",
                    type: "post",
                    dataType: "json"
                });
                $request.done(function (response) {
                    if(response.title == "success"){
                        seo.readSitemapTime();
                        swal(
                            'Success',
                            'Sitemap Generated!',
                            'success'
                        )
                        $("#generateSitemap span").text("Generate Sitemap");
                    }else{
                        $("#generateSitemap span").text("Generate Sitemap");
                    }
                })
            } else {
                swal(
                    'Cancelled',
                    'Operation Cancelled',
                    'error'
                )
            }
        });
    },
    readSitemapTime: function() {
        let self = this;
        let $request = $.ajax({
            url: self.base_url + "/api/readSitemapTime",
            type: "get",
            dataType: "json"
        });
        $request.done(function (response) {
            if(response.title == "success"){
                date = new Date(response.data);
                date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate() + " " + date.getTime();
                $("#lastGenerated").text(date);
            }else{
                $("#lastGenerated").text("NA");
            }
        })
    },
    load_products: function () {
        let self = this;
        let $request = $.ajax({
            url: self.api_url + "/api/get_all_active_product_list",
            type: "get",
            dataType: "json"
        });
        $request.done(function (response) {
            $("#seo_product").empty('');
            $("#seo_product").append('<option value="">Select Product*</option>');
            response.data.forEach((obj, i) => {
                let products = `<option value="` + obj.product_name + `" data-original = "`+obj._id+`" data-id="` + obj.product_url + `">` + obj.product_name + `</option>`;
                $("#seo_product").append(products);
                $("#seo_product").formSelect();
                $("#seo_product").focus();
            });
        })
    },

    load_categories: function () {
        let self = this;
        let $request = $.ajax({
            url: self.api_url + "/api/get_all_active_category_list",
            type: "get",
            dataType: "json"
        });
        $request.done(function (response) {
            $("#seo_product").empty('');
            $("#seo_product").append('<option value="">Select Category*</option>');
            response.data.forEach((obj, i) => {
                let products = `<option value="` + obj.category_name + `" data-original = "`+obj._id+`" data-id="` + obj.url + `">` + obj.category_name + `</option>`;
                $("#seo_product").append(products);
                $("#seo_product").formSelect();
                $("#seo_product").focus();
            });
        })
    },

    load_blogs: function () {
        let self = this;
        let $request = $.ajax({
            url: self.api_url + "/api/get_all_blogs",
            type: "get",
            dataType: "json"
        });
        $request.done(function (response) {
            $("#seo_product").empty('');
            $("#seo_product").append('<option value="">Select Blog*</option>');
            response.data.forEach((obj, i) => {
                let products = `<option value="` + obj.title + `" data-original = "`+obj._id+`" data-id="` + obj.link + `">` + obj.title + `</option>`;
                $("#seo_product").append(products);
                $("#seo_product").formSelect();
                $("#seo_product").focus();
            });
        })
    },

    load_subcategories: function () {
        let self = this;
        let $request = $.ajax({
            url: self.api_url + "/api/get_all_active_subcategory_list",
            type: "get",
            dataType: "json"
        });
        $request.done(function (response) {
            $("#seo_product").empty('');
            $("#seo_product").append('<option value="">Select Subcategory*</option>');
            response.data.forEach((obj, i) => {
                let products = `<option value="` + obj.sub_category_name + `" data-original = "`+obj._id+`" data-id="` + obj.url + `">` + obj.sub_category_name + `</option>`;
                $("#seo_product").append(products);
                $("#seo_product").formSelect();
                $("#seo_product").focus();
            });
        })
    },

    load_subcategories2: function () {
        let self = this;
        let $request = $.ajax({
            url: self.api_url + "/api/get_all_active_second_subcategory_list",
            type: "get",
            dataType: "json"
        });
        $request.done(function (response) {
            $("#seo_product").empty('');
            $("#seo_product").append('<option value="">Select Subcategory2*</option>');
            response.data.forEach((obj, i) => {
                let products = `<option value="` + obj.sub_category_name_2 + `" data-original = "`+obj._id+`" data-id="` + obj.url + `">` + obj.sub_category_name_2 + `</option>`;
                $("#seo_product").append(products);
                $("#seo_product").formSelect();
                $("#seo_product").focus();
            });
        })
    },

    load_vendors: function () {
        let self = this;
        let $request = $.ajax({
            url: self.api_url + "/api/get_all_active_vendor_list",
            type: "get",
            dataType: "json"
        });
        $request.done(function (response) {
            $("#seo_product").empty('');
            $("#seo_product").append('<option value="">Select Vendor*</option>');
            response.data.forEach((obj, i) => {
                let products = `<option value="` + obj.company_name + `" data-original = "`+obj._id+`" data-id="` + obj.vendor_url + `">` + obj.company_name + `</option>`;
                $("#seo_product").append(products);
                $("#seo_product").formSelect();
                $("#seo_product").focus();
            });
        })
    },

    add_seo: function () {
        var self = this;
        let id = $("#seo_id").val();
        let obj             = new Object();
        obj.page_name       = $("#seo_type").val();
        obj.title           = $("#seo_title").val();
        obj.description     = $("#seo_description").val();
        obj.keywords        = $("#seo_keywords").val();
        if($("#seo_type").val() == "product_details" || $("#seo_type").val() == "product_list_by_category" || $("#seo_type").val() == "product_list_by_subcategory" || $("#seo_type").val() == "product_list_by_second_subcategory" || $("#seo_type").val() == "vendor_products" || $("#seo_type").val() == "blog_details") {
            obj.product_name    = $("#seo_product").val();
            obj.product_url    = $("#seo_product").find(':selected').attr("data-id");
            obj.id    = $("#seo_product").find(':selected').attr("data-original");
            if(obj.product_name == "") {
                toastr["error"]("Please select option", "error");
                return false;
            }
        }
        else {
            obj.product_name    = null;
            obj.product_url    = null;
        }
        // alert(obj.product_url);
        if ($(".seo_icon").attr("data-path")) {
            obj.seo_icon = {
                icon_path: $(".seo_icon").attr("data-path"),
                icon_url: $(".seo_icon").attr("data-url")
            };
        } else {
            obj.seo_icon = {
                icon_path: "/admin/images/icon/noicon.jpg",
                icon_url: "/admin/images/icon/noicon.jpg"
            };
        }
        if (id == "" || id == null) {
            obj._id             = null;
            let $request = $.ajax({
                url: self.base_url + "/api/create_seo",
                contentType: "application/json; charset= utf-8",
                type: "POST",
                data: JSON.stringify(obj),
                dataType: "json"
            });
            $request.done(function (response) {
                $("#create_seo_btn").attr("disabled", false);
                if (response.title == "success") {
                    $("#seo_form").trigger("reset");
                    toastr["success"](response.message, "Success");
                    $("#seo_product1").css("display","none");
                    $("#vendor_image").css("display","none");
                    seo.load_seos();
                } else {
                    $("#create_seo_btn").attr("disabled", false);
                    toastr["error"](response.message, "error");
                };
            });
        } else {
            obj._id = id;
            let $request = $.ajax({
                url: self.base_url + "/api/create_seo",
                contentType: "application/json; charset= utf-8",
                type: "POST",
                data: JSON.stringify(obj),
                dataType: "json"
            });
            $request.done(function (response) {
                $("#create_seo_btn").attr("disabled", false);
                if (response.title == "success") {
                    $("#seo_id").val("");
                    $("#create_seo_btn").text("Add");
                    $("#seo_form").trigger("reset");
                    toastr["success"](response.message, "Success");
                    $("#seo_product1").css("display","none");
                    $("#vendor_image").css("display","none");
                    seo.load_seos();
                } else {
                    $("#create_seo_btn").attr("disabled", false);
                    toastr["error"](response.message, "error");
                };
            });
        }
    },

    load_seos: function () {
        let self = this;
        let $request = $.ajax({       
            url: self.base_url + "/api/get_seo_list",
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset= utf-8",
            success: function (response) {
                $('#seo_table').empty();
                $('#seo_table').DataTable({
                    "data": response.data,
                    "processing": true,
                    "lengthMenu": [
                        [10, 25, 50, -1],
                        [10, 25, 50, "All"]
                    ],
                    "aaSorting": [],
                    "destroy": true,
                    "dom": 'Blfrtip',
                    "columnDefs": [{
                        "orderable": false,
                        "targets": 0
                    }],
                    "buttons": [{
                        "extend": 'excelHtml5',
                        "exportOptions": {
                            "columns": [2, 3, 4, 5]
                        },
                        "className": "ml-2 export-btn waves-effect waves-light btn mrm gradient-45deg-green-teal",
                    }],
                    // "ajax": {
                    //     "url": self.base_url + "/api/get_seo_list",
                    //     "type": "GET",
                    //     "data": { "records": "all"},
                    //     "datatype": "json"
                    // },
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
                        },
                        {
                            'data': 'page_name',
                            'sTitle': 'Page Type',
                        },
                        {
                            'data': 'title',
                            'sTitle': 'Title',
                        },
                        {
                            'data': 'product_name',
                            'sTitle': 'Page Name',
                            'render': function (data, type, row) {
                                if(data == null) {
                                    return "-";
                                }
                                else {
                                    return data;
                                }
                            }
                        },
                        {
                            'data': 'keywords',
                            'sTitle': 'Keywords',
                        },
                        {
                            'data': 'description',
                            'sTitle': 'Description'
                        },
                        {
                            'data': 'null',
                            'width': '15%',
                            'sTitle': 'Action',
                            'render': function (data, type, row) {
                                return '<a class="mb-6 btn-floating waves-effect waves-light gradient-45deg-green-teal disable-edit" onclick="seo.edit_seo(this)" title="Edit"> <i class="material-icons">create</i> </a><a class="mb-6 btn-floating waves-effect waves-light gradient-45deg-purple-deep-orange disable-delete" onclick="seo.delete_seo(this)" title="Delete"> <i class="material-icons">delete_forever</i> </a>'
                            }
                        }

                    ],

                });
            }
        });
    },

    remove_image: function (e) {
        var bucketName = "luke-images";
        var s3 = new AWS.S3({
            apiVersion: '2006-03-01',
        });
        var params = {
            Bucket: bucketName,
            Key: $(e).attr("data-path")
        }
        s3.deleteObject(params, function (err, data) {
            if (data) {
                $(e).closest(".parent").children("input[type='file']").val("");
                $(e).closest(".parent").children(".progress").children("div").css({
                    "width": "0%"
                });
                $(e).closest(".image-preview").remove();
                $("#category_icon").val("");
                $("#category_icon").hide();
                $("#category_icon").show();
            } else {
                console.log("Check if you have sufficient permissions : " + err);
            }
        });
    },


    //Edit seo
    edit_seo: function (e) {
        let self = this;
        let row = $(e).closest('tr');
        let obj = $('#seo_table').dataTable().fnGetData(row);
        $("#seo_id").val(obj._id);
        $("#create_seo_btn").text("Update");
        $("#seo_type").val(obj.page_name);
        $("#seo_type").focus();
        $("#seo_type").next("label").attr("class", "active");
        $("#seo_title").val(obj.title);
        $("#seo_title").next("label").attr("class", "active");
        $("#seo_keywords").val(obj.keywords);
        $("#seo_keywords").next("label").attr("class", "active");
        $("#seo_description").val(obj.description);
        $("#seo_description").next("label").attr("class", "active");
        if($("#seo_type").val() == "product_details") {
            $("#seo_product1").css("display","block");
            $("#vendor_image").css("display","none");
        }
        else if($("#seo_type").val() == "product_list_by_category") {
            seo.load_categories();
            $("#seo_product1").css("display","block");
            $("#vendor_image").css("display","none");
        }
        else if($("#seo_type").val() == "product_list_by_subcategory") {
            seo.load_subcategories();
            $("#seo_product1").css("display","block");
            $("#vendor_image").css("display","none");
        }
        else if($("#seo_type").val() == "product_list_by_second_subcategory") {
            seo.load_subcategories2();
            $("#seo_product1").css("display","block");
            $("#vendor_image").css("display","none");
        }
        else if($("#seo_type").val() == "blog_details") {
            seo.load_blogs();
            $("#seo_product1").css("display","block");
            $("#vendor_image").css("display","none");
        }
        else if($("#seo_type").val() == "vendor_products") {
            seo.load_vendors();
            $("#seo_product1").css("display","block");
            $("#vendor_image").css("display","block");
        }
        else {
            $("#seo_product1").css("display","none");
            $("#vendor_image").css("display","none");
        }
        setTimeout(function(){ 
            $("#seo_product").val(obj.product_name);
            $("#select2-seo_product-container").text(obj.product_name);
            $("#seo_product").formSelect();
            $("#seo_product").focus();
        }, 3000);
    },

    delete_seo: function (e) {
        let self = this;
        var row = $(e).closest('tr');
        var obj = $('#seo_table').dataTable().fnGetData(row);
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
                    obj.seo_id = obj._id;
                    let $request = $.ajax({
                        url: self.base_url + "/api/delete_seo",
                        type: "POST",
                        data: {seo_id: obj.seo_id},
                        dataType: "json"
                    });
                    $request.done(function (response) {
                        if (response.title == "success") {
                            $("#seo_form").trigger("reset");
                            $("#seo_id").val("");
                            swal(
                                'Deleted!',
                                'SEO details has been deleted.',
                                'success'
                            )
                            seo.load_seos();
                        } else {
                            $("#seo_id").val("");
                            swal(
                                'Error!',
                                'Something Went Wrong!',
                                'error'
                            )
                        };
                    });
                } else {
                    $("#seo_id").val("");
                    swal(
                        'Cancelled',
                        'Your data is safe :)',
                        'error'
                    )
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

};

async function UPLOAD_ICON(dataArray, event) {
    var bucketName = "luke-images-data";
    var s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: {
            Bucket: bucketName
        }
    });
    let data = {
        'id': $(dataArray).attr("id"),
        'progress-bar': $(dataArray).attr("data-progress-bar"),
        'append-class': $(dataArray).attr("data-append-class"),
        'common-class': $(dataArray).attr("data-common-class"),
        'subfolder-name': $(dataArray).attr("data-subfolder-name"),
        'data-is-multiple': $(dataArray).attr("data-is-multiple"),
    };
    if (data["data-is-multiple"] == "false") {
        if ($("." + data["common-class"]).length > 0) {
            swal(
                'Error',
                "You can't upload multiple files",
                'error'
            )
            return false;
        };
    }
    var fuData = document.getElementById(data["id"]);
    var FileUploadPath = fuData.value;
    if (FileUploadPath == '') {} else {
        var Extension = FileUploadPath.substring(
            FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
        if (Extension == "png" || Extension == "jpg" || Extension == "jpeg" || Extension == "svg" || Extension == "ico") {
            $("#" + data["progress-bar"]).css('width', "0%");
            var today = new Date();
            var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
            for (var i = 0; i < event.target.files.length; i++) {
                var imageFile = event.target.files[i];
                let img = new Image();
                img.src = window.URL.createObjectURL(imageFile);
                img.onload = async () => {
                    let width = img.width;
                    let height = img.height;
                    if (width == 100 && height == 100) {
                        if (imageFile.size <= 500000) {
                            var filePath = "seo/" + data["subfolder-name"] + "/" + date + "/" + uuidv4() + "." + Extension;
                            await s3.upload({
                                Key: filePath,
                                Body: imageFile,
                                ACL: 'public-read'
                            }, async function (err, data1) {
                                if (err) {
                                    toastr.error('Something Went wrong !.', 'Error');
                                } else {
                                    let fileUrl = null;
                                    fileUrl = "https://images.youcarelifestyle.com/" + filePath;
                                    $("#" + data["progress-bar"]).show();
                                    $("." +
                                        data["append-class"]).show();
                                    let imgBox = `<div class="image-preview ` + data['common-class'] + `"
                                                            data-path="` + filePath + `" data-url="` + fileUrl + `">
                                                            <a href="` + fileUrl + `" target="_blank">
                                                                <img src="` + fileUrl + `" alt="avatar" onerror="$(this).attr('src','/admin/images/icon/document.png');">
                                                            </a>
                                                            <span>` + imageFile.name + `</span>
                                                            <button type="button" title="Remove Image" class="remove-img-btn" onclick="seo.remove_image(this)"
                                                                data-path="` + filePath + `">
                                                                <i class="material-icons">close</i>
                                                            </button>
                                                            </div>`;
                                    setTimeout(function () {
                                        $("." + data["append-class"]).prepend(imgBox);
                                    }, 4000);

                                }
                            }).on('httpUploadProgress', async function (progress) {
                                var uploaded = parseInt((progress.loaded * 100) / progress.total);
                                $("#" + data["progress-bar"]).css('width', uploaded + "%");
                            });
                        } else {
                            $("#" + data["id"]).val("");
                            toastr['error']('File size needs to be less than or equal to 500kb', 'File name: ' + imageFile
                                .name);
                        }
                    } else {
                        $("#" + data["id"]).val("");
                        toastr['error']('Icon resolution should be 100x100px', 'Error');
                    }
                }
            }
        } else {
            $("#" + data["id"]).val("");
            toastr['error']('Only JPG or PNG or JPEG file types are allowed', 'Error');
        }
    }
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}


function alpha(e) {
    var k;
    document.all ? k = e.keyCode : k = e.which;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
}

function alpha1(e) {
    var k;
    document.all ? k = e.keyCode : k = e.which;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 44|| k == 32 || (k >= 48 && k <= 57));
}

async function UPLOAD_LOGO(dataArray, event) {

    var bucketRegion = "ap-south-1";
    let data = {
        'id': $(dataArray).attr("id"),
        'progress-bar': $(dataArray).attr("data-progress-bar"),
        'append-class': $(dataArray).attr("data-append-class"),
        'common-class': $(dataArray).attr("data-common-class"),
        'subfolder-name': $(dataArray).attr("data-subfolder-name"),
        'data-is-multiple': $(dataArray).attr("data-is-multiple"),
    };
    if (data["data-is-multiple"] == "false") {
        if ($("." + data["common-class"]).length > 0) {
            swal(
                'Error',
                'You cannot upload multiple files in this field',
                'error'
            )
            return false;
        };
    }
    var fuData = document.getElementById(data["id"]);
    var FileUploadPath = fuData.value;
    if (FileUploadPath == '') {} else {
        var Extension = FileUploadPath.substring(
            FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
        if (Extension == "png" || Extension == "jpg" || Extension == "jpeg" || Extension == "pdf") {
            $("#" + data["progress-bar"]).css('width', "0%");

            var bucketName = "luke-images-data";
            if (Extension == "pdf") {
                bucketName = "luke-images";
            }
            var s3 = new AWS.S3({
                apiVersion: '2006-03-01',
                params: {
                    Bucket: bucketName
                }
            });

            var today = new Date();
            var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
            for (var i = 0; i < event.target.files.length; i++) {
                var imageFile = event.target.files[i];
                if (event.target.files[i].size <= 2000000) {
                    var filePath = "vendor/" + data["subfolder-name"] + "/" + date + "/" + uuidv4() + "." + Extension;
                    await s3.upload({
                        Key: filePath,
                        Body: imageFile,
                        ACL: 'public-read'
                    }, async function (err, data1) {
                        if (err) {
                            toastr.error('Something Went wrong !.', 'Error');
                        } else {
                            let fileUrl = null;
                            fileUrl = "https://images.youcarelifestyle.com/" + filePath;
                            $("#" + data["progress-bar"]).show();
                            $("." +
                                data["append-class"]).show();
                            var file = "";
                            if (Extension == "pdf") {
                                file = `<a href="` + fileUrl + `" target="_blank">
                                            <img data-url="` + fileUrl + `" src="/admin/images/icon/doc.png">
                                        </a>`
                            } else {
                                file = `<a class="product-images-link" href="` + fileUrl + `" data-lightbox="product-images" data-title="Click the right half of the image to move forward.">
                                            <img id="vendor_logo_img" data-url="` + fileUrl + `" class="product-images" src="` + fileUrl + `">
                                        </a>`
                            }
                            let imgBox = `<div class="image-preview ` + data['common-class'] + `"
                                        data-path="` + filePath + `" data-url="` + fileUrl + `">
                                        ` + file + `
                                        <button id="remove_profile_button" type="button" title="Remove Image" class="remove-img-btn" onclick="vendor_profile.remove_image(this)"
                                            data-path="` + filePath + `">
                                            <i class="material-icons">close</i>
                                        </button>
                                        </div>`;
                            setTimeout(function () {
                                $("." + data["append-class"]).empty();
                                $("." + data["append-class"]).prepend(imgBox);
                            }, 3000);

                        }
                    }).on('httpUploadProgress', async function (progress) {
                        var uploaded = parseInt((progress.loaded * 100) / progress.total);
                        $("#" + data["progress-bar"]).css('width', uploaded + "%");
                        if (uploaded == "100") {

                        }
                    });
                } else {
                    $("#" + data["id"]).val("");
                    toastr['error']('File size needs to be less than or equal to 2mb', 'File name: ' + imageFile
                        .name);
                }
            }
        } else {
            $("#" + data["id"]).val("");
            toastr['error']('Only JPG or PNG or JPEG file types are allowed', 'Error');
        }
    }
}
