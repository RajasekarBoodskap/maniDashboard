



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
    icon: 'fa fa-dashboard',
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


// $(".resourceTab").css('height', editorHeight + 'px');
$(".dashboardContent").css('height', $(window).height() - 200);
// $(".widgetBody").css('height', $(window).height() - 370);
$(".dashboardListBody").css('height', $(window).height() - 200);
$("body").removeClass('bg-white');





var options = {
    animate: true,
    cellHeight: 100,
    float: false,
    verticalMargin: 10,
};


listDashboard();  



    /**
     * Example 8
     * Load icons from Fontello JSON config file
     */
 
    //  Init the font icon picker
   
    var e8_element = $('#e8_element').fontIconPicker({
        theme: 'fip-bootstrap'
    });
 
    // // Add the event on the button
    
    $('#e8_buttons button').on('click', function(e) {
        e.preventDefault();
 
    //     // Show processing message
        $(this).prop('disabled', true).html('<i class="icon-cog demo-animate-spin"></i> Please wait...');
 
    //     // Get the JSON file
        $.ajax({
            url: 'fontello-7275ca86/config.json',
            type: 'GET',
            dataType: 'json'
        })
        .done(function(response) {
 
            var fontello_json_icons = [];
 
    //         // Push the fonts into the array
            $.each(response.glyphs, function(i, v) {
                fontello_json_icons.push( response.css_prefix_text + v.css );
            });
 
    //         // Set new fonts
            e8_element.setIcons(fontello_json_icons);
 
    //         // Show success message and disable
            $('#e8_buttons button').removeClass('btn-primary').addClass('btn-success').text('Successfully loaded icons').prop('disabled', true);
 
        })
        .fail(function() {
    //         // Show error message and enable
            $('#e8_buttons button').removeClass('btn-primary').addClass('btn-danger').text('Error: Try Again?').prop('disabled', false);
        });
        e.stopPropagation();
    });
 
   
    // addIconList() 
  

});




  







function listDashboard(){
  
    
        
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
                iconStr = '<i class="' + DASHBOARD_LIST[i].icon + '" style="height: 18px;" /></i>';
            }else {

                iconStr = '<i class="' + DASHBOARD_LIST[i].icon + '"></i> ';
            }


            $(".dashboardList").append('<li class="dashboardLi dashboard_' + DASHBOARD_LIST[i].id + '" onclick="loadDashboardContent(\'' + DASHBOARD_LIST[i].id + '\')">' +
                '<a href="javascript:void(0)">' +
                iconStr +
                '<span class="">' + DASHBOARD_LIST[i].name + '</span></a> ' +
                
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
            }
        
        }

        function loadDashboard(obj) {


            $(".dashboardLi").removeClass('active');
            $(".dashboard_" + obj.id).addClass('active');
        
           
            CURRENT_DASHBOARD = obj;
        
            CURRENT_DASHBOARD_ID = CURRENT_DASHBOARD.id;
        
            $(".dashboardName").html(CURRENT_DASHBOARD.name);
        
            if(CURRENT_DASHBOARD.isimage){
                $(".dashboardIcon").html('<i class="' + CURRENT_DASHBOARD.icon + '" style="height: 28px;" />');
            }else {
        
                $(".dashboardIcon").html('<i class="' + CURRENT_DASHBOARD.icon + '"></i> ');
            }
        
        
        
         
        
        }




function addDashboard(){

  var obj = {
        name: $("#dashboardName").val(),
        id: 'dashboard' + new Date().getTime(),
        property: 'dashboard.' + new Date().getTime(),
        icon: $("#e8_element").val(),
        isimage : true,
        imgpath : imageID
    }

    DASHBOARD_LIST.push(obj);
    

    var data = {
        name: DASHBOARD_LIST_PROPERTY,
        value: JSON.stringify(DASHBOARD_LIST)
    
    };

    console.log(data)
   
    upsertDomainProperty(obj, function (status, data) {
        if (status) {
            successMsg('Dashboard added successfully');
            
            console.log(obj.id);
            console.log(obj.name);
            $(".dashboardList").append('<li class="dashboardLi dashboard_' + obj.id + '" onclick="loadDashboardContent(\'' + obj.id + '\')">' +
            '<a href="javascript:void(0)">' +
            '<i class="'+obj.icon+'" style="height: 28px;" /></i> ' +
            '<span class="">' + obj.name + '</span></a> ' +
            '</li>');

            loadDashboardContent(obj.id);
            $("#adDashboard").modal('hide');
           

        } else {
            errorMsg('Error in adding new dashboard');
        }
    });

}



