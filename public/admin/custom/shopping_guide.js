var shopping_guide = {
  base_url: null,
  api_url: null,
  web_url: null,
  init: function () {
    this.bind_events();
    this.get_shopping_guides();
  },
  
  bind_events: function () {
    var self = this;
    // if (self.edit == false) {
    //   $(".access-controll").each(function (i) {
    //     $(this).attr("disabled", "disabled");
    //   });
    // }
    // if (self.view == false) {
    //   $("#view-controll-web-master").hide();
    // }

    $("#create_shopguide_temp").on("click", function (event) {
      $('form[id="shopping_guide_form"]').validate({
        rules: {
          title: {
            required: true,
          },
          priority: {
            required: true,
          },
        },
        messages: {
          title: {
            required:
              "<span style='font-size:10px; color: red;'>Please enter title</span>",
          },
          priority: {
            required:
              "<span style='font-size:10px; color: red;'>Please enter priority</span>",
          },
        },
        errorElement: "div",
        errorPlacement: function (error, element) {
          var placement = $(element).data("error");
          if (placement) {
            $(placement).append(error);
          } else {
            let elem = element.closest(".input-field");
            elem.append(error);
          }
        },
        submitHandler: function () {
          tinyMCE.triggerSave();
          const home_banner = $(".homepage_banner").attr("data-url");
          const main_banner = $(".main_banner").attr("data-url");
          const main_banner_link = $(".main_banner").find("input[name='imge_redirect_link']").val();
          const main_banner_mob = $(".main_banner_mob").attr("data-url");
          const main_banner_link_mob = $(".main_banner_mob").find("input[name='imge_redirect_link']").val();
          let featured_banner_link = true;
          let product_banner_link = true;
          let brand_banner_link = true;
          let category_banner_link = true;

          $(".featured_banner").each(function (index, div) {
            const url =  $(this).find("input[name='imge_redirect_link']").val()
            if(url == "") { 
              featured_banner_link = false;
            };
          });
          $(".product_banner").each(function (index, div) {
            const url =  $(this).find("input[name='imge_redirect_link']").val()
            if(url == "") { 
              product_banner_link = false;
            };
          });
          $(".brand_banner").each(function (index, div) {
            const url =  $(this).find("input[name='imge_redirect_link']").val()
            if(url == "") { 
              brand_banner_link = false;
            };
          });
          $(".category_banner").each(function (index, div) {
            const url =  $(this).find("input[name='imge_redirect_link']").val()
            if(url == "") {
              category_banner_link = false
            };
          });


          if(home_banner == "" || home_banner == null || home_banner == undefined){
            toastr["error"]("Please Add Home page Banner", "Error");
          } else if (main_banner == "" || main_banner == null || main_banner == undefined) {
            toastr["error"]("Please Add Web Hero Banner", "Error");
          } else if(main_banner_link == "" || main_banner_link == null || main_banner_link == undefined ){
            toastr["error"]("Please Add Web Hero Banner URL", "Error");
          } else if (main_banner_mob == "" || main_banner_mob == null || main_banner_mob == undefined) {
            toastr["error"]("Please Add Mobile Hero Banner", "Error");
          } else if(main_banner_link_mob == "" || main_banner_link_mob == null || main_banner_link_mob == undefined ){
            toastr["error"]("Please Add Mobile Hero Banner URL", "Error");
          }
          else {
            // banner img url validation
            if(featured_banner_link == false){
              toastr["error"]("Please Add Featured Banner URL", "Error");
            }
            else if(product_banner_link == false){
              toastr["error"]("Please Add Product Banner image URL", "Error");
            }
            else if(brand_banner_link == false){
              toastr["error"]("Please Add Brand Banner image URL", "Error");
            }
            else if(category_banner_link == false){
              toastr["error"]("Please Add Featured Banner image URL", "Error") 
            }
            else {
              shopping_guide.add_shopping_guide();
            }
          }

        },
      });

    });


  },
  
  add_shopping_guide: function () {
    var self = this;
    if ($("#title").val() == " ") {
      toastr["error"]("Single space is not allowed", "error");
      return false;
    }
    let id = $("#shopping_guide_id").val();
    let obj = new Object();
    obj.template_name = $("#shopping_guide_template").val();
    obj.title = $("#title").val();
    obj.priority = $("#priority").val();
    let ur = $("#title").val();
    obj.unique_url = ur.replace(/[^A-Z0-9]/ig, "-");
    obj.homepage_banner = [{
      img_url: $(".homepage_banner").attr("data-url"),
    }];
    obj.main_banner = [{
      img_url: $(".main_banner").attr("data-url"),
      url: $(".main_banner").find("input[name='imge_redirect_link']").val()
    }, {
      img_url_mob: $(".main_banner_mob").attr("data-url"),
      url_mob: $(".main_banner_mob").find("input[name='imge_redirect_link']").val()
    }
    ];
    let featured_banners = [];
    let product_banners = [];
    let brand_banners = [];
    let category_banners = [];
    $(".featured_banner").each(function () {
      featured_banners.push({
        img_url: $(this).attr("data-url"),
        url: $(this).find("input[name='imge_redirect_link']").val()
      });
    });

    $(".product_banner").each(function () {
      product_banners.push({
        img_url: $(this).attr("data-url"),
        url: $(this).find("input[name='imge_redirect_link']").val()
      });
    });

    $(".brand_banner").each(function () {
      brand_banners.push({
        img_url: $(this).attr("data-url"),
        url: $(this).find("input[name='imge_redirect_link']").val()
      });
    });

    $(".category_banner").each(function () {
      category_banners.push({
        img_url: $(this).attr("data-url"),
        url: $(this).find("input[name='imge_redirect_link']").val()
      });
    });

    obj.featured_banners = featured_banners;
    obj.product_banners = product_banners;
    if($("#shopping_guide_template").val() == "template_one") {
      obj.brand_banners = [];
      obj.category_banners = [];
    } else {
      obj.brand_banners = brand_banners;
      obj.category_banners = category_banners;
    }
    if ($("#shoping_guide_tmp_status").val() == "active") {
      obj.is_active = true;
    } else {
      obj.is_active = false;
    }

    // console.log("shop guide temp obj", obj);

    if (id == "" || id == null || id == undefined) {
      obj._id = null;
      let $request = $.ajax({
        url: self.api_url + "/api/create_shopping_guide",
        contentType: "application/json; charset= utf-8",
        type: "POST",
        data: JSON.stringify(obj),
        dataType: "json",
      });
      $request.done(function (response) {
        $("#create_shop_guide_btn").attr("disabled", false);
        if (response.title == "success") {
          // $("#blog_icon").show();
          // $("#blog_icon").addClass("input-validation-error");
          $(".homepage_banner_container").empty("");
          $(".main_banner_container").empty("");
          $(".main_banner_mob_container").empty("");
          $(".featured_banner_container").empty("");
          $(".product_banner_container").empty("");
          $(".brand_banner_container").empty("");
          $(".category_banner_container").empty("");
          $(".template-two-option").hide();

          // $(".blog_icon_bar").css("width", "0px");
          // $("#blog_thumbnail_icon_bar").css("width", "0px");
          $("#shopping_guide_form").trigger("reset");
          // $("#related_products").empty('');
          // $("#blog_icon_bar").css("width", "0%");
          toastr["success"](response.message, "Success");
          shopping_guide.get_shopping_guides();
        } else {
          $("#create_shop_guide_btn").attr("disabled", false);
          toastr["error"](response.message, "error");
        }
      });

    } else {

      obj._id = id;
      let $request = $.ajax({
        url: self.api_url + "/api/create_shopping_guide",
        contentType: "application/json; charset= utf-8",
        type: "POST",
        data: JSON.stringify(obj),
        dataType: "json",
      });
      $request.done(function (response) {
        $("#create_shop_guide_btn").attr("disabled", false);
        if (response.title == "success") {
          // $("#blog_icon").show();
          // $("#blog_icon").addClass("input-validation-error");
          $("#shopping_guide_id").val("");
          $(".homepage_banner_container").empty("");
          $(".main_banner_container").empty("");
          $(".main_banner_mob_container").empty("");
          $(".featured_banner_container").empty("");
          $(".product_banner_container").empty("");
          $(".brand_banner_container").empty("");
          $(".category_banner_container").empty("");
          $(".template-two-option").hide();

          // $(".blog_icon_bar").css("width", "0px");
          // $("#blog_thumbnail_icon_bar").css("width", "0px");
          $("#shopping_guide_form").trigger("reset");
          // $("#related_products").empty('');
          // $("#blog_icon_bar").css("width", "0%");
          $("#create_shop_guide_btn").text("Submit");
          toastr["success"](response.message, "Success");
          shopping_guide.get_shopping_guides();
        } else {
          $("#create_shop_guide_btn").attr("disabled", false);
          toastr["error"](response.message, "error");
        }
      });
    }
  },
  
  //Edit blog
  edit_shopping_guide: function (e) {
    let self = this;
    if (self.edit == false) {
      swal("Sorry!", "You dont have edit access", "error");
      return false;
    }

    let row = $(e).closest("tr");
    let obj = $("#shopping_guide_table").dataTable().fnGetData(row);
    // console.log("shop guide edit obj", obj);

    // Home page Banners 
    if (obj.homepage_banner.length > 0) {
      const imgPath = obj.homepage_banner[0].img_url.replace('https://images.youcarelifestyle.com/', '');

      let imgBox =  `<div class="image-preview homepage_banner"  data-url="${obj.homepage_banner[0].img_url}" style="width: 150px !important; height: 120px;padding: 5px !important;" >                                   
                        <a class="product-images-link" href="${obj.homepage_banner[0].img_url}" data-lightbox="product-images" data-title="Click the right half of the image to move forward.">
                            <img class="product-images" src="${obj.homepage_banner[0].img_url}" style="width: 100%;height: 50px" ;>
                        </a>
                        <button type="button" title="Remove Image" class="remove-img-btn" onclick="shopping_guide.remove_image(this)" data-path="${imgPath}">
                            <i class="material-icons">close</i>
                        </button>
                        
                      </div >`
      $("#homepage_banner").removeClass("input-validation-error");
      $(".homepage_banner_container").empty("");
      $(".homepage_banner_container").prepend(imgBox);
    }

    // Main Banners 
    if (obj.main_banner.length > 0) {
      let imgBox = `<div class="image-preview main_banner" data-url="${obj.main_banner[0].img_url}" style="width: 150px !important; height: 120px;padding: 5px !important;">                    
                         <a class="product-images-link" href="${obj.main_banner[0].img_url}" data-lightbox="product-images" data-title="Click the right half of the image to move forward.">
                             <img class="product-images" src="${obj.main_banner[0].img_url}" style=" width: 100%;height: 50px" ;>
                         </a>
                         <input style="height: 20%;border: 1px solid gray;opacity: 1" class="m-0" 
                         name="imge_redirect_link" type="text" placeholder="Enter Url" value="${obj.main_banner[0].url}">
                         <button type="button" title="Remove Image" class="remove-img-btn" onclick="shopping_guide.remove_image(this)" data-path="vendor/products/5-2-2023/48ec5cd7-2c7d-4dfc-bb8d-6ae0f84b897a.jpg">
                             <i class="material-icons">close</i>
                         </button>
                         
                         </div>`
      $("#main_banner").removeClass("input-validation-error");
      $(".main_banner_container").empty("");
      $(".main_banner_container").prepend(imgBox);
    }

    // Main Banners Mobile
    if (obj.main_banner.length > 1) {
      let imgBox = `<div class="image-preview main_banner_mob" data-url="${obj.main_banner[1].img_url_mob}" style="width: 150px !important; height: 120px;padding: 5px !important;">                    
                         <a class="product-images-link" href="${obj.main_banner[1].img_url_mob}" data-lightbox="product-images" data-title="Click the right half of the image to move forward.">
                             <img class="product-images" src="${obj.main_banner[1].img_url_mob}" style=" width: 100%;height: 50px" ;>
                         </a>
                         <input style="height: 20%;border: 1px solid gray;opacity: 1" class="m-0" 
                         name="imge_redirect_link" type="text" placeholder="Enter Url" value="${obj.main_banner[1].url_mob}">
                         <button type="button" title="Remove Image" class="remove-img-btn" onclick="shopping_guide.remove_image(this)" data-path="vendor/products/5-2-2023/48ec5cd7-2c7d-4dfc-bb8d-6ae0f84b897a.jpg">
                             <i class="material-icons">close</i>
                         </button>
                         
                         </div>`
      $("#main_banner_mob").removeClass("input-validation-error");
      $(".main_banner_mob_container").empty("");
      $(".main_banner_mob_container").prepend(imgBox);
    }

    // featured Bannes 
    if (obj.featured_banners.length > 0) {
      let imgBox = ``;
      obj.featured_banners.map((featured) => {
        imgBox +=
          `<div class="image-preview featured_banner"  data-url="${featured.img_url}" style="width: 150px !important; height: 120px;padding: 5px !important;">
                                              
                         <a class="product-images-link" href="${featured.img_url}" data-lightbox="product-images" data-title="Click the right half of the image to move forward.">
                             <img class="product-images" src="${featured.img_url}" style=" width: 100%;height: 50px" ;>
                         </a>
                         <input style="height: 20%;border: 1px solid gray;opacity: 1" class="m-0" 
                         name="imge_redirect_link" type="text" placeholder="Enter Url" value="${featured.url}">
                         <button type="button" title="Remove Image" class="remove-img-btn" onclick="shopping_guide.remove_image(this)" data-path="vendor/products/5-2-2023/5ff32bbe-4b77-462a-b183-ce188b2c7d86.jpg">
                             <i class="material-icons">close</i>
                         </button>
                         
                         </div>`
      });

      $("#featured_banner").removeClass("input-validation-error");
      $(".featured_banner_container").empty("");
      $(".featured_banner_container").prepend(imgBox);
    }

    // Product banners
    if (obj.product_banners.length > 0) {
      let imgBox = ``;
      obj.product_banners.map((products) => {
        imgBox += `<div class="image-preview product_banner"  data-url="${products.img_url}" style="width: 150px !important; height: 120px;padding: 5px !important;">
                      <a class="product-images-link" href="${products.img_url}" data-lightbox="product-images" data-title="Click the right half of the image to move forward.">
                        <img class="product-images" src="${products.img_url}" style=" width: 100%;height: 50px" ;>
                      </a>
                      <input style="height: 20%;border: 1px solid gray;opacity: 1" class="m-0" 
                      name="imge_redirect_link" type="text" placeholder="Enter Url" value="${products.url}">
                        <button type="button" title="Remove Image" class="remove-img-btn" onclick="shopping_guide.remove_image(this)" data-path="vendor/products/5-2-2023/204d8890-c5e6-4358-8f16-0699fd8a2deb.jpg">
                          <i class="material-icons">close</i>
                        </button>

                    </div>`
      });

      $("#product_banner").removeClass("input-validation-error");
      $(".product_banner_container").empty("");
      $(".product_banner_container").prepend(imgBox);
    }

    // Brand Banners
    if (obj.brand_banners.length > 0) {
      let imgBox = ``;
      obj.brand_banners.map((brand) => {
      imgBox += `<div class="image-preview brand_banner" data-url="${brand.img_url}" style="width: 150px !important; height: 120px;padding: 5px !important
                  <a class="product-images-link" href="${brand.img_url}" data-lightbox="product-images" data-title="Click the right half of the image to move forward.">
                    <img class="product-images" src="${brand.img_url}" style=" width: 100%;height: 50px" ;="">
                  </a>
                  <input style="height: 20%;border: 1px solid gray;opacity: 1" class="m-0" 
                  name="imge_redirect_link" type="text" placeholder="Enter Url" value="${brand.url}">
                    <button type="button" title="Remove Image" class="remove-img-btn" onclick="shopping_guide.remove_image(this)" data-path="vendor/products/5-2-2023/059d2381-acd2-490b-80ce-331f74b1b190.jpg">
                      <i class="material-icons">close</i>
                    </button>
                </div>`
      });

      $("#brand_banner").removeClass("input-validation-error");
      $(".brand_banner_container").empty("");
      $(".brand_banner_container").prepend(imgBox);
    }

    // category Banners
    if (obj.category_banners.length > 0) {
      let imgBox = ``;
      obj.category_banners.map((category) => {
        const imgPath = category.img_url.replace('https://images.youcarelifestyle.com/', '');
    
        imgBox += `<div class="image-preview category_banner" data-url="${category.img_url}" style="width: 150px !important; height: 120px;padding: 5px !important;">
                  <a class="product-images-link" href="${category.img_url}" data-lightbox="product-images" data-title="Click the right half of the image to move forward.">
                    <img class="product-images" src="${category.img_url}" style=" width: 100%;height: 50px" ;="">
                  </a>
                  <input style="height: 20%;border: 1px solid gray;opacity: 1" class="m-0" 
                  name="imge_redirect_link" type="text" placeholder="Enter Url" value="${category.url}">
                    <button type="button" title="Remove Image" class="remove-img-btn" onclick="shopping_guide.remove_image(this)" data-path="${imgPath}">
                      <i class="material-icons">close</i>
                    </button>

                </div>`
      });

      $("#category_banner").removeClass("input-validation-error");
      $(".category_banner_container").empty("");
      $(".category_banner_container").prepend(imgBox);
    }

    $("#shopping_guide_id").val(obj._id);
    $("#create_shop_guide_btn").text("Update");
    if (obj.is_active == true) {
      $("#shoping_guide_tmp_status").val("active");
    } else {
      $("#shoping_guide_tmp_status").val("inactive");
    }
    $("#shopping_guide_template").val(obj.template_name);
    let selected = $('#shopping_guide_template option:selected');
    if (selected.val() == "template_one") {
      $(".template-two-option").hide();       
    } else {
      $(".template-two-option").show();
    }
    $("#title").val(obj.title);
    $("#priority").val(obj.priority);
    $("#priority").next("label").attr("class", "active");
    $("#title").focus();
    $("#title").next("label").attr("class", "active");

  },

  delete_shopping_guide: function (e) {
    let self = this;
    if (self.del == false) {
      swal("Sorry!", "You dont have delete access", "error");
      return false;
    }
    var row = $(e).closest("tr");
    var obj = $("#shopping_guide_table").dataTable().fnGetData(row);
    swal({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      dangerMode: true,
      buttons: {
        cancel: "No, cancel",
        delete: "Yes, delete It",
      },
    }).then((willDelete) => {
      if (willDelete) {
        let $request = $.ajax({
          url: self.api_url + "/api/delete_shopping_guide_template/" + obj._id,
          type: "delete",
          dataType: "json",
        });
        $request.done(function (response) {
          if (response.title == "success") {
            $("#shopping_guide_form").trigger("reset");
            $("#shopping_guide_id").val("");
            swal("Deleted!", "Shopping Guide has been deleted.", "success");
            shopping_guide.get_shopping_guides();
          } else {
            $("#shopping_guide_id").val("");
            swal("Error!", "Something Went Wrong!", "error");
          }
        });
      } else {
        $("#shopping_guide_id").val("");
        swal("Cancelled", "Your data is safe :)", "error");
      }
    });
  },

  remove_image: function (e) {
      var bucketName = "luke-images-data";
      var s3 = new AWS.S3({
        apiVersion: "2006-03-01",
      });
      var params = {
        Bucket: bucketName,
        Key: $(e).attr("data-path"),
      };
      s3.deleteObject(params, function (err, data) {
        if (data) {
          $(e).closest(".parent").children("input[type='file']").val("");
          $(e).closest(".parent").children(".progress").children("div").css({
            width: "0%",
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

  //number validation
  isNumberKey: function (evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  },

  get_shopping_guides: function () {
      let self = this;
      $("#shopping_guide_table").empty();
      $("#shopping_guide_table").DataTable({
        processing: true,
        serverSide: false,
        paging: false,
        destroy: true,
        bFilter: true,
        aaSorting: [],
        bLengthChange: false,
        ajax: {
          url: self.api_url + "/api/get_all_shopping_guide_templates",
          type: "GET",
          datatype: "json",
        },
        columns: [
          {
            data: "_id",
            visible: false,
          },
          {
            data: null,
            sTitle: "Sr.",
            //'class': 'center'
          },
          {
            data: "template_name",
            sTitle: "Template Name",
            //'class': 'center'
          },
          {
            data: "title",
            sTitle: "Title",
            //'class': 'center'
          },
          {
            data: "homepage_banner",
            sTitle: "Home Page Banner",
            //'class': 'center',
            render: function (data, type, row) {
              if (data.length > 0) {
                if (data[0]) {
                  if (data[0].img_url) {
                    return (
                      `<img src="`+data[0].img_url +`" 
                        onerror="$(this).attr('src','/admin/images/icon/noicon.jpg');" style="width:50px; height:50px;">`
                    );
                  } else {
                    return `<img src="/admin/images/icon/noicon.jpg" style="width:50px; height:50px;">`;
                  }
                } else {
                  return `<img src="/admin/images/icon/noicon.jpg" style="width:50px; height:50px;">`;
                }
              } else {
                return `<img src="/admin/images/icon/noicon.jpg" style="width:50px; height:50px;">`;
              }
            },
          },
          {
            data: "unique_url",
            sTitle: "Template URL",
            //'class': 'center'
            render: function (data, type, row) {
              if (data == null || data == "") {
                return "-";
              } else {
                return `<a href="${self.web_url}/shopping-guide/${data}" target="_blank" >${self.web_url}/shopping-guide/${data}</a>`;
              }
            },
          },
          {
            data: "is_active",
            sTitle: "Status",
            //'class': 'center',
            render: function (data, type, row) {
              if (data == true) {
                return '<span style="font-size: 12px !important;" class="badge gradient-45deg-green-teal">Active</span>';
              } else if (data == false) {
                return '<span style="font-size: 12px !important;" class="badge gradient-45deg-deep-orange-orange">Inactive</span>';
              } else {
                return "NA";
              }
            },
          },
          {
            data: "priority",
            sTitle: "Priority",
            'class': 'center',
            render: function (data, type, row) {
              if (data == null || data == "") {
                return "-";
              } else {
                return data;
              }
            },
          },
          {
            data: "null",
            width: "10%",
            sTitle: "Action",
            //'class': 'center',
            render: function (data, type, row) {
              return '<a style="margin: 0px 2px" class="mb-6 btn-floating waves-effect waves-light gradient-45deg-green-teal disable-edit" onclick="shopping_guide.edit_shopping_guide(this)" title="Edit"> <i class="material-icons">create</i> </a>'+
                      '<a style="margin: 0px 2px" class="mb-6 btn-floating waves-effect waves-light gradient-45deg-purple-deep-orange disable-delete" onclick="shopping_guide.delete_shopping_guide(this)" title="Delete"> <i class="material-icons">delete_forever</i> </a>'
                      // '<a style="margin: 0px 2px" class="mb-6 btn-floating waves-effect waves-light gradient-45deg-green-teal " onclick="shopping_guide.view_detail_description(this)" title="View Detail Description"> <i class="material-icons">remove_red_eye</i> </a>';
            },
          },
        ],
        rowCallback: function (nRow, aData, iDisplayIndex) {
          var oSettings = this.fnSettings();
          $("td:first", nRow).html(oSettings._iDisplayStart + iDisplayIndex + 1);
          return nRow;
        },
      });
  },
  
};
  
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

async function UPLOAD_IMAGES(dataArray, event) {
  var bucketRegion = "ap-south-1";
  let data = {
      'id': $(dataArray).attr("id"),
      'progress-bar': $(dataArray).attr("data-progress-bar"),
      'append-class': $(dataArray).attr("data-append-class"),
      'common-class': $(dataArray).attr("data-common-class"),
      'subfolder-name': $(dataArray).attr("data-subfolder-name"),
      'data-is-multiple': $(dataArray).attr("data-is-multiple"),
      'data-banner-width': $(dataArray).attr("data-banner-width"),
      'data-banner-height': $(dataArray).attr("data-banner-height"),
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
          var bucketName = "";
          if (Extension == "pdf") {
              bucketName = "luke-images";
          } else {
              bucketName = "luke-images-data";
          }
          var s3 = new AWS.S3({
              apiVersion: '2006-03-01',
              params: {
                  Bucket: bucketName
              }
          });
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
                  if (width == data["data-banner-width"] && height == data["data-banner-height"]) {
                      // if (imageFile.size <= 2000000) {
                          var filePath = "vendor/" + data["subfolder-name"] + "/" + date + "/" + uuidv4() + "." + Extension;
                          await s3.upload({
                              Key: filePath,
                              Body: imageFile,
                              ACL: 'public-read'
                          }, async function (err, data1) {
                              let fileUrl = null;
                              fileUrl = "https://images.youcarelifestyle.com/" + filePath;
                              if (err) {
                                  toastr.error('Something Went wrong !.', 'Error');
                              } else {

                                // Img compress API
                                let compreObj = new Object();
                                compreObj.path = filePath,
                                compreObj.width = data["data-banner-width"],
                                compreObj.height = data["data-banner-height"]
                                $.ajax({
                                  type: "post",
                                  url: "https://cu4s6u6lqd.execute-api.ap-south-1.amazonaws.com/default/convert_image_with_size",
                                  dataType: 'json',
                                  data: JSON.stringify(compreObj),
                                  success: async function (response) {
                                    $("#" + data["progress-bar"]).show();
                                    $("." + data["append-class"]).show();
                                    let imgBox = `<div class="image-preview ` + data['common-class'] + `"
                                                    data-path="` + filePath + `" data-url="` + response.output + `" style="width: 150px !important; height: 120px;padding: 5px !important;">
                                                
                                                    <a class="product-images-link" href="` + response.output + `" data-lightbox="product-images" data-title="Click the right half of the image to move forward.">
                                                        <img class="product-images" src="` + response.output + `"style=" width: 100%;height: 50px";>
                                                    </a>
                                                    <input style="height: 20%;border: 1px solid gray;opacity: 1" class="m-0"  name="imge_redirect_link"
                                                    type="text"  placeholder="Enter Url" value="">
                                                    <button type="button" title="Remove Image" class="remove-img-btn" onclick="shopping_guide.remove_image(this)"
                                                        data-path="` + filePath + `">
                                                        <i class="material-icons">close</i>
                                                    </button>
                                                    
                                                    </div>`;
                        
                                    setTimeout(function () {
                                        $("#" + data["progress-bar"]).css('width',"0%");
                                        $("." + data["append-class"]).append(imgBox);
                                    }, 3000);
                                  }
                                });

                              }
                          }).on('httpUploadProgress', async function (progress) {
                              var uploaded = parseInt((progress.loaded * 100) / progress.total);
                              $("#" + data["progress-bar"]).css('width', uploaded + "%");
                              if (uploaded == "100") {

                              }
                          });
                      // } else {
                      //     $("#" + data["id"]).val("");
                      //     toastr['error']('File size needs to be less than or equal to 2mb', 'File name: ' + imageFile
                      //         .name);
                      // }
                  }
                  else {
                      $("#" + data["id"]).val("");
                      toastr['error'](`File resolution should be ${data["data-banner-width"]}x${data["data-banner-height"]}px`, 'Error');
                  }
              }
          }
      } else {
          $("#" + data["id"]).val("");
          toastr['error']('Only JPG or PNG or JPEG file types are allowed', 'Error');
      }
  }
}

async function UPLOAD_HOMEPAGE_IMAGES(dataArray, event) {
  var bucketRegion = "ap-south-1";
  let data = {
    'id': $(dataArray).attr("id"),
    'progress-bar': $(dataArray).attr("data-progress-bar"),
    'append-class': $(dataArray).attr("data-append-class"),
    'common-class': $(dataArray).attr("data-common-class"),
    'subfolder-name': $(dataArray).attr("data-subfolder-name"),
    'data-is-multiple': $(dataArray).attr("data-is-multiple"),
    'data-banner-width': $(dataArray).attr("data-banner-width"),
    'data-banner-height': $(dataArray).attr("data-banner-height"),
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
          var bucketName = "";
          if (Extension == "pdf") {
              bucketName = "luke-images";
          } else {
              bucketName = "luke-images-data";
          }
          var s3 = new AWS.S3({
              apiVersion: '2006-03-01',
              params: {
                  Bucket: bucketName
              }
          });
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
                  if (width == data["data-banner-width"] && height == data["data-banner-height"]) {
                      // if (imageFile.size <= 2000000) {
                          var filePath = "vendor/" + data["subfolder-name"] + "/" + date + "/" + uuidv4() + "." + Extension;
                          await s3.upload({
                              Key: filePath,
                              Body: imageFile,
                              ACL: 'public-read'
                          }, async function (err, data1) {
                              let fileUrl = null;
                              fileUrl = "https://images.youcarelifestyle.com/" + filePath;
                              if (err) {
                                  toastr.error('Something Went wrong !.', 'Error');
                              } else {

                                // Img compress API
                                let compreObj = new Object();
                                compreObj.path = filePath,
                                compreObj.width = data["data-banner-width"],
                                compreObj.height = data["data-banner-height"]
                                $.ajax({
                                  type: "post",
                                  url: "https://cu4s6u6lqd.execute-api.ap-south-1.amazonaws.com/default/convert_image_with_size",
                                  dataType: 'json',
                                  data: JSON.stringify(compreObj),
                                  success: async function (response) {
                                    $("#" + data["progress-bar"]).show();
                                    $("." + data["append-class"]).show();

                                    let imgBox = `<div class="image-preview ` + data['common-class'] + `"
                                                    data-path="` + filePath + `" data-url="` + response.output + `" style="width: 150px !important; height: 120px;padding: 5px !important;">
                                                
                                                    <a class="product-images-link" href="` + response.output + `" data-lightbox="product-images" data-title="Click the right half of the image to move forward.">
                                                        <img class="product-images" src="` + response.output + `"style=" width: 100%;height: 50px";>
                                                    </a>
                                                    
                                                    <button type="button" title="Remove Image" class="remove-img-btn" onclick="shopping_guide.remove_image(this)"
                                                        data-path="` + filePath + `">
                                                        <i class="material-icons">close</i>
                                                    </button>
                                                    
                                                    </div>`;
                                          
                                    setTimeout(function () {
                                        $("#" + data["progress-bar"]).css('width',"0%");
                                        $("." + data["append-class"]).append(imgBox);
                                    }, 3000);
                                  }
                                });

                              }
                          }).on('httpUploadProgress', async function (progress) {
                              var uploaded = parseInt((progress.loaded * 100) / progress.total);
                              $("#" + data["progress-bar"]).css('width', uploaded + "%");
                              if (uploaded == "100") {

                              }
                          });
                      // } else {
                      //     $("#" + data["id"]).val("");
                      //     toastr['error']('File size needs to be less than or equal to 2mb', 'File name: ' + imageFile
                      //         .name);
                      // }
                  }
                  else {
                      $("#" + data["id"]).val("");
                      toastr['error'](`File resolution should be ${data["data-banner-width"]}x${data["data-banner-height"]}px`, 'Error');
                  }
              }
          }
      } else {
          $("#" + data["id"]).val("");
          toastr['error']('Only JPG or PNG or JPEG file types are allowed', 'Error');
      }
  }
}

async function CHECK_BANNER(DAT, event) {
  let selected = $('#shopping_guide_template option:selected');

  if (selected.val() == "template_one") {
    $(".template-two-option").hide();       
  } else {
    $(".template-two-option").show();
  }

}
