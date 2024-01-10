var featured_banner = {
    base_url: null,
    init: function () {
        this.bind_events();
        this.load_featured_banner_data();
    },

    bind_events: function () {
        var self = this;
        
        $("#create_featured_banner").on('click', function (event) {
            // console.log("banner type", $("#featured_banner_type").val())
            // event.preventDefault();
            // return;

            $('form[id="featured_banner_form"]').validate({
                rules: {
                    featured_banner_url: {
                        required: true
                    },
                    featured_title: {
                        required: true
                    },
                    featured_banner_priority : {
                        required: true
                    }
                },
                messages: {
                    featured_banner_url: {
                        required: "<span style='font-size:10px; color: red;'>Please enter url</span>",
                    },
                    featured_banner_priority: {
                        required: "<span style='font-size:10px; color: red;'>Please enter priority</span>",
                    },
                    featured_title: {
                        required: "<span style='font-size:10px; color: red;'>Please enter title</span>"
                    },
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
                    featured_banner.add_featured_banner();
                }
            });
        });
    },

    //Add featured_banner
    add_featured_banner: function () {
        $("#create_featured_banner").prop("disabled", true);
        var self = this;
        let obj             = new Object();
        obj.featured_banner_type = $("#featured_banner_type").val();
        obj.priority        = $("#featured_banner_priority").val();
        obj.url             = $("#featured_banner_url").val();
        obj.title           = $("#featured_title").val();
        if($("#featured_banner_status").val() == "active") {
            obj.status = true;
        }
        else  {
            obj.status = false;
        }
        let id = $("#featured_banner_id").val();
        if(id == "") {
            obj._id = null;
            var src = $("#web_featured_banner_image").val();
            if(src == "") {
                toastr['error']('Please select web image', 'Error');
                return false;
            }
            obj.web_banner = $(".web_featured_banner_block").attr("data-url");

            var src1 = $("#mobile_featured_banner_image").val();
            if(src1 == "") {
                toastr['error']('Please select mobile featured_banner image', 'Error');
                return false;
            }
            obj.mobile_banner = $(".mobile_featured_banner_block").attr("data-url");
        }
        else {
            obj._id = id;
            if(!($(".web_featured_banner_block").attr("data-url"))) {
                toastr['error']('Please select featured_banner image', 'Error');
                return false;
            }
            obj.web_banner = $(".web_featured_banner_block").attr("data-url");

            if(!($(".mobile_featured_banner_block").attr("data-url"))) {
                toastr['error']('Please select mobile featured_banner image', 'Error');
                return false;
            }
            obj.mobile_banner = $(".mobile_featured_banner_block").attr("data-url");
        }
        
        let $request = $.ajax({
            url: self.api_url + "/api/create_featured_banner",
            contentType: "application/json; charset= utf-8",
            type: "POST",
            data: JSON.stringify(obj),
            dataType: "json"
        });
        $request.done(function (response) {
            $("#create_featured_banner_btn").attr("disabled", false);
            if (response.title == "success") {
                $("#create_featured_banner_btn").text("Submit");
                $("#web_featured_banner_image").show();
                $("#web_featured_banner_image").addClass("input-validation-error");
                $(".web_featured_banner_container").empty("");
                $(".web_featured_banner_bar").css("width", "0px");

                $("#mobile_featured_banner_image").show();
                $("#mobile_featured_banner_image").addClass("input-validation-error");
                $(".mobile_featured_banner_container").empty("");
                $(".mobile_featured_banner_bar").css("width", "0px");

                $("#featured_banner_form").trigger("reset");
                $("#featured_banner_id").val("");
                toastr["success"](response.message, "Success");
                $("#create_featured_banner").prop("disabled", false);
                $("#web_featured_banner_bar").css("width", "0%");
                $("#mobile_featured_banner_bar").css("width", "0%");
                featured_banner.load_featured_banner_data();
            } else {
                $("#create_featured_banner_btn").attr("disabled", false);
                toastr["error"](response.message, "error");
            };
        });
    },

    remove_image: function (e) {
        $("#create_featured_banner").prop("disabled", false);
        var bucketName = "luke-images-data";
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
                $("#web_featured_banner_image").val("");
                $("#web_featured_banner_image").val("");
                $("#web_featured_banner_image").hide();
                $("#web_featured_banner_image").show();
            } else {
                console.log("Check if you have sufficient permissions : " + err);
            }
        });
    },

    remove_mobile_image: function (e) {
        $("#create_featured_banner").prop("disabled", false);
        var bucketName = "luke-images-data";
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
                $("#mobile_featured_banner_image").val("");
                $("#mobile_featured_banner_image").val("");
                $("#mobile_featured_banner_image").hide();
                $("#mobile_featured_banner_image").show();
            } else {
                console.log("Check if you have sufficient permissions : " + err);
            }
        });
    },

    load_featured_banner_data: function () {
        let self = this;
        $.ajax({
            type: "GET",
            url: self.api_url + "/api/get_all_featured_banners",
            data: "",
            dataType: "json",
            contentType: "application/json; charset= utf-8",
            success: function (response) {
                $('#featured_banner_table').empty();
                $('#featured_banner_table').DataTable({
                    "serverSide": false,
                    "paging": true,
                    "destroy": true,
                    "bFilter": true,
                    "aaSorting": [],
                    "bLengthChange": false,
                    "autoWidth": false,
                    "data": response.data,
                    "lengthMenu": [
                        [10, 25, 50, -1],
                        [10, 25, 50, "All"]
                    ],
                    "destroy": true,
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
                            'data': 'title',
                            'sTitle': "Title"
                        },
                        {
                            'data': 'featured_banner_type',
                            'sTitle': 'Featured Banner Type',
                            //'class': 'center',
                            'render': function (data, type, row) {
                                if (data == "hompage_featured_banner") {
                                    return '<p style="font-size: 12px !important;">Homepage Featured Banner</p>'
        
                                } else
                                if (data == "blog_featured_banner") {
                                    return '<p style="font-size: 12px !important;">Blog Featured Banner</p>'
                                } else
                                if (data == "offer_featured_banner") {
                                    return '<p style="font-size: 12px !important;">Offer Featured Banner</p>'
                                } else
                                {
                                    return "NA";
                                }
                            }
                        },
                        {
                            'data': 'web_banner',
                            'sTitle': 'Web Banner Image',
                            //'class': 'center',
                            'render': function (data, type, row) {
                                return `<a class="product-images-link" href="` + data + `" title="View" data-lightbox="product-images" data-title="Click the right half of the image to move forward.">
                                            <img src="` + data + `" style="width:50px; height:50px;">
                                        </a>`;
                            }
                        },
                        {
                            'data': 'mobile_banner',
                            'sTitle': 'Mobile Image',
                            //'class': 'center',
                            'render': function (data, type, row) {
                                if(data != undefined) {
                                    if(data.length > 0) {
                                        return `<a class="product-images-link" href="` + data + `" title="View" data-lightbox="product-images" data-title="Click the right half of the image to move forward.">
                                                    <img src="` + data + `" style="width:50px; height:50px;">
                                                </a>`;
                                    }
                                    else {
                                        return "-";
                                    }
                                }
                                else {
                                    return "-";
                                }
                            }
                        },
                        {
                            'data': 'priority',
                            'sTitle': 'Priority',
                            //'class': 'center'
                        },
                        {
                            'data': 'status',
                            'sTitle': 'Status',
                            //'class': 'center',
                            'render': function (data, type, row) {
                                if (data == true) {
                                    return '<span style="font-size: 12px !important;" class="badge gradient-45deg-green-teal">Active</span>'
        
                                } else
                                if (data == false) {
                                    return '<span style="font-size: 12px !important;" class="badge gradient-45deg-deep-orange-orange">Inactive</span>'
                                } else {
                                    return "NA";
                                }
                            }
                        },
                        {
                            'data': 'click_count',
                            'sTitle': 'Clicks',
                        },
                        {
                            'data': 'null',
                            'width': '10%',
                            'sTitle': 'Action',
                            //'class': 'center',
                            'render': function (data, type, row) {
                                return '<a class="mb-6 btn-floating waves-effect waves-light gradient-45deg-green-teal disable-edit" onclick="featured_banner.edit_featured_banner(this)" title="Edit"> <i class="material-icons">create</i> </a> <a class="mb-6 btn-floating waves-effect waves-light gradient-45deg-purple-deep-orange disable-delete" onclick="featured_banner.delete_featured_banner(this)" title="Delete"> <i class="material-icons">delete_forever</i> </a>'
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

    edit_featured_banner: async function (e) {
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
        let obj = $('#featured_banner_table').dataTable().fnGetData(row);

        let imgBox = `<div class="image-preview web_featured_banner_block"
                        data-path="` + obj.web_banner + `" data-url="` + obj.web_banner + `">
                        <a href="` + obj.web_banner + `" target="_blank">
                            <img src="` + obj.web_banner + `" alt="avatar" onerror="$(this).attr('src','/admin/images/icon/document.png');">
                        </a>
                        <span>Icon</span>
                        <button type="button" title="Remove Image" class="remove-img-btn" onclick="featured_banner.remove_image(this)"
                            data-path="` + obj.web_banner + `">
                            <i class="material-icons">close</i>
                        </button>
                       </div>`;
        $("#web_featured_banner_image").hide();
        $("#web_featured_banner_url").removeClass("input-validation-error");
        $(".web_featured_banner_container").empty("");
        $(".web_featured_banner_container").prepend(imgBox);

        let imgBox1 = `<div class="image-preview mobile_featured_banner_block"
                data-path="` + obj.mobile_banner + `" data-url="` + obj.mobile_banner + `">
                <a href="` + obj.mobile_banner + `" target="_blank">
                    <img src="` + obj.mobile_banner + `" alt="avatar" onerror="$(this).attr('src','/admin/images/icon/document.png');">
                </a>
                <span>Icon</span>
                <button type="button" title="Remove Image" class="remove-img-btn" onclick="featured_banner.remove_mobile_image(this)"
                    data-path="` + obj.mobile_banner + `">
                    <i class="material-icons">close</i>
                </button>
            </div>`;
        $("#mobile_featured_banner_image").hide();
        $("#mobile_featured_banner_url").removeClass("input-validation-error");
        $(".mobile_featured_banner_container").empty("");
        $(".mobile_featured_banner_container").prepend(imgBox1);

        $("#featured_banner_id").val(obj._id);
        $("#featured_banner_url").val(obj.url);
        $("#featured_banner_url").next("label").attr("class", "active");
        $("#featured_title").val(obj.title);
        $("#featured_title").next("label").attr("class", "active");
        $("#create_featured_banner_btn").text("Update");
        $("#featured_banner_priority").val(obj.priority);
        $("#featured_banner_priority").next("label").attr("class", "active");

        if(obj.status == true) {
            var st = "active";
        }
        else {
            var st = "inactive";
        }
        $('#featured_banner_type').val(obj.featured_banner_type);
        $('#featured_banner_status').val(st).focus();
        $('#featured_banner_status').formSelect();
        console.log("obj",  obj)

        if (obj.featured_banner_type == "offer_featured_banner") {
            $(".uplod_web_title").text("Upload Web Banner (1600 x 70px, Max size 70kb):");
            $("#web_featured_banner_image").attr("data-banner-width-web", "1600");
            $("#web_featured_banner_image").attr("data-banner-height-web", "70");
            
            $(".uplod_mob_title").text("Upload Web Banner (400px x 100px, Max size 40kb):");
            $("#mobile_featured_banner_image").attr("data-banner-width-mob", "400");
            $("#mobile_featured_banner_image").attr("data-banner-height-mob", "100");
             
        } else {
            $(".uplod_web_title").text("Upload Web Banner (1200 x 150px, Max size 70kb):");
            $("#web_featured_banner_image").attr("data-banner-width-web", "1200");
            $("#web_featured_banner_image").attr("data-banner-height-web", "150");
    
            $(".uplod_mob_title").text("Upload Mobile Banner (425 x 280px, Max size 40kb):")
            $("#mobile_featured_banner_image").attr("data-banner-width-mob", "425");
            $("#mobile_featured_banner_image").attr("data-banner-height-mob",  "280");
    
        }
    },

    delete_featured_banner: function (e) {
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
        var obj = $('#featured_banner_table').dataTable().fnGetData(row);
        var featured_banner_id = obj._id;
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
                    url: self.api_url + "/api/delete_featured_banner/"+featured_banner_id ,
                    type: "DELETE",
                    dataType: "json"
                });
                $request.done(function (response) { 
                    if (response.title == "success") {
                        $("#featured_banner_form").trigger("reset");
                        $("#featured_banner_id").val("");
                        $("#featured_banner_bar").css("width", "0%");
                        toastr.success('Deleted!', 'Success');
                        featured_banner.load_featured_banner_data();
                    } else {
                        $("#category_id").val("");
                        toastr.error('Something Went wrong!', 'Error');
                    };
                });
            } else {
                $("#featured_banner_id").val("");
                swal(
                    'Sorry!',
                    'Your data is safe :)',
                    'error'
                )
            }
        });
    },

};

async function UPLOAD_WEB_FEATURED_BANNER(dataArray, event) {
    $("#create_featured_banner").prop("disabled", true);
    var bucketName = "luke-images";
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
        'data-banner-width-web': $(dataArray).attr("data-banner-width-web"),
        'data-banner-height-web': $(dataArray).attr("data-banner-height-web"),
    };
    if (data["data-is-multiple"] == "false") {
        if ($("." + data["common-class"]).length > 0) {
            swal(
                'Error',
                "You can't upload multiple files",
                'error'
            )
            $("#create_featured_banner").prop("disabled", false);
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
                    let dynamicWidth = 0;
                    let dynamicHeight = 0;
                    let viewType = $("#view_type").val();
                    if (width == data["data-banner-width-web"] && height == data["data-banner-height-web"]) {
                        if (imageFile.size <= 70000) {
                            var filePath = "featured_banner/" + data["subfolder-name"] + "/" + date + "/" + uuidv4() + "." + Extension;
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
                                                          
                                                            <a class="product-images-link" href="` + fileUrl + `" data-lightbox="product-images" data-title="Click the right half of the image to move forward.">
                                                                <img class="product-images" src="` + fileUrl + `">
                                                            </a>
                                                            <button type="button" title="Remove Image" class="remove-img-btn" onclick="featured_banner.remove_image(this)"
                                                                data-path="` + filePath + `">
                                                                <i class="material-icons">close</i>
                                                            </button>
                                                            </div>`;
                                    setTimeout(function () {
                                        $("#create_featured_banner").prop("disabled", false);
                                        $("." + data["append-class"]).prepend(imgBox);
                                    }, 4000);

                                }
                            }).on('httpUploadProgress', async function (progress) {
                                var uploaded = parseInt((progress.loaded * 100) / progress.total);
                                $("#" + data["progress-bar"]).css('width', uploaded + "%");
                            });
                        } else {
                            $("#" + data["id"]).val("");
                            toastr['error']('File size needs to be less than or equal to 70kb', 'File name: ' + imageFile
                                .name);
                        }
                    } else {
                        $("#" + data["id"]).val("");
                        toastr['error'](`Icon file resolution should be ${data["data-banner-width-web"]}x${data["data-banner-height-web"]}`, 'Error');
                    }
                }
            }
        } else {
            $("#" + data["id"]).val("");
            toastr['error']('Only JPG, PNG and JPEG file types are allowed', 'Error');
        }
    }
}

//Function to upload the mobile featured_banner
async function UPLOAD_MOBILE_FEATURED_BANNER(dataArray, event) {
    $("#create_featured_banner").prop("disabled", true);
    var bucketName = "luke-images";
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
        'data-banner-width-mob': $(dataArray).attr("data-banner-width-mob"),
        'data-banner-height-mob': $(dataArray).attr("data-banner-height-mob"),
    };
    if (data["data-is-multiple"] == "false") {
        if ($("." + data["common-class"]).length > 0) {
            swal(
                'Error',
                "You can't upload multiple files",
                'error'
            )
            $("#create_featured_banner").prop("disabled", false);
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
                    if (width == data["data-banner-width-mob"] && height == data["data-banner-height-mob"]) {
                        if (imageFile.size <= 40000) {
                            var filePath = "featured_banner/" + data["subfolder-name"] + "/" + date + "/" + uuidv4() + "." + Extension;
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
                                                          
                                                            <a class="product-images-link" href="` + fileUrl + `" data-lightbox="product-images" data-title="Click the right half of the image to move forward.">
                                                                <img class="product-images" src="` + fileUrl + `">
                                                            </a>
                                                            <button type="button" title="Remove Image" class="remove-img-btn" onclick="featured_banner.remove_mobile_image(this)"
                                                                data-path="` + filePath + `">
                                                                <i class="material-icons">close</i>
                                                            </button>
                                                            </div>`;
                                    setTimeout(function () {
                                        $("#create_featured_banner").prop("disabled", false);
                                        $("." + data["append-class"]).prepend(imgBox);
                                    }, 2000);

                                }
                            }).on('httpUploadProgress', async function (progress) {
                                var uploaded = parseInt((progress.loaded * 100) / progress.total);
                                $("#" + data["progress-bar"]).css('width', uploaded + "%");
                            });
                        } else {
                            $("#" + data["id"]).val("");
                            toastr['error']('File size needs to be less than or equal to 40kb', 'File name: ' + imageFile
                                .name);
                        }
                    } else {
                        $("#" + data["id"]).val("");
                        toastr['error'](`Icon file resolution should be ${data["data-banner-width-mob"]}x ${data["data-banner-height-mob"]}px`, 'Error');
                    }
                }
            }
        } else {
            $("#" + data["id"]).val("");
            toastr['error']('Only JPG, PNG and JPEG file types are allowed', 'Error');
        }
    }
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}


