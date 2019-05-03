



//************************************************** *//
var editorHeight = $(window).height() - 150;
var delete_widget_id = null;
var added_widgets_list = [];
var imported_widget_list = [];
var current_widget_id = null;
var current_widget_obj = null;
var htmlEditor = null;
var jsEditor = null;
var cssEditor = null;
var asset_list = [];
var device_list = [];
var image_list = [];
var imageID = null;
var record_list = [];
var message_list = [];
var DASHBOARD_LIST = [];
var DASHBOARD_LIST_PROPERTY=[];
var CURRENT_DASHBOARD = {};
var CURRENT_DASHBOARD_ID = null;
var DEFAULT_DASHBOARD = {
    name: 'Untiled Dashboard',
    id: new Date().getTime(),
    property: 'dashboard.1',
    icon: 'icon-dashboard',
};
var CURRENT_DOMAIN = {};
var DASHBOARD_WIDGETS = [];
var GRID_STACK = null;
var CURRENT_DASHBOARD_ID = null;
var clicked_dashboard_icon = null;
var WIDGETS_LIST = [];
var CURRENT_WIDGET_OBJ = null;

var widget_ids = [];
var update_widget_list = [];
var imported_widget_group = {};
$(document).ready(function () {


$(".resourceTab").css('height', editorHeight + 'px');
$(".dashboardContent").css('height', $(window).height() - 200);
$(".widgetBody").css('height', $(window).height() - 370);
$(".dashboardListBody").css('height', $(window).height() - 200);
$("body").removeClass('bg-white');

loadImportedWidgets();
// addIconList();
loadImageList();

var options = {
    animate: true,
    cellHeight: 100,
    float: false,
    verticalMargin: 10,
};

$('.grid-stack').gridstack(options);
listDashboard();  

   
$('#e2_element').fontIconPicker({
         
          
       hasSearch: true
        
    });

 $("#e2_element").change(function(){
     var icon = $(this).children("option:selected").val();
     console.log("You have selected  - " + icon);
    
    });

});






var queryParams = {
        
    "query": {
        "bool": {
            "must": [{
                match: { domainKey: DOMAIN_KEY }
            }
]
        }
    },
  
    "size": 1000,
    sort: {
       
    }
};

var searchQuery = {
   
    "method": 'GET',
    "extraPath": "",
    "query": JSON.stringify(queryParams),
    "params": []

};

searchByQuery( '', searchQuery, function (status, data) {
    

    if (status) {
       

      var resultData=searchQueryFormatter(data).data;
      var resData=resultData['data'];
      tableOption['data']=resData;
       
       } 
       else {
    }
    
});
function searchByQuery(type, data, cbk) {       
    data['type'] = type;

    $.ajax({
        url: API_BASE_PATH + "/elastic/search/query/" + API_TOKEN,
        data: JSON.stringify(data),
        contentType: "application/json",
        type: 'POST',
        success: function (data) {
            cbk(true, data);
        },
        error: function (e) {                             
            cbk(false, e);
        }
    });
}


function searchQueryFormatter(data) {

    var resultObj = {
        total: 0,
        data: {},
        aggregations: {}
    }

    if (data.httpCode === 200) {

        var arrayData = JSON.parse(data.result);

        var totalRecords = arrayData.hits.total;
        var records = arrayData.hits.hits;

        var aggregations = arrayData.aggregations ? arrayData.aggregations : {};


        for (var i = 0; i < records.length; i++) {
            records[i]['_source']['_id'] = records[i]['_id'];
        }

        resultObj = {
            "total": totalRecords,
            "data": {
                "recordsTotal": totalRecords,
                "recordsFiltered": totalRecords,
                "data": _.pluck(records, '_source')
            },
            aggregations: aggregations
            // data : _.pluck(records, '_source')
        }


        return resultObj;

    } else {

        return resultObj;
    }

}






