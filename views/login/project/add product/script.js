let container = document.getElementById("upload-body");
let url = "";
let a;

function bulkload() {
    const fileUpload = document.getElementById('fileupload');
    a = document.getElementById('fileupload').files.length;
    // let source = document.getElementById('fileupload').value;
    let letshtml = "";
    for (var i = 0; i < a; i++) {
        var reader = new FileReader();
        var file = fileUpload.files[i];
        //  url = reader.readAsDataURL(file);
        console.log(file.name);
        url = window.URL.createObjectURL(file);
        let containercount =
        
            `
            <hr>

            <div class="container">
            
        <div id="uploadimg" class="text-center py-4">
        <img id="${"img"+i}" src="${url}" alt="" width="250px" >        
        </div>
        <div>
        <div class="row">
        <div class="col">
        <label _ngcontent-qfi-c9="" for="category">Weight from</label>
        <input type="text" id="${"wfrom"+i}" class="form-control" placeholder="Enter weight">   
        </div>
        <div class="col">
        <label _ngcontent-qfi-c9="" for="category">Weight to</label>
        <input type="text" class="form-control" id="${"wto"+i}" placeholder="Enter weight">     
        </div>
        <div class="col">
        <label _ngcontent-qfi-c9="" for="mark">Mark</label>
        <input type="text" id="${"mark"+i}" class="form-control">                          
        </div>
        </div>
        <div>
        <label _ngcontent-qfi-c9="" for="category">Sub Category*</label>
        <select _ngcontent-qfi-c9="" class="form-control form-control-sm" id="${"category"+i}">
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option></select>
        <label _ngcontent-qfi-c9="" for="tag">Tag</label>
        <textarea class="form-control" placeholder="Tags" id="${"tag"+i}" rows="3"></textarea>   
        </div>
        </div>`;
        letshtml += containercount;
    }
    container.innerHTML = letshtml;
}
let data = [];
let Formarr = (ev) => {
    // let a = document.getElementById('fileupload').files.length;
    // console.log(a);
    // let tempdata;
    ev.preventDefault();    //to stop form from submitting
    for (var i = 0; i < a; i++) {
        var wholesaler0 = document.getElementById('wholesaler').value;
        var category0 = document.getElementById('category').value;
        var producttype0 = document.getElementById('producttype').value;
        var melting0 = document.getElementById('melting').value;
       var getimg = document.getElementById(`${"img"+i}`).src;
       var getweight_from = document.getElementById(`${"wfrom"+i}`).value;
       var getweight_to= document.getElementById(`${"wto"+i}`).value;
       var getmark= document.getElementById(`${"mark"+i}`).value;
       var getsubcategory= document.getElementById(`${"category"+i}`).value;
       var gettags= document.getElementById(`${"tag"+i}`).value;
        let tempdata = {     
            wholesaler:wholesaler0,
            category:category0,
            producttype:producttype0,
            melting:melting0,                                   //temp data Object created and saving values to it dynamically
            img:getimg,
            weight_from:getweight_from,
            weight_to:getweight_to,
            mark:getmark,
            subcategory:getsubcategory,
            tags:gettags,
        }
        data.push(tempdata);
        // console.log(tempdata);

    }

    document.forms[0].reset();
    console.log(data);
}
document.getElementById('submitbtn').addEventListener('click', Formarr);