async function CHECK_BANNER(DAT, event) {
    let selected = $('#featured_banner_type option:selected');
    if (selected.val() == "offer_featured_banner") {
        $("#web_featured_banner_image").show();
        $("#mobile_featured_banner_image").show();
        $("#web_featured_banner_image").val("");
        $("#mobile_featured_banner_image").val("");
        $(".web_featured_banner_container").empty("");
        $(".mobile_featured_banner_container").empty("");
        $("#web_featured_banner_bar").css("width", "0px");
        $("#mobile_featured_banner_bar").css("width", "0px");

        $(".uplod_web_title").text("Upload Web Banner (1600 x 70px, Max size 70kb):");
        $("#web_featured_banner_image").attr("data-banner-width-web", "1600");
        $("#web_featured_banner_image").attr("data-banner-height-web", "70");
        
        $(".uplod_mob_title").text("Upload Web Banner (400px x 100px, Max size 40kb):");
        $("#mobile_featured_banner_image").attr("data-banner-width-mob", "400");
        $("#mobile_featured_banner_image").attr("data-banner-height-mob", "100");
         
    } else {
        $("#web_featured_banner_image").show();
        $("#mobile_featured_banner_image").show();
        $("#web_featured_banner_image").val("");
        $("#mobile_featured_banner_image").val("");
        $(".web_featured_banner_container").empty("");
        $(".mobile_featured_banner_container").empty("");
        $("#web_featured_banner_bar").css("width", "0px");
        $("#mobile_featured_banner_bar").css("width", "0px");

        $(".uplod_web_title").text("Upload Web Banner (1200 x 150px, Max size 70kb):");
        $("#web_featured_banner_image").attr("data-banner-width-web", "1200");
        $("#web_featured_banner_image").attr("data-banner-height-web", "150");

        $(".uplod_mob_title").text("Upload Mobile Banner (425 x 280px, Max size 40kb):")
        $("#mobile_featured_banner_image").attr("data-banner-width-mob", "425");
        $("#mobile_featured_banner_image").attr("data-banner-height-mob",  "280");

    }
}
