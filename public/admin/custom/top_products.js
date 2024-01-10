var top_products = {
  base_url: null,
  api_url: null,
  web_url: null,
  init: function () {
    this.bind_events();
    // this.load_category();
    // this.get_all_top_products();
  },
  
  bind_events: function () {

    $("#create_top_product").on("click", function (event) {
      $('form[id="top_product_form"]').validate({
        rules: {
          category_id:{
              required:true
          },
          selected_product_id:{
              required:true
          },
          top_productpriority: {
            required: true,
          }
          
        },
        messages: {
          priority: {
            required:
              "<span style='font-size:10px; color: red;'>Please enter priority</span>",
          },
          category_id: {
            required:
              "<span style='font-size:10px; color: red;'>Please Select Category</span>",
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
          top_products.add_top_product();

        },
      });
    });

  },

  add_top_product: function () {
    var self = this;
    let id = $("#top_product_id").val();
    let obj = new Object();
    obj.category_id = $("#category_id").val();
    obj.sub_category_id = $("#sub_category_id").val();
    obj.top_product_id = $("#related_products").val();
    obj.priority = $("#top_productpriority").val();
    if ($("#topProduct_status").val() == "active") {
      obj.is_active = true;
    } else {
      obj.is_active = false;
    }

    if (id == "" || id == null) {
      obj._id = null;
      let $request = $.ajax({
        url: self.api_url + "/api/create_top_product",
        contentType: "application/json; charset= utf-8",
        type: "POST",
        data: JSON.stringify(obj),
        dataType: "json",
      });
      $request.done(function (response) {
        $("#create_top_product_btn").attr("disabled", false);
        if (response.title == "success") {
          
          
          
          $("#top_product_form").trigger("reset");
          $("#related_products").empty('');
          $("#sub_category_id").empty();
          $("#sub_category_id").append(`<option value="">Select Sub-Category </option>`);
        
          toastr["success"](response.message, "Success");
          top_products.get_all_top_products();
        } else {
          $("#create_top_product_btn").attr("disabled", false);
          toastr["error"](response.message, "error");
        }
      });
    } else {
      obj._id = id;

    
      let $request = $.ajax({
        url: self.api_url + "/api/create_top_product",
        contentType: "application/json; charset= utf-8",
        type: "POST",
        data: JSON.stringify(obj),
        dataType: "json",
      });
      $request.done(function (response) {
        $("#create_top_product_btn").attr("disabled", false);
        if (response.title == "success") {
          
          $("#top_product_id").val("");
          $("#create_top_product_btn").text("Add");
          $("#top_product_form").trigger("reset");
          $("#sub_category_id").empty();
          $("#sub_category_id").append(`<option value="">Select Sub-Category </option>`)
          $("#related_products").empty('');
          toastr["success"](response.message, "Success");
          top_products.get_all_top_products();
        } else {
          $("#create_top_product_btn").attr("disabled", false);
          toastr["error"](response.message, "error");
        }
      });
    }
  },

  //number validation
  isNumberKey: function (evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  },

  // -----load category ---------//
  load_category: function (e) {
    let self = this;
    let $request = $.ajax({
    url: self.base_url + "/web_master/get_all_categories",
    type: "POST",
    contentType: "application/json; charset= utf-8",
    });
    $request.done(function (response) {
    
    response.map((data) => {
        // $("#category_id").append($("<option>").val(data._id).text(data.category_name));
        $("#category_id").append(`<option value="${data._id}" data-url="${data.url}">${data.category_name}</option>`);
    });
    });
  },

  // Load sub_Category
  load_subCategory: function (e) {
    let self = this;
    var id =  $("#category_id").val();
    let $request = $.ajax({
      url: self.base_url + "/web_master/get_all_sub_categories_for_categories",
      data: { main_category_id: id },
      type: "get",
      dataType: "json",
    });
    $request.done(function (response) {

      if(response.length > 0){
        $("#sub_category_id").empty();
        response.map((data) => {
          $("#sub_category_id").append(`<option value="${data._id}" data-url="${data.url}">${data.sub_category_name}</option>`);
        
        });
        top_products.render_products_by_subcategory();
        
      }else {
        $("#sub_category_id").empty();

        // If category has No sub_category load products
        top_products.render_products_by_category();
      }
      
    });
  },


  // Load product by selected Category
  render_products_by_category: function(ids) {
    let selected_ids = ids;
    let self = this;
    var cat_id =  $("#category_id").find(':selected').attr('data-url');

    var obj                     = new Object();
    obj.highlight               = "";
    obj.price_from              = 0;
    obj.price_to                = 0
    obj.sort_by                 = ""
    obj.category_ids            = [cat_id];
    obj.subcat_ids              = [];
    obj.subcat2_ids             = []
    obj.brand_name              = []
    obj.limit                   = 100
    obj.skip                    = 0;
    obj.pincode                 = "";
    obj.user_id                 = header.user_id;
    
    let $request = $.ajax({
        url: self.api_url +"/api/get_products_list",
        type: "post",
        data: JSON.stringify(obj),
        dataType: "json",
        contentType: "application/json; charset= utf-8",
    });
    $request.done(function (response) {

      let varients = ``;
      $("#related_products").empty('');
      response.data.forEach((obj1, i) => {
          let selected = '';
          // if(obj.varients.includes(obj1._id)) {
          //     selected = "selected";
          // }
          if(selected_ids){
            if(selected_ids.includes(obj1._id)) {
              selected = "selected";
            }; 
          }
          varients += `<option ${selected} value="` + obj1._id + `">` + obj1.product_name + `</option>`;
      });

      $("#related_products").append(varients);
      $("#related_products").formSelect();
      $("#related_products").focus(); 

    })
  },

  // Load products by selected sub category
  render_products_by_subcategory: function() {
    let self = this;
    var sub_cat_id =  $("#sub_category_id").find(':selected').attr('data-url');

    var obj                     = new Object();
    obj.price_from              = 0;
    obj.price_to                = 0
    obj.sort_by                 = ""
    obj.category_ids            = [];
    obj.subcategory_ids         = [sub_cat_id];
    obj.subcat2_ids             = []
    obj.brand_name              = []
    obj.limit                   = 15
    obj.skip                    = 0;
    obj.pincode                 = "";
    obj.user_id                 = header.user_id;

    let $request = $.ajax({
    url: self.api_url + "/api/get_products_by_subcategory",
    type: "post",
    data: JSON.stringify(obj),
    dataType: "json",
    contentType: "application/json; charset= utf-8",
    });

    $request.done(function (response) {


    let varients = ``;
    $("#related_products").empty('');
    response.data.forEach((obj1, i) => {
        let selected = '';
        // if(obj.varients.includes(obj1._id)) {
        //     selected = "selected";
        // }
        varients += `<option ${selected} value="` + obj1._id + `">` + obj1.product_name + `</option>`;
    });

    $("#related_products").append(varients);
    $("#related_products").formSelect();
    $("#related_products").focus();
    
    })
  },

  // render All top product in datatable
  get_all_top_products: function () {
    let self = this;
    let $request = $.ajax({
      url: self.api_url + "/api/get_top_product_list",
      contentType: "application/json; charset= utf-8",
      type: "GET",
      dataType: "json"
  });
  $request.done(function (response) {

      $('#top_products_table').empty();
      $('#top_products_table').DataTable({
          "data": response.data,
          "processing": true,
          "lengthMenu": [
              [10, 25, 50, -1],
              [10, 25, 50, "All"]
          ],
          "aaSorting": [],
          "destroy": true,
          // "dom": 'Blfrtip',
          "columnDefs": [{
              "orderable": false,
              "targets": 0
          }],
          // "buttons": [{
          //     "extend": 'excelHtml5',
          //     "exportOptions": {
          //         "columns": [2, 3, 4]
          //     },
          //     "className": "ml-2 export-btn waves-effect waves-light btn mrm gradient-45deg-green-teal",
          // }],
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
                'data': 'category_id',
                'sTitle': 'Category Name',
                'render': function (data, type, row) {
                  if (data == null || data == "") {
                    return "-";
                  } else {
                    return data.category_name
                    ;
                  }
                },
              },
              {
                'data': 'sub_category_id',
                'sTitle': 'Sub Category Name',
                'render': function (data, type, row) {
                  if (data == null || data == "") {
                    return "-";
                  } else {
                    return data.sub_category_name
                    ;
                  }
                },
              },
              {
                'data': 'top_product_id',
                'sTitle': 'Product Name',
                'render': function (data, type, row) {
                  if (data == null || data == "") {
                    return "-";
                  } else {
                    return data.product_name
                    ;
                  }
                },
              },
              {
                  'data': 'priority',
                  'sTitle': 'Priority',
              },
              {
                  'data': 'is_active',
                  'sTitle': 'Status',
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
                  'data': 'null',
                  'width': '15%',
                  'sTitle': 'Action',
                  'render': function (data, type, row) {
                      return '<a class="mb-6 btn-floating waves-effect waves-light gradient-45deg-green-teal disable-edit" onclick="top_products.edit_top_product(this)" title="Edit"> <i class="material-icons">create</i> </a><a class="mb-6 btn-floating waves-effect waves-light gradient-45deg-purple-deep-orange disable-delete" onclick="top_products.delete_top_product(this)" title="Delete"> <i class="material-icons">delete_forever</i> </a>';
                  }
              }

          ],

      });

  })

     
  },

  //Edit top Product
  edit_top_product: function (e) {
    
    let self = this;
    if (self.edit == false) {
      swal("Sorry!", "You dont have edit access", "error");
      return false;
    }
    let row = $(e).closest("tr");
    let obj = $("#top_products_table").dataTable().fnGetData(row);


    $("#top_product_id").val(obj._id);
    $("#top_productpriority").val(obj.priority);
    $("#top_productpriority").next("label").attr("class", "active");
    // $("#blog_status").val(obj.is_active);
    if (obj.is_active == true) {
      $("#topProduct_status").val("active");
    } else {
      $("#topProduct_status").val("inactive");
    }
    $("#create_top_product_btn").text("Update");



    // related product data
    $("#category_id").val(obj.category_id._id);
    $("#category_id").focus();

    const cat_id =  $("#category_id").val();

    $("#sub_category_id").empty();
    let $cat_request = $.ajax({
      url: self.base_url + "/web_master/get_all_sub_categories_for_categories",
      data: { main_category_id: cat_id },
      type: "get",
      dataType: "json",
    });
    $cat_request.done(function (response) {

      if(response.length > 0){
        $("#sub_category_id").empty();
        response.map((data) => {
          $("#sub_category_id").append(`<option value="${data._id}" data-url="${data.url}">${data.sub_category_name}</option>`);
        
        });
        
      }else {
        $("sub_category_id").empty();
      }
      $("#sub_category_id").val(obj.sub_category_id._id);
    });

    // If blog linked product available
    if(obj.top_product_id._id.length > 0){
      top_products.load_products_by_category(obj.top_product_id._id);
    } else {
      $("#related_products").empty('');
    }


  },

  // Load Product on edit and select 
  load_products_by_category: function(ids) {
    let selected_ids = ids;
    let self = this;
    var cat_id =  $("#category_id").find(':selected').attr('data-url');

    var obj                     = new Object();
    obj.highlight               = "";
    obj.price_from              = 0;
    obj.price_to                = 0
    obj.sort_by                 = ""
    obj.category_ids            = [cat_id];
    obj.subcat_ids              = [];
    obj.subcat2_ids             = []
    obj.brand_name              = []
    obj.limit                   = 100
    obj.skip                    = 0;
    obj.pincode                 = "";
    obj.user_id                 = header.user_id;
    
    let $request = $.ajax({
        url: self.api_url +"/api/get_products_list",
        type: "post",
        data: JSON.stringify(obj),
        dataType: "json",
        contentType: "application/json; charset= utf-8",
    });
    $request.done(function (response) {

      let varients = ``;
      $("#related_products").empty('');
      response.data.forEach((obj1, i) => {
          let selected = '';
          // if(obj.varients.includes(obj1._id)) {
          //     selected = "selected";
          // }
          if(selected_ids){
            if(selected_ids.includes(obj1._id)) {
              selected = "selected";
            }; 
          }
          varients += `<option ${selected} value="` + obj1._id + `">` + obj1.product_name + `</option>`;
      });

      $("#related_products").append(varients);
      $("#related_products").formSelect();
      $("#related_products").focus(); 

    })
  },

  // To delete top product
  delete_top_product: function (e) {
    let self = this;
    if (self.del == false) {
      swal("Sorry!", "You dont have delete access", "error");
      return false;
    }
    var row = $(e).closest("tr");
    var obj = $("#top_products_table").dataTable().fnGetData(row);
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
          url: self.api_url + "/api/delete_top_product/" + obj._id,
          type: "delete",
          dataType: "json",
        });
        $request.done(function (response) {
          if (response.title == "success") {
            $("#top_product_form").trigger("reset");
            $("#top_product_id").val("");
            swal("Deleted!", "Top Product has been deleted.", "success");
            top_products.get_all_top_products();
          } else {
            $("#top_product_id").val("");
            swal("Error!", "Something Went Wrong!", "error");
          }
        });
      } else {
        $("#top_product_id").val("");
        swal("Cancelled", "Your data is safe :)", "error");
      }
    });
  },


}