function listDashboard(){
    
    var pageSize=10;
    // listDomainProperty(pageSize,function(status,data){
    //     if(status){
          
          
    //         var db = 'dashboard_';
    //         var dName=[];
    //         console.log('data:',data); 
    //         for(i=0;i<data.length;i++){
    //             var found = data[i].name
    //             var found1=data[i].label
    //             console.log(found)
    //             console.log(found1)
    //             if(data[i].name.search(db)!= -1){
    //                 // console.log(data[i]);
    //                 // console.log(data[i].name.substr(10, 50));
    //                 dName.push(data[i].name.substr(10, 50));
    //             }
    //         }
    //         console.log('dashboards',dName);
            
    //         for(j=0;j<dName.length;j++){
                
    
    //             // console.log(dName[j]);
    //             // $('#addDashboard2').append('<li>'+dName[j]+' <span style="float:right;color:gray"><i style="cursor:pointer" onclick="editDashboard(' + '\'' +"dashboard_" + dName[j]+ '\'' + ')" class="fas fa-edit"></i> <i style="cursor:pointer" onclick="delDashboard(' + '\'' +"dashboard_" + dName[j]+ '\'' + ')" class="fas fa-trash-alt"></i></span> </li>');
    //             $("#addDashboard2").append('<li  class="dashboardLi dashboard_' + dName[j] + '" onclick="loadDashboardContent(' + '\'' +"dashboard_" + dName[j]+ '\'' + ')">' +
    //             '<a href="javascript:void(0)">' +
    //             // '<img src="' + val+ '" style="height: 18px;" />'+
    //             '<span style=" text-decoration: none;color: #333; padding:10px ;font-weight: bold; font-family:Times New Roman, Times, serif" class="">' + dName[j]+ '</span></a> ' +
    //             '<span type="btn btn-sm" style="float:right;color:gray mr-1 ;" onclick="editDashboard(' + '\'' +"dashboard_" + dName[j]+ '\'' + ')"><i class="fas fa-edit"></i></span> ' +
    //             '<span type="btn btn-sm " style="float:right;color:gray mr-1 ;" onclick="delDashboard(' + '\'' +"dashboard_" + dName[j]+ '\'' + ')"><i class="fas fa-trash"></i></span> ' +
    //             '</li>');
    //         }
    //     }
    //     else{
    //         console.log('error');
    //     }
    // });



getDomainProperty(DASHBOARD_LIST_PROPERTY, function (status, data) {
        if (status) {
            DASHBOARD_LIST = JSON.parse(data.value);
            if (DASHBOARD_LIST.length === 0) {
                DASHBOARD_LIST = [DEFAULT_DASHBOARD];
            }
        } else {
            DASHBOARD_LIST = [DEFAULT_DASHBOARD];
        }

        $(".dashboardList").html("");
        for (var i = 0; i < DASHBOARD_LIST.length; i++) {
            var iconStr = '';
            if(DASHBOARD_LIST[i].isimage){
                iconStr = '<img src="' + DASHBOARD_LIST[i].imgpath + '" style="height: 18px;" />';
            }else {

                iconStr = '<i class="' + DASHBOARD_LIST[i].icon + '"></i> ';
            }

          


    $(".dashboardList").append('<li class="dashboardLi dashboard_' + DASHBOARD_LIST[i].id + '" onclick="loadDashboardContent(\'' + DASHBOARD_LIST[i].id + '\')">' +
                '<a href="javascript:void(0)">' +
                iconStr +
                '<span class="">' + DASHBOARD_LIST[i].name + '</span></a> ' +
                // '<span class="pull-right" onclick="openDashboardModal(3,\'' + DASHBOARD_LIST[i].id + '\')"><i class="icon-trash4"></i></span> ' +
                // '<span class="pull-right mr-1" onclick="openDashboardModal(2,\'' + DASHBOARD_LIST[i].id + '\')"><i class="icon-edit2"></i></span> ' +
                '</li>');
        }

        // if(qs('id')){

        //     loadDashboardContent(qs('id'))
        // }else {

        //     CURRENT_DASHBOARD_ID ? loadDashboard(CURRENT_DASHBOARD) : loadDashboard(DASHBOARD_LIST[0]);
        // }
    });
}

