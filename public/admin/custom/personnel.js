var personnel = {
  personnel_url: null,
  init: function() {
    this.bind_events();
    this.load_data();
    // this.get_blogs()
  },

  bind_events: function() {
    var self = this;

 
    $("#create_personnel_btn").on("click", function(event) {
      $('form[id="personnel_form"]').validate({
        rules: {
          name: {
            required: true
          },
          course_name: {
            required: true
          },
          personnel_r_date: {
            required: true
          },
          country: {
            required: true
          },
          certificate_no: {
            required: true
          }
        },
        messages: {
          name: {
            required:
              "<span style='font-size:10px; color: red;'>Please Enter Name</span>"
          },
          course_name: {
            required:
              "<span style='font-size:10px; color: red;'>Please Enter Course Name</span>"
          },
          personnel_r_date: {
            required:
              "<span style='font-size:10px; color: red;'>Please Enter Registration Date</span>"
          },
          country: {
            required:
              "<span style='font-size:10px; color: red;'>Please Enter Country</span>"
          },
          certificate_no: {
            required:
              "<span style='font-size:10px; color: red;'>Please Enter Certificate Number</span>"
          }
        },
        errorElement: "div",
        errorPlacement: function(error, element) {
          var placement = $(element).data("error");
          if (placement) {
            $(placement).append(error);
          } else {
            let elem = element.closest(".input-field");
            elem.append(error);
          }
        },
        submitHandler: function() {
          personnel.add_personnel_category();
        }
      });
    });
  },

  //Add
  add_personnel_category: function() {
    $("#create_personnel_btn").prop("disabled", true);
    var self = this;
    let obj = new Object();
    obj.personnel_name = $("#personnel_name").val();
    obj.personnel_course = $("#course_name").val();
    obj.personnel_country = $("#personnel_country").val();
    obj.personnel_certificate_no = $("#certificate_no").val();
    obj.personnel_registration = $("#personnel_r_date").val();
    obj.personnel_photo = $(".photo_icon").attr("data-path");
    if(obj.personnel_photo === undefined){
      toastr["error"]("Please Add Photo", "error");
      $("#create_personnel_btn").prop("disabled", false);
      return
    }
    if($("#personnel_id").val() === ''){
        obj._id = null
    }else{
        obj._id = $("#personnel_id").val();
    }
 
    let $request = $.ajax({
      url: self.base_url + "/certificate/personnel_certificate",
      contentType: "application/json; charset= utf-8",
      type: "POST",
      data: JSON.stringify(obj),
      dataType: "json"
    });
    $request.done(function(response) {
      $("#create_personnel_btn").attr("disabled", false);
      if (response.title == "success") {
        $("#create_accredited_btn").attr("disabled", false);
        $("#personnel_form")[0].reset();
        $("#photo_icon").val("");

        $(".photo_icon_container").empty();
        $("#photo_icon_bar").css("width","0%")
        toastr["success"](response.message, "Success");
        personnel.load_data();
      } else {
        $("#create_personnel_btn").attr("disabled", false);
        toastr["error"](response.message, "error");
      }
    });
  },

  remove_image: function(e) {
    $("#create_personnel_btn").prop("disabled", false);
    $("#photo_icon").val("");

    $(".photo_icon_container").empty();
    $("#photo_icon_bar").css("width","0%")
   
  },

  load_data: function() {
    let self = this;
    $.ajax({
      type: "GET",
      url:self.base_url + "/certificate/personnel_get_certificate",
      data: "",
      dataType: "json",
      contentType: "application/json; charset= utf-8",
      success: function(response) {
        $("#personnel_table").empty();
        $("#personnel_table").DataTable({
          serverSide: false,
          paging: true,
          destroy: true,
          bFilter: true,
          aaSorting: [],
          bLengthChange: false,
          autoWidth: false,
          data: response.data,
          lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
          destroy: true,
          columnDefs: [
            {
              orderable: false,
              targets: 0
            }
          ],
          rowCallback: function(nRow, aData, iDisplayIndex) {
            var oSettings = this.fnSettings();
            $("td:first", nRow).html(
              oSettings._iDisplayStart + iDisplayIndex + 1
            );
            return nRow;
          },
          columns: [
            {
              data: "_id",
              visible: false
            },
            {
              data: null,
              sTitle: "Sr."
              //'class': 'center'
            },
            {
              data: "personnel_name",
              sTitle: "Personnel Name"
            },
            {
                data: "personnel_course",
                sTitle: "Personnel Course"
              },
              {
                data: "personnel_registration",
                sTitle: "Registration Date",
                render: function(data, type, row){
                  if(data.length > 0){
                    return moment(data).format('DD-MM-YY');
                  }
                }
              },
              {
                data: "personnel_country",
                sTitle: "Personnel Country"
              },
              {
                data: "personnel_certificate_no",
                sTitle: "Personnel Certificate No"
              },
              {
                data: "personnel_photo",
                sTitle: "Photo",
                render: function(data, type, row){
                  if(data.length > 0){
                    return `<a href="${data}" data-lightbox="${data}" ><img src="${data}" class="img-certificate"  width="60" height="60"></a>`
                  }
                }
              },

            {
              data: "null",
              width: "10%",
              sTitle: "Action",
              //'class': 'center',
              render: function(data, type, row) {
                return (
                    '<a style="margin: 0px 2px" class="mb-6 btn-floating waves-effect waves-light gradient-45deg-green-teal disable-edit" onclick="personnel.edit_personnel(this)" title="Edit"> <i class="material-icons">create</i> </a>' +
                    '<a style="margin: 0px 2px" class="mb-6 btn-floating waves-effect waves-light gradient-45deg-purple-deep-orange disable-delete" onclick="personnel.delete_personnel(this)" title="Delete"> <i class="material-icons">delete_forever</i> </a>'
                  );
              }
            }
          ]
        });
      }
    });
  
  },
  // getImg: function(e){
  //   console.log($(e).attr('src'));
  // },
  //number validation
  isNumberKey: function(evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  },

  edit_personnel: async function(e) {
    let self = this;
    if (self.edit == false) {
      swal("Sorry!", "You dont have edit access", "error");
      return false;
    }
    let row = $(e).closest("tr");
    let obj = $("#personnel_table").dataTable().fnGetData(row);

    let imgBox =
      `<div class="image-preview photo_icon"
                        data-path="` +
      obj.personnel_photo +
      `" data-url="` +
      obj.personnel_photo +
      `">
                        <a href="` +
      obj.personnel_photo +
      `" target="_blank">
                            <img src="` +
      obj.personnel_photo +
      `" alt="avatar" onerror="$(this).attr('src','/admin/images/icon/document.png');">
                        </a>
                        <span>Icon</span>
                        <button type="button" title="Remove Image" class="remove-img-btn" onclick="personnel.remove_image(this)"
                            data-path="` +
      obj.personnel_photo +
      `">
                            <i class="material-icons">close</i>
                        </button>
                       </div>`;
    $("#photo_category_image").hide();
    $("#photo_category_url").removeClass("input-validation-error");
    $(".photo_icon_container").empty("");
    $(".photo_icon_container").prepend(imgBox);

    $("#personnel_id").val(obj._id);
    $("#personnel_name").val(obj.personnel_name);
    $("#personnel_name").next("label").attr("class", "active");
    $("#course_name").val(obj.personnel_course);
    $("#course_name").next("label").attr("class", "active");
    $("#personnel_country").val(obj.personnel_country);
    $("#personnel_country").next("label").attr("class", "active");
    var reg_date = new Date(obj.personnel_registration);
    var start_day = reg_date.getDate(); //Date of the month: 2 in our example
    var start_month = reg_date.toLocaleString("default", { month: "short" }); //Month of the Year: 0-based index, so 1 in our example
    var start_year = reg_date.getFullYear();
    var start_date = start_month + " " + start_day + ", " + start_year;
    $("#personnel_r_date").val(start_date);
    $("#personnel_r_date").next("label").attr("class", "active");
    $("#certificate_no").val(obj.personnel_certificate_no);
    $("#certificate_no").next("label").attr("class", "active");

    $("#create_personnel_btn").text("Update");


  },

  delete_personnel: function(e) {
    let self = this;
    if (self.del == false) {
      swal("Sorry!", "You dont have delete access", "error");
      return false;
    }
    var row = $(e).closest("tr");
    var obj = $("#personnel_table").dataTable().fnGetData(row);
    var _id = obj._id;
    swal({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      dangerMode: true,
      buttons: {
        cancel: "No, cancel",
        delete: "Yes, delete It"
      }
    }).then(willDelete => {
      if (willDelete) {
        var $request = $.ajax({
          url: self.base_url + "/certificate/delete_personnel_certificate/" + _id,
          type: "DELETE",
          dataType: "json"
        });
        $request.done(function(response) {
          if (response.title == "success") {
            $("#create_accredited_btn").attr("disabled", false);
            $("#personnel_form")[0].reset();
            toastr["success"](response.message, "Success");
            personnel.load_data();
          } else {
            $("#category_id").val("");
            toastr.error("Something Went wrong!", "Error");
          }
        });
      } else {
        $("#blog_category_id").val("");
        swal("Sorry!", "Your data is safe :)", "error");
      }
    });
  },

};
async function UPLOAD_photo(dataArray, event) {
  $(".photo_icon_container").empty()
    var bucketName = "usac-website";
    var s3 = new AWS.S3({
      apiVersion: "2006-03-01",
      params: {
        Bucket: bucketName,
      },
    });
    let data = {
      id: $(dataArray).attr("id"),
      "progress-bar": $(dataArray).attr("data-progress-bar"),
      "append-class": $(dataArray).attr("data-append-class"),
      "common-class": $(dataArray).attr("data-common-class"),
      "subfolder-name": $(dataArray).attr("data-subfolder-name"),
      "data-is-multiple": $(dataArray).attr("data-is-multiple"),
    };
    if (data["data-is-multiple"] == "false") {
      if ($("." + data["common-class"]).length > 0) {
        swal("Error", "You can't upload multiple files", "error");
        return false;
      }
    }
    var fuData = document.getElementById(data["id"]);
    var FileUploadPath = fuData.value;
    if (FileUploadPath == "") {
    } else {
      var Extension = FileUploadPath.substring(
        FileUploadPath.lastIndexOf(".") + 1
      ).toLowerCase();
      if (Extension == "png" || Extension == "jpg" || Extension == "jpeg" || Extension == "svg" || Extension == "ico") {
        $("#" + data["progress-bar"]).css("width", "0%");
        var today = new Date();
        var date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
        for (var i = 0; i < event.target.files.length; i++) {
          var imageFile = event.target.files[i];
          let img = new Image();
          img.src = window.URL.createObjectURL(imageFile);
          img.onload = async () => {
            let width = img.width;
            let height = img.height;
      
              if (imageFile.size <= 1000000) {
                var filePath = "vendor/" + data["subfolder-name"] + "/" + date + "/" + uuidv4() + "." + Extension;
                await s3.upload(
                  {
                    Key: filePath,
                    Body: imageFile,
                    ACL: "public-read",
                  },
                  async function (err, data1) {
                    if (err) {
                      toastr.error("Something Went wrong !.", "Error");
                    } else {
                      let fileUrl = null;
                      fileUrl =  filePath;
                      $("#" + data["progress-bar"]).show();
                      $("." + data["append-class"]).show();
                      let imgBox =
                        `<div class="image-preview ` + data["common-class"] + `"
                                        data-path="` + data1.Location + `" data-url="` + data1.Location + `">
                                      <a href="` + data1.Location + `" target="_blank">
                                        <img id="upload-photo" src="` + data1.Location + `" alt="avatar" onerror="$(this).attr('src','/admin/images/icon/document.png');">
                                      </a>
                                      <span>` + imageFile.name + `</span>
                                      <button type="button" title="Remove Image" class="remove-img-btn" onclick="personnel.remove_image(this)"
                                                                  data-path="` + data1.Location + `">
                                        <i class="material-icons">close</i>
                                      </button>
                                    </div>`;
                      setTimeout(function () {
                        $("." + data["append-class"]).prepend(imgBox);
                      }, 2000);
                    }
                  }
                )
                  .on("httpUploadProgress", async function (progress) {
                    var uploaded = parseInt(
                      (progress.loaded * 100) / progress.total
                    );
                    $("#" + data["progress-bar"]).css("width", uploaded + "%");
                  });
              } else {
                $("#" + data["id"]).val("");
                toastr["error"](
                  "File size needs to be less than or equal to 500kb",
                  "File name: " + imageFile.name
                );
              }
          
          };
        }
      } else {
        $("#" + data["id"]).val("");
        toastr["error"](
          "Only JPG or PNG or JPEG file types are allowed",
          "Error"
        );
      }
    }
  }
function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
  
  function alpha(e) {
    var k;
    document.all ? (k = e.keyCode) : (k = e.which);
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    );
  }