function previewDashboard() {
    // window.open('/dashboard/' + CURRENT_DASHBOARD_ID + '/preview', "window", "height=" + $(window).height() + ", width=" + $(window).width() + ",directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no");
    window.open('/dashboard/' + CURRENT_DASHBOARD_ID, "blank");
}
function saveDashboard() {

    console.log("current_widget_obj =>",current_widget_obj)

    WIDGETS_LIST = [];

    var nodesList = GRID_STACK.grid.nodes;

    for (var i = 0; i < nodesList.length; i++) {
        var node = nodesList[i];
        var obj = {};

        for (var j = 0; j < added_widgets_list.length; j++) {
            if (node.id === added_widgets_list[j]['id']) {
                obj = added_widgets_list[j];
            }
        }

        obj['x'] = node.x;
        obj['y'] = node.y;
        obj['width'] = node.width;
        obj['height'] = node.height;
        obj['config'] = typeof obj.config === 'string' ? JSON.parse(obj.config) : obj.config

        if (current_widget_obj && current_widget_obj.id === obj.id) {
            current_widget_obj['x'] = node.x;
            current_widget_obj['y'] = node.y;
            current_widget_obj['width'] = node.width;
            current_widget_obj['height'] = node.height;
            WIDGETS_LIST.push(current_widget_obj);
        } else {
            WIDGETS_LIST.push(obj)
        }


    }

    var data = {
        name: CURRENT_DASHBOARD.property,
        value: JSON.stringify(WIDGETS_LIST)
    };
    added_widgets_list = WIDGETS_LIST;

    upsertDomainProperty(data, function (status, data) {
        if (status) {
            successMsg('Successfully Saved');

            loadWidgets(CURRENT_DASHBOARD.property);

        } else {
            errorMsg('Error')
        }
    })

}







