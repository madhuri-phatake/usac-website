var user = {
    base_url: null,
    init: function() {
        this.bind_events();
    
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
          user.update_user();
        });
   },
   check_password:function(){
    var newpassword = $('#newpassword').val();
    var confirmpassword = $('#confirmpassword').val();
    if(newpassword == confirmpassword){
       $("#notpassword").hide();  
       $("#matchpassword").show();    
    }else{
        $("#matchpassword").hide(); 
        $("#notpassword").show();   
    }
   },
   check_password_exist: function() {
    var self = this;
    var password = $('#old_password').val();
    var obj = new Object;
    obj.password = password;
    //console.log(password);
    $.ajax({
        type: "post",
        contentType: "application/json; charset= utf-8",
        dataType: "JSON",
        url: user.base_url + "/changepassword/check_password_exist",
        data: JSON.stringify(obj),
        success: function(data) {
           // console.log(data);
            if (data.title == "success") {
                $('#newpassword').prop("disabled", false);
                $('#confirmpassword').prop("disabled", false);
                $("#errorpassword").hide();
            } else {
                $("#errorpassword").show();
                $('#newpassword').prop("disabled", true);
                $('#confirmpassword').prop("disabled", true);
            }

        }
    });
},
   update_user: function() {
        var self = this;
        var upObj = new Object();
        upObj.password = $("#newpassword").val();
        var newpassword=$("#newpassword").val();
        var confirmpassword=$("#confirmpassword").val();
      
        if(newpassword == '' && confirmpassword == ''){
            toastr["error"]("Please enter password", "Error");
        }else{
            if(newpassword == confirmpassword){
                $("#notpassword").hide();  
                $("#matchpassword").show();
                $.ajax({
                    type: 'put',
                    contentType: 'application/json',
                    dataType: 'json',
                    url: self.base_url + "/changepassword/update_password",
                    data: JSON.stringify(upObj),
                    success: function(data) {
                        console.log(data);
                        toastr[data.title](data.message, data.title);
                        if (data.title = "success") {
                            $("#newpassword").val('');
                            $("#old_password").val('');
                            $("#confirmpassword").val('');
                            $('#newpassword').prop("disabled", true);
                            $('#confirmpassword').prop("disabled", true);
                            $("#matchpassword").hide();
                        }
        
                    }
                });    
             }else{
                 $("#matchpassword").hide(); 
                 $("#notpassword").show();   
                
             }
       
    }

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