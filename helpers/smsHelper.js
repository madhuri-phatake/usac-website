const axios = require('axios');

exports.sendSms = function(phone_number,message,template_id){

    const url = 'https://api.pinnacle.in/index.php/sms/json';
    const postData = {
        'message': [{
            'number': '91' + phone_number,
            'text': message
        }],
        // 'sender': 'LUKEWM', //OLD
        "sender": "UCRLYF",
        'messagetype': 'TXT',
        'dlttempid': template_id,
        // 'dltentityid':'1501661440000020478', //OLD
        // 'dltheaderid': '1505160810417465777'
        'dltentityid':'1501389450000027179',
        'dltheaderid': '1505162020750841515'
    }
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'apikey': '6f7ed5-70756b-76e7d5-3cf3f3-5a1c8d'
        }
    }
    axios.post(url, postData, headers).then(values => {
        if (values.data.status == "success") {
            console.log("sms sent successfully");
            return true;
        } else {
            console.log("Error occurred!");
            return false;
        }
    });
}   