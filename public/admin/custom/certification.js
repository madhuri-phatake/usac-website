var accredited = {
  base_url: null,
  api_url: null,
  init: function() {
    this.bind_events();
    this.get_accrediteds();

  },

  bind_events: function() {
    var self = this;

    if (self.edit == false) {
      $(".access-controll").each(function(i) {
        $(this).attr("disabled", "disabled");
      });
    }
    if (self.view == false) {
      $("#view-controll-web-master").hide();
    }
    $("#create_accredited_btn").on("click", function(event) {
      $('form[id="accredited_form"]').validate({
        rules: {
          acertificationtitle: {
            required: true
          },
          acertificationaddress: {
            required: true
          },
     

          acertificationregistration: {
            required: true
          },
          acertificationexpiry: {
            required: true
          },
          acertificationstatus: {
            required: true
          }
        },
        messages: {
          acertificationtitle: {
            required:
              "<span style='font-size:10px; color: red;'>Please Enter Certification Body Title</span>"
          },
          acertificationaddress: {
            required:
              "<span style='font-size:10px; color: red;'>Please Enter Certification Body Address</span>"
          },
        
          acertificationregistration: {
            required:
              "<span style='font-size:10px; color: red;'>Please Enter  Registration Date </span>"
          },
          acertificationexpiry: {
            required:
              "<span style='font-size:10px; color: red;'>Please enter Expiry Date </span>"
          },
          acertificationstatus: {
            required:
              "<span style='font-size:10px; color: red;'>Please Select Category</span>"
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
          const registrationDate = new Date( $("#acertificationregistration").val());
          const expiryDate = new Date($("#acertificationexpiry").val());
        
          if (registrationDate >= expiryDate) {
   
            toastr["error"]("Please Check Registration and expiry Date", "error");
            // You can add your error handling logic here, such as displaying an error message to the user.
          } else {

            accredited.add_accredited();
            // Continue with your logic if the registration date is before the expiry date.
          }
   
        }
      });
    });
  },

  add_accredited: function() {
    var self = this;
    let id = $("#accredited_id").val();
    let obj = new Object();
    obj.certificationtitle = $("#acertificationtitle").val();
    obj.certificationaddress = $("#acertificationaddress").val();

    obj.certificationregistration = $("#acertificationregistration").val();
    obj.certificationexpiry = $("#acertificationexpiry").val();
    let accreditedScop = [];

    $('.checkbox:checked').each(function() {
      let value = this.value;
      accreditedScop.push(value);

    });
  if($("#acertificationscope").val() === ''){
    if(accreditedScop.length === 0){
      toastr["error"]("Please Select Accreditation Scope", "error");
      return
    }
  }
    if( $("#acertificationscope").val() != ''){
      accreditedScop.push( $("#acertificationscope").val());
    }
    obj.certificationscope = accreditedScop;
    obj.id = $("#accredited_id").val();
    obj.is_active = $("#acertificationstatus").val();
    if (id == "" || id == null) {
      obj._id = null;
      let $request = $.ajax({
        url: self.base_url + "/certificate/create_certificate",
        contentType: "application/json; charset= utf-8",
        type: "POST",
        data: JSON.stringify(obj),
        dataType: "json"
      });
      $request.done(function(response) {
        if (response.title == "success") {
          $("#create_accredited_btn").attr("disabled", false);
          $("#accredited_form")[0].reset();
          toastr["success"](response.message, "Success");
          accredited.get_accrediteds();
        } else {
          $("#create_accredited_btn").attr("disabled", false);
          toastr["error"](response.message, "error");
        }
      });
      
    } else {
      obj._id = id;
      let $request = $.ajax({
        url: self.base_url + "/certificate/create_certificate",
        contentType: "application/json; charset= utf-8",
        type: "POST",
        data: JSON.stringify(obj),
        dataType: "json"
      });
      $request.done(function(response) {
        $("#create_accredited_btn").attr("disabled", false);
        if (response.title == "success") {
          $("#create_accredited_btn").attr("disabled", false);
          $("#accredited_form")[0].reset();
          $("#create_accredited_btn").text("Submit")
          toastr["success"](response.message, "Success");
          accredited.get_accrediteds();
        } else {
          $("#create_accredited_btn").attr("disabled", false);
          toastr["error"](response.message, "error");
        }
      });
    }
  },

  remove_image: function(e) {
    var bucketName = "adbanao";
    var s3 = new AWS.S3({
      apiVersion: "2006-03-01"
    });
    var params = {
      Bucket: bucketName,
      Key: $(e).attr("data-path")
    };
    s3.deleteObject(params, function(err, data) {
      if (data) {
        $(e).closest(".parent").children("input[type='file']").val("");
        $(e).closest(".parent").children(".progress").children("div").css({
          width: "0%"
        });
        $(e).closest(".image-preview").remove();
        // $("#blog_icon").val("");
        $("#blog_icon").hide();
        $("#blog_icon").show();
      } else {
        console.log("Check if you have sufficient permissions : " + err);
      }
    });
  },

  get_accrediteds: function() {
    let self = this;
    const now = moment();
    $("#accredited_table").empty();
    $("#accredited_table").DataTable({
      processing: true,
      serverSide: false,
      paging: false,
      destroy: true,
      bFilter: true,
      aaSorting: [],
      bLengthChange: false,
      ajax: {
        url: self.base_url + "/certificate/get_all_certificate",
        type: "GET",
        datatype: "json"
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
          data: "certificationtitle",
          sTitle: "Title"
          //'class': 'center'
        },
        {
          data: "certificationaddress",
          sTitle: "Address"
          //'class': 'center'
        },
        {
          data: "certificationscope",
          sTitle: "Scope",
          render: function(data, type, row){
            if(data.length > 0){
              return data.join(', ');
            }
          }
        },
        {
          data: "certificationregistration",
          sTitle: "Registration Date",
          render: function(data, type, row){
            if(data.length > 0){
              return moment(data).format('DD-MM-YY');
            }
          }
        },
        {
          data: "certificationexpiry",
          sTitle: "Expiry Date",
          render: function(data, type, row){
            if(data.length > 0){
              return moment(data).format('DD-MM-YY');
            }
          }
          
        },

        {
          data: "is_active",
          sTitle: "Status",
          //'class': 'center',
          render: function(data, type, row) {

            if (data == "Active") {
              return '<span style="font-size: 12px !important;" class="badge gradient-45deg-green-teal">Active</span>';
            } else if (data == 'Cancelled') {
              return '<span style="font-size: 12px !important;" class="badge gradient-45deg-deep-red">Cancelled</span>';
            }  else if (data == 'Suspended') {
              return '<span style="font-size: 12px !important;" class="badge gradient-45deg-deep-blue">Suspended</span>';
            }  else if (data == 'Withdrawn') {
              return '<span style="font-size: 12px !important;" class="badge gradient-45deg-deep-yellow">Withdrawn</span>';
            }else {
              return "NA";
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
              '<a style="margin: 0px 2px" class="mb-6 btn-floating waves-effect waves-light gradient-45deg-green-teal disable-edit" onclick="accredited.edit_certificate(this)" title="Edit"> <i class="material-icons">create</i> </a>' +
              '<a style="margin: 0px 2px" class="mb-6 btn-floating waves-effect waves-light gradient-45deg-purple-deep-orange disable-delete" onclick="accredited.delete_blog(this)" title="Delete"> <i class="material-icons">delete_forever</i> </a>'
            );
          }
        }
      ],
      rowCallback: function(nRow, aData, iDisplayIndex) {
        var oSettings = this.fnSettings();
        $("td:first", nRow).html(oSettings._iDisplayStart + iDisplayIndex + 1);
        return nRow;
      }
    });
  },

  //Edit blog
  edit_certificate: function(e) {
    let self = this;
    if (self.edit == false) {
      swal("Sorry!", "You dont have edit access", "error");
      return false;
    }
    let row = $(e).closest("tr");
    let obj = $("#accredited_table").dataTable().fnGetData(row);
    $("#accredited_id").val(obj._id);
    $("#acertificationtitle").val(obj.certificationtitle);
    $("#acertificationtitle").next("label").attr("class", "active");
    $("#acertificationaddress").val(obj.certificationaddress);
    $("#acertificationaddress").next("label").attr("class", "active");
    let scopArr = obj.certificationscope
    scopArr.forEach(function(obj){

      if(obj == "Management System Certification"){
        $("#msc").prop("checked", true);
      }
      if(obj == "Personnal Certification"){
        $("#pc").prop("checked", true);
      }
      if(obj == "Laboratory Accreditation"){
        $("#la").prop("checked", true);
      }
      if(obj == "Hospital Accreditation"){
        $("#hoa").prop("checked", true);
      }
      if(obj == "Educational Insititute Accreditation"){
        $("#eia").prop("checked", true);
      }
      if(obj == "Hotal Accreditation"){
        $("#ha").prop("checked", true);
      }
      if(obj == "Green Certification"){
        $("#gc").prop("checked", true);
      }  

       $("#acertificationscope").val(obj);
      $("#acertificationscope").next("label").attr("class", "active");
    })
  

    var start_date1 = new Date(obj.certificationregistration);
    var start_day = start_date1.getDate(); //Date of the month: 2 in our example
    var start_month = start_date1.toLocaleString("default", { month: "short" }); //Month of the Year: 0-based index, so 1 in our example
    var start_year = start_date1.getFullYear();
    var start_date = start_month + " " + start_day + ", " + start_year;
    $("#acertificationregistration").val(start_date);
    $("#acertificationregistration").next("label").attr("class", "active");
    var start_date2 = new Date(obj.certificationexpiry);
    var start_day2 = start_date2.getDate(); //Date of the month: 2 in our example
    var start_month2 = start_date2.toLocaleString("default", { month: "short" }); //Month of the Year: 0-based index, so 1 in our example
    var start_year2 = start_date2.getFullYear();
    var start_date2 = start_month2 + " " + start_day2 + ", " + start_year2;

    $("#acertificationexpiry").val(start_date2);
    $("#acertificationexpiry").next("label").attr("class", "active");

    if (obj.is_active == 'Active') {
      $("#acertificationstatus").val("Active");
    }
    if (obj.is_active == 'Cancelled') {
      $("#acertificationstatus").val("Cancelled");
    }
    if (obj.is_active == 'Suspended') {
      $("#acertificationstatus").val("Suspended");
    }
    if (obj.is_active == 'Withdrawn') {
      $("#acertificationstatus").val("Withdrawn");
    }
    $("#create_accredited_btn").text("Update")
  },

  delete_blog: function(e) {
    let self = this;
    if (self.del == false) {
      swal("Sorry!", "You dont have delete access", "error");
      return false;
    }
    var row = $(e).closest("tr");
    var obj = $("#accredited_table").dataTable().fnGetData(row);
  
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
        let $request = $.ajax({
          url: self.base_url + "/certificate/delete_certificate/" + obj._id,
          type: "delete",
          dataType: "json"
        });
        $request.done(function(response) {
          if (response.title == "success") {
            $("#accredited_table").trigger("reset");
            $("#accredited_id").val("");
            swal("Deleted!", "Certificate has been deleted.", "success");
            accredited.get_accrediteds();
          } else {
            $("#accredited_id").val("");
            swal("Error!", "Something Went Wrong!", "error");
          }
        });
      } else {
        $("#accredited_id").val("");
        swal("Cancelled", "Your data is safe :)", "error");
      }
    });
  },
  //number validation
  isNumberKey: function(evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }
};