function updateDashboard() {
    var obj = {};
    for (var i = 0; i < DASHBOARD_LIST.length; i++) {
        if (CURRENT_DASHBOARD_ID === DASHBOARD_LIST[i].id) {
            obj = DASHBOARD_LIST[i];
        }
    }


    var tempObj = {
        name: $("#dashboardName").val(),
        id: obj.id,
        property: obj.property,
        icon:  $("#e8_element").val(),
       
        isimage : true,
        imgpath : imageID
    }


    for (var i = 0; i < DASHBOARD_LIST.length; i++) {

        if (CURRENT_DASHBOARD_ID === DASHBOARD_LIST[i].id) {
            DASHBOARD_LIST[i] = tempObj;
        }
    }


    var data = {
        name: DASHBOARD_LIST_PROPERTY,
        value: JSON.stringify(DASHBOARD_LIST)
    };

    upsertDomainProperty(tempObj, function (status, data) {
       
        if (status) {
            
            successMsg('Dashboard updated successfully');
            
            getDomainProperty(DASHBOARD_LIST_PROPERTY, function (status, data) {
                
                if (status) {
                    DASHBOARD_LIST = JSON.parse(data.value);
                    if (DASHBOARD_LIST.length === 0) {
                        DASHBOARD_LIST = [DEFAULT_DASHBOARD];
                    }
                } 
                
                else {
                    DASHBOARD_LIST = [DEFAULT_DASHBOARD];
                }

                $(".dashboardList").html("");
                for (var i = 0; i < DASHBOARD_LIST.length; i++) {

                    var iconStr = '';

                    if(DASHBOARD_LIST[i].isimage){
                        iconStr = '<i class="' + DASHBOARD_LIST[i].icon + '" style="height: 28px;" /></i>';
                    }else {

                        iconStr = '<img src="' + DASHBOARD_LIST[i].icon + '">';
                    }

                    $(".dashboardList").append('<li class="dashboardLi dashboard_' + DASHBOARD_LIST[i].id + '" onclick="loadDashboardContent(\'' + DASHBOARD_LIST[i].id + '\')">' +
                        '<a href="javascript:void(0)">' +
                        iconStr +
                        '<span class="">' + DASHBOARD_LIST[i].name + '</span></a> ' +
                       
                        '</li>');
                }

                // $(".dashboardLi").removeClass('active');
                $(".dashboard_" + tempObj.id).addClass('active');

              

                $(".dashboardName").html(tempObj.name);
                $(".dashboardIcon").html('<i class="' + tempObj.icon + '"></i>');

                if(tempObj.isimage){
                    $(".dashboardIcon").html('<i class="' + tempObj.icon + '" style="height: 28px;" /></i>');
                }else {

                    $(".dashboardIcon").html('<i class="' + tempObj.icon + '"></i> ');
                }
            });

            $("#adDashboard").modal('hide');

        } else {
            errorMsg('Error in updating dashboard')
            console.log(data)
        }
    })
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








// function openDashboardModal(type,id){
//     id = CURRENT_DASHBOARD_ID;
//     if(type==1){
//         alert("hiii")
//         $(".dashboardAction").html('Create');

       
      
//         $("#adDashboard form")[0].reset();

      

       
//         $("#dashboard_icon").html('<i class="fa fa-dashboard"></i>');
//         $("#adDashboard form").attr('onsubmit', 'addDashboard()');
//         $("#adDashboard").modal('show');
        
//     }
//     else if (type === 2) {

//         $(".dashboardAction").html('Update');

//         var obj = {};
//         for (var i = 0; i < DASHBOARD_LIST.length; i++) {
//             if (id === DASHBOARD_LIST[i].id) {
//                 obj = DASHBOARD_LIST[i];
//             }
//         }

       
//         $("#dashboardName").val(obj.name);
//         $("#adDashboard form").attr('onsubmit', 'updateDashboard()');
//         $("#adDashboard").modal('show');

//      }
//      else if(type ==3){
//         $('.templateAction').html('Link');
//         $('#addCamera').modal('show');
//     }
//     else if(type == 4){
//         $('#linkDevice').modal('show');
//         current_camera = id;
//     }

// }


function openDashboardModal(type, id) {
    id = CURRENT_DASHBOARD_ID;

    $(".imageHtml").html('');
    imageID = null;

    if (type === 1) {
        $(".dashboardAction").html('Create');

     

        $("#adDashboard form")[0].reset();

      

       
       

        clicked_dashboard_icon = 'fa fa-dashboard';
        $("#dashboard_icon").html('<i class="fa fa-dashboard"></i>');
        $("#adDashboard form").attr('onsubmit', 'addDashboard()');
        $("#adDashboard").modal('show');
    } else if (type === 2) {

        $(".dashboardAction").html('Update');

        var obj = {};
        for (var i = 0; i < DASHBOARD_LIST.length; i++) {
            if (id === DASHBOARD_LIST[i].id) {
                obj = DASHBOARD_LIST[i];
            }
        }

       

       

        $("#dashboardName").val(obj.name);
        clicked_dashboard_icon = obj.icon;
        $("#dashboard_icon").html('<i class="' + obj.icon + '"></i>');

        $("#adDashboard form").attr('onsubmit', 'updateDashboard()');
        $("#adDashboard").modal('show');

    // } else if (type === 3) {

    //     var obj = {};
    //     for (var i = 0; i < DASHBOARD_LIST.length; i++) {
    //         if (id === DASHBOARD_LIST[i].id) {
    //             obj = DASHBOARD_LIST[i];
    //         }
    //     }

    //     $(".dashboardDeleteName").html(obj.name)

    //     $("#deleteModal").modal('show');

    // }
}
}




//************************************************** */