function loadDashboardContent(id) {

    for (var i = 0; i < DASHBOARD_LIST.length; i++) {
        
        if (id+'' === DASHBOARD_LIST[i].id+'') {
            loadDashboard(DASHBOARD_LIST[i]);
        }
        console.log(DASHBOARD_LIST[i])
    }

}

function loadDashboard(obj) {
   

    $(".dashboardLi").removeClass('active');
    $(".dashboard_" + obj.id).addClass('active');

    $(".dashboardContent").css('background-color', obj.bgcolor ? obj.bgcolor : DEFAULT_DASHBOARD_BG)

    CURRENT_DASHBOARD = obj;

    CURRENT_DASHBOARD_ID = CURRENT_DASHBOARD.id;

    $(".dashboardName").html(CURRENT_DASHBOARD.name);

    // if(CURRENT_DASHBOARD.isimage){
    //     $(".dashboardIcon").html('<img src="' + CURRENT_DASHBOARD.imgpath + '" style="height: 28px;" />');
    // }else {

    //     $(".dashboardIcon").html('<i class="' + CURRENT_DASHBOARD.icon + '"></i> ');
    // }



    // loadWidgets(CURRENT_DASHBOARD.property);

}




// function loadDashboardContent(idd){
   

//     for (var i = 0; i <  idd.length; i++) {
      
       
//             loadDashboard( idd[i]);
        
//     }
// }
// function loadDashboard(y){
   
// }
function addDashboard(){

    

    // var data = {
    //     label:$("e2_element").val(),
    //     name: 'dashboard_'+$("#dashboardName").val(),
    //     value: JSON.stringify(DASHBOARD_LIST)
    // };


    var obj = {
        name: $("#dashboardName").val(),
        id: 'dashboard' + new Date().getTime(),
        property: 'dashboard.' + new Date().getTime(),
        // icon: clicked_dashboard_icon,
       
        isimage : true,
        imgpath : imageID
    }

    DASHBOARD_LIST.push(obj);

    var data = {
        name: DASHBOARD_LIST_PROPERTY,
        value: JSON.stringify(DASHBOARD_LIST)
    };

    console.log(data)
    upsertDomainProperty(data, function (status, data) {
        if (status) {
            successMsg('Dashboard added successfully');
            $("#adDashboard").modal('hide');
            listDashboard();  

        } else {
            errorMsg('Error in adding new dashboard');
        }
    });

}
function editDashboard(id){
   //should be implemented

var aname=document.getElementById("dashboardName1");
            aname.setAttribute("value", id) 
            $('#EditDashboard').modal('show');
            $("#EnterDashboard").click(function(){
            
            var x=$("#dashboardName1").val();
                
                 var roll;
            
                if(x!=""){
               
                    roll=x;
          
                }else{
               
                    roll=id;
           
                }
            var data1={
            name: roll,
            }

updateDomainProperty(data1, function (status, data) {
    if (status) {
        successMsg('Dashboard updated successfully');
        $("#EditDashboard").modal('hide');
        listDashboard();  

    } else {
        errorMsg('Error in updating new dashboard');
    }
});

});

}
function delDashboard(id){
    console.log(id)
   
       
    deleteDomainProperty(id, function (status, data) {
        console.log(id)
        if (status) {
            successMsg('Dashboard deleted successfully');
            listDashboard();  
            console.log(data)
          
        } else {
            errorMsg('Error in deleting dashboard')
            console.log(data)
        }
    
    })
}






function openModal(type,id){
    if(type==1){
        console.log('add clicked');
        $('#adDashboard').modal('show');
        

        // $('#e2_element').fontIconPicker();
// $('#e2_element').fontIconPicker({
//     useAttribute: true,
//     theme: 'fip-bootstrap',
//     attributeName: 'data-icomoon'
// });
        console.log('max reached');
    }else if(type ==2){
        $('.templateAction').html('Link');
        $('#addCamera').modal('show');
    } else if(type == 3){
        $('#linkDevice').modal('show');
        current_camera = id;
    }
}




