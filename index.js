  /*------------------------------------------
    Monta html tabela 
 ------------------------------------------*/
 function format(d){
    var descFalhas = function(){            
        var falhas = "";
        for (let i = 0; i < d.subData.length; i++){                
            const element = d.subData[i];
            falhas += '<tr>'+ 
                '<td>Type: </td>'+ '<td>'+ element.type + '</td>'+               
                '<td>Message: </td>'+ '<td>'+ element.message+ '</td>'+               
                '<td>Text:</td>'+ '<td>' +  element.text+ '</td>'+ 
            '</tr>';            
        }
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' + falhas + '</table>' ;
    };
    // Retorna string html, constroi tabela.
    return descFalhas();          
  }

  /*------------------------------------------
    Recebe um object json, monta tabela com ele  
 ------------------------------------------*/
function loadXml( objData ){

    $(document).ready(function(){
        $("#qtdskipped").append("<h1>" + objData['summary'].nskipped + "</h1>")
    });

    $(document).ready(function(){
        $("#qtderror").append("<h1>" + objData['summary'].nerror + "</h1>")
    });

    $(document).ready(function(){
        $("#qtsucess").append("<h1>" + objData['summary'].nsucess + "</h1>")
    });

    $(document).ready(function(){
        $("#qtdtotal").append("<h1>" + objData['summary'].ntotal + "</h1>")
    });
    
    $(document).ready(function(){
        $("#qtdinfo").append("<h1>" + objData['summary'].ninfo + "</h1>")
    });
    
      $(document).ready(function() { 
                   
        var table = $('#tableMain').DataTable( {              
            //"ajax": "jsonout.txt", 
            data: objData.data,
            "columns": [
                {
                    "className":      'details-control',
                    "orderable":      true,
                    "data":           null,
                    "defaultContent": ''
                },
                { "data": "id" },
                { "data": "name" },
                { "data": "time" },
                { "data": "status" }                  
            ],
            "order": [[1, 'asc']],
            "fnRowCallback": function( row, data, index ) {
                //debugger
                if ( data["status"] == "ERROR" )
                {
                    $('td', row).addClass('bg-danger');
                }
                else if ( data["status"] == "SKIPPED" )
                {
                    $('td', row).addClass('bg-warning');
                }
                else if ( data["status"] == "OK" )
                {
                    $('td', row).addClass('bg-success');
                }
                else if ( data["status"] == "INFO" )
                {
                    $('td', row).addClass('bg-info');
                }
                
            }
        });
        
        // Add event listener for opening and closing details
        $('#tableMain tbody').on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var row = table.row( tr );
    
            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass('shown');
            }
        } );
      } );
}

/*------------------------------------------
    Realiza o parser do xml,
    Monta um object json.     
 ------------------------------------------*/
function reqListener(){

    var nskipped = 0;
    var nerror = 0;
    var nsucess = 0;    
    var ninfo = 0;
    var ntotal = 0;
    var objData = {};
    var xmlstr = this.responseText;   
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xmlstr,"text/xml");
    
    var x = xmlDoc.getElementsByTagName("testcase");
    ntotal = x.length;
    var testcases = [];  
    for (let i = 0; i < x.length; i++) { 
        
        var status = "";
        var arrSubData = [];  
        var id   = x[i].getAttribute("id");
        var name = x[i].getAttribute("name");
        var time = x[i].getAttribute("time");

        if ( x[i].children.length == 0 ){
            nsucess++;
            status = "OK";
        }else{

            //Array subdata    
            for (let y = 0; y < x[i].children.length; y++) {
                const el = x[i].children[y];
                type = el.getAttribute('type');
                 if(type === "Skipped"){
                    if(y == 0){nskipped++;} 
                    status = "SKIPPED"; 
                }else if(type === "Error"){
                    if(y == 0){nerror++;}
                    status = "ERROR";                 
                }else if(type === "Info"){
                    if(y == 0){ninfo++;} 
                    status = "INFO"; 
                }                
                message = el.getAttribute('message'), 
                text = el.innerHTML;
                arrSubData.push( { type:type, message:message, text:text } );
            }
        }
        testcases.push({ id:id, name:name, time:time, status:status, subData:arrSubData  });
    }
    
    var summary = { nskipped:nskipped, nerror:nerror, nsucess:nsucess, ninfo:ninfo, ntotal:ntotal };
    objData = { data:testcases, summary:summary };
    loadXml( objData );

}

/*------------------------------------------
    Inicializar a chamada da funções de load
    o xml do xml de resultado.     
 ------------------------------------------*/
function TecTest(){    
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "tectest.xml");
    oReq.send();
}


/* ===================== FUNÇOES PARA O EXCEPTION ===================== */

  /*------------------------------------------
    Recebe um object json, monta tabela com ele  
 ------------------------------------------*/
 function ExepLoadXml( objData ){

    /* $(document).ready(function(){
        $("#qtdskipped").append("<h1>" + objData['summary'].nskipped + "</h1>")
    });

    $(document).ready(function(){
        $("#qtderror").append("<h1>" + objData['summary'].nerror + "</h1>")
    });

    $(document).ready(function(){
        $("#qtsucess").append("<h1>" + objData['summary'].nsucess + "</h1>")
    });
    */
    $(document).ready(function(){
        $("#qtdExepTotal").append("<h1>" + objData['total'] + "</h1>")
    });
    
      $(document).ready(function() {          
        var table = $('#tableException').DataTable( {              
            //"ajax": "jsonout.txt", 
            data: objData.data,
            "columns": [
                {
                    "className":      'details-control',
                    "orderable":      false,
                    "data":           null,
                    "defaultContent": ''
                },                
                { "data": "name" },
                { "data": "desc" },
                { "data": "status" },                
            ],
            "order": [[1, 'asc']]
        } );
      });
}




/*------------------------------------------
    Realiza o parser do xml,
    Monta um object json.     
 ------------------------------------------*/
 function ExepReqListener(){

    /* var nskipped = 0;
    var nerror = 0;
    var nsucess = 0;*/

    var ntotal = 0; 

    var objData = {};
    var xmlstr = this.responseText;   
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xmlstr,"text/xml");    
    var x = xmlDoc.getElementsByTagName("name");    
    var testExceptions = [];  
    ntotal = x.length;
    for (i = 0; i < x.length; i++) { 
        
        var desc = "";
        var status = "";      
        var name = "";
        //var id   = x[i].getAttribute("id");
        
        desc   = x[i].getAttribute("desc");
        status = x[i].getAttribute("status");        
        name = x[i].innerHTML;
        testExceptions.push({ desc:desc, status:status, name:name });
    }    
    objData = { data:testExceptions, total:ntotal };
    ExepLoadXml( objData );
}

/*------------------------------------------
    Inicializar a chamada da funções de load
    o xml do xml de resultado.     
 ------------------------------------------*/
function ExepTecTest(){
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", ExepReqListener);
    oReq.open("GET", "tectest_exception.xml");
    oReq.send();
}