async function UPLOAD_ICON(dataArray, event) {
  var bucketName = "adbanao";
  var s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    params: {
      Bucket: bucketName
    }
  });
  let data = {
    id: $(dataArray).attr("id"),
    "progress-bar": $(dataArray).attr("data-progress-bar"),
    "append-class": $(dataArray).attr("data-append-class"),
    "common-class": $(dataArray).attr("data-common-class"),
    "subfolder-name": $(dataArray).attr("data-subfolder-name"),
    "data-is-multiple": $(dataArray).attr("data-is-multiple")
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
    if (
      Extension == "png" ||
      Extension == "jpg" ||
      Extension == "jpeg" ||
      Extension == "svg" ||
      Extension == "ico"
    ) {
      $("#" + data["progress-bar"]).css("width", "0%");
      var today = new Date();
      var date =
        today.getDate() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getFullYear();
      for (var i = 0; i < event.target.files.length; i++) {
        var imageFile = event.target.files[i];
        let img = new Image();
        img.src = window.URL.createObjectURL(imageFile);
        img.onload = async () => {
          let width = img.width;
          let height = img.height;
          if (width == 1280 && height == 720) {
            if (imageFile.size <= 1000000) {
              var filePath =
                "vendor/" +
                data["subfolder-name"] +
                "/" +
                date +
                "/" +
                uuidv4() +
                "." +
                Extension;
              await s3
                .upload(
                  {
                    Key: filePath,
                    Body: imageFile,
                    ACL: "public-read"
                  },
                  async function(err, data1) {
                    if (err) {
                      toastr.error("Something Went wrong !.", "Error");
                    } else {
                      let fileUrl = null;
                      fileUrl =
                        "https://images.youcarelifestyle.com/" + filePath;
                      $("#" + data["progress-bar"]).show();
                      $("." + data["append-class"]).show();
                      let imgBox =
                        `<div class="image-preview ` +
                        data["common-class"] +
                        `"
                                      data-path="` +
                        data1.Location +
                        `" data-url="` +
                        data1.Location +
                        `">
                                    <a href="` +
                        data1.Location +
                        `" target="_blank">
                                      <img src="` +
                        data1.Location +
                        `" alt="avatar" onerror="$(this).attr('src','/admin/images/icon/document.png');">
                                    </a>
                                    <span>` +
                        imageFile.name +
                        `</span>
                                    <button type="button" title="Remove Image" class="remove-img-btn" onclick="blog.remove_image(this)"
                                                                data-path="` +
                        data1.Location +
                        `">
                                      <i class="material-icons">close</i>
                                    </button>
                                  </div>`;
                      setTimeout(function() {
                        $("." + data["append-class"]).prepend(imgBox);
                      }, 2000);
                    }
                  }
                )
                .on("httpUploadProgress", async function(progress) {
                  var uploaded = parseInt(
                    progress.loaded * 100 / progress.total
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
          } else {
            $("#" + data["id"]).val("");
            toastr["error"]("Icon resolution should be 1200x400px", "Error");
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

async function UPLOAD_THUMBNAIL_ICON(dataArray, event) {
  var bucketName = "adbanao";
  var s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    params: {
      Bucket: bucketName
    }
  });
  let data = {
    id: $(dataArray).attr("id"),
    "progress-bar": $(dataArray).attr("data-progress-bar"),
    "append-class": $(dataArray).attr("data-append-class"),
    "common-class": $(dataArray).attr("data-common-class"),
    "subfolder-name": $(dataArray).attr("data-subfolder-name"),
    "data-is-multiple": $(dataArray).attr("data-is-multiple")
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
    if (
      Extension == "png" ||
      Extension == "jpg" ||
      Extension == "jpeg" ||
      Extension == "svg" ||
      Extension == "ico"
    ) {
      $("#" + data["progress-bar"]).css("width", "0%");
      var today = new Date();
      var date =
        today.getDate() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getFullYear();
      for (var i = 0; i < event.target.files.length; i++) {
        var imageFile = event.target.files[i];
        let img = new Image();
        img.src = window.URL.createObjectURL(imageFile);
        img.onload = async () => {
          let width = img.width;
          let height = img.height;
          if (width == 400 && height == 400) {
            if (imageFile.size <= 10000000) {
              var filePath =
                "vendor/" +
                data["subfolder-name"] +
                "/" +
                date +
                "/" +
                uuidv4() +
                "." +
                Extension;
              await s3
                .upload(
                  {
                    Key: filePath,
                    Body: imageFile,
                    ACL: "public-read"
                  },
                  async function(err, data1) {
                    if (err) {
                      toastr.error("Something Went wrong !.", "Error");
                    } else {
                      let fileUrl = null;
                      fileUrl =
                        "https://images.youcarelifestyle.com/" + filePath;
                      $("#" + data["progress-bar"]).show();
                      $("." + data["append-class"]).show();
                      let imgBox =
                        `<div class="image-preview ` +
                        data["common-class"] +
                        `"
                                      data-path="` +
                        data1.Location +
                        `" data-url="` +
                        data1.Location +
                        `">
                                    <a href="` +
                        data1.Location +
                        `" target="_blank">
                                      <img src="` +
                        data1.Location +
                        `" alt="avatar" onerror="$(this).attr('src','/admin/images/icon/document.png');">
                                    </a>
                                    <span>` +
                        imageFile.name +
                        `</span>
                                    <button type="button" title="Remove Image" class="remove-img-btn" onclick="blog.remove_image(this)"
                                                                data-path="` +
                        data1.Location +
                        `">
                                      <i class="material-icons">close</i>
                                    </button>
                                  </div>`;
                      setTimeout(function() {
                        $("." + data["append-class"]).prepend(imgBox);
                      }, 2000);
                    }
                  }
                )
                .on("httpUploadProgress", async function(progress) {
                  var uploaded = parseInt(
                    progress.loaded * 100 / progress.total
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
          } else {
            $("#" + data["id"]).val("");
            toastr["error"]("Icon resolution should be 400x400px", "Error");
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
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] &
        (15 >> (c / 4)))).toString(16)
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
