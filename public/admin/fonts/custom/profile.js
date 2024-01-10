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
   update_user: function() {
        var self = this;
        var upObj = new Object();
        upObj.name = $("#name").val();
        upObj.email_id = $("#email_id").val();
        var name=$("#name").val();
        var email_id=$("#email_id").val();
        if(name == '' || email_id == ''){
            toastr["error"]("Please enter name and email id", "Error");
        }else{
            
        $.ajax({
            type: 'put',
            contentType: 'application/json',
            dataType: 'json',
            url: self.base_url + "/users/edit_user",
            data: JSON.stringify(upObj),
            success: function(data) {
                toastr[data.title](data.message, data.title);
                if (data.title = "success") {
                    $("#name").val('');
                    $("#email_id").val('');
                  }

            }
        });
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