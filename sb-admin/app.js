
var app = angular.module('plunker', ['nvd3'])
.controller('MainCtrl', function($scope,$http) {

$scope.redirect = function(){

var filedHostName =document.getElementById("txtFiledHostName").value;
	if(filedHostName=='')
	{
	//alert("Host Name Required")
	}
	else{
			
	
	 clickCounter();
  window.location = "index.html?key1="+filedHostName;
  }
};
        // $scope.$on('$locationChangeStart', function() {
            
		// alert(12);
			// //$http.get("http://"+ModeString+"/app/startThread/0/",{timeout:1500})
		 // //.success(function(response) { var a=1;	 }) 
        // });


 $scope.childOnLoad = function() {

    var ModeString =  getParameterByName('key1');
	document.getElementById("lblPresentHostName").innerHTML=ModeString;
	
	if(ModeString!=""){
	document.getElementById("txtFiledHostName").value=ModeString;}
		 
};


$scope.mySplit = function(string) {
    $scope.array = string.split(',');
    return $scope.array;
}
$scope.toggleService = function(){
	
	 if ($scope.run){
			//hit stop service
			
			var ModeString =  getParameterByName('key1');
			$http.get("http://"+ModeString+"/app/startThread/0/",{timeout:1500})
		 .success(function(response) { $scope.run=!$scope.run;	 })  
	 }
	 else{
		//hit start service
			var ModeString =  getParameterByName('key1');
			$http.get("http://"+ModeString+"/app/startThread/1/",{timeout:1500})
		 .success(function(response) { $scope.run=!$scope.run;	 })  
	 }
};
function clickCounter() {

    if(typeof(Storage) !== "undefined") {
        if (localStorage.clickcount) {
	
		//redirectUrl='index.html?key1='+document.getElementById("txtFiledHostName").value;
            var x =document.getElementById("txtFiledHostName").value;
            localStorage.clickcount = x+","+(localStorage.clickcount)  ;
        } 


else {
			//redirectUrl='index.html?key1='+document.getElementById("txtFiledHostName").value;
             var x =document.getElementById("txtFiledHostName").value;
            localStorage.clickcount = x;
        }
        //document.getElementById("result").innerHTML =  localStorage.clickcount ;
    } //else {
      //  document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
   // }
}
$scope.data = [];

/* $scope.init = function () {
    // check if there is query in url
    // and fire search in case its value is not empty
	if(typeof(Storage) !== "undefined") {

        document.getElementById("result").innerHTML= localStorage.clickcount ;
    }
}; */

$scope.init1 = function () {
    // check if there is query in url
    // and fire search in case its value is not empty
	if(typeof(Storage) !== "undefined") {

        return localStorage.clickcount ;
    }
};
$scope.toolTipContentFunction = function () {
				return function(key, x, y, e, graph) {				
				jsonTooltipdata=e.point;
				return  '<table><tr><td>PortNumber:</td><td>' + key + '</td></tr><tr><td>ThroughPut:</td><td>' +y+ '</td></tr><tr><td>CumulativeBytes:</td><td>' +jsonTooltipdata.CumulativeBytes+ '</td></tr><tr><td>SSTHRESH:</td><td>' +jsonTooltipdata.SSTHRESH+ '</td></tr><tr><td>CWND:</td><td>' +jsonTooltipdata.CWND+ '</td></tr><tr><td>RWND:</td><td>' +jsonTooltipdata.RWND+ '</td></tr><tr><td>RTT:</td><td>' +jsonTooltipdata.RTT+ '</td></tr><tr><td>RTO:</td><td>' +jsonTooltipdata.RTO+ '</td></tr></table>'
				}}; 



    $scope.options = {
        chart: {
            type: 'lineChart',
            height: 380,
			 legend: {
     dispatch: {},
      margin: {
        top: 1,
        right: 50,
        bottom: 4,
        left: -3,
      },
      width: 400,
      height: 100,
      align: true,

      rightAlign: false,
      updateState: true,
      radioButtonMode: false
    },
            margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
			
			
			
            useInteractiveGuideline: false,
			interactive:true,
			tooltips: true,
			tooltipContent: $scope.toolTipContentFunction(),
			
			
            transitionDuration:500,    
             yAxis: {
				axisLabel: 'ThroughPut mb/sec',
                 tickFormat: function(d){
                    return d3.format('.02f')(d);
                 }
             }
        }
    };



    $scope.options1 = angular.copy($scope.options);
    $scope.options1.chart.transitionDuration = 1;
    $scope.options1.chart.yDomain = [0,50];
	//$scope.options1.chart.yRange = [0,100];
	//$scope.options1.chart.yAxisLabel="Y Axis Label"
    
	
	$scope.hostName = null;
    $scope.addDataSeries = function (key1) {
    
    $scope.data.push({values:[], key:key1})
	};   
    $scope.run = false;
    
    var x = 0;
	var responseByService;
    $scope.responseIsInData = function (port) {
    
		
            var flag=0; 
			angular.forEach($scope.data,function(value,index){
                //alert(value.name);
				if (value.key== port){flag=1}
            })
		return flag;
	}; 
	
  $scope.removeItem = function(index){
    $scope.data.splice(index, 1);
  };
  

$scope.getIndexByKey = function (key) {
    
		
            var posFlag=-1;
			var findFlag=-1;
			var i=0;
			angular.forEach($scope.data,function(value,index){
                //alert(value.name);
				if (value.key== key){findFlag=1; posFlag=i; }
				i=i+1;
            })
			
			if (findFlag == -1)
			{
				return -1;
			}else
			{
				return posFlag;
			}
		
	}; 
	

	function isInResponse(port) {
	var flag=0;
	for (var i = 0; i < (responseByService.length); i++)
	{
		if (responseByService[i].PortNumber==port)
		{
			flag=1
		}
	}
		return flag;	
	}
	var refreshId;

    refreshId = setInterval(function(){
		 
	    if (!$scope.run) return;
		//$scope.run1=true;
		
		 var ModeString =  getParameterByName('key1');
		 $('#PresentHostName').text=ModeString;
		 $scope.hostName=ModeString;

		if ($scope.hostName!=""){
		$http.get("http://"+$scope.hostName+"/app/startCapturing/",{timeout:5000})
		 .success(function(response) { responseByService=response;	   
			
			if (responseByService=='No data in queue' ||responseByService==''|| responseByService==null || responseByService=='No Active Thread' )
			{
				//alert('No data in queue');
				//$scope.run1=false;
				$scope.data.length = 0;
				responseByService=null;
				x=0;
			}
			else 
			{	
			
				$scope.names = response; 
				//$scope.run1=true;
				
								for (var i = 0; i < (responseByService.length); i++)
				{
				
					var flag = $scope.responseIsInData(responseByService[i].PortNumber);
					//alert('hi');
					//debugger;
					if (flag==0)//not in series
					{
						$scope.addDataSeries(responseByService[i].PortNumber)//add in series
						index=$scope.getIndexByKey(responseByService[i].PortNumber)//fetch index
						if (index != -1){$scope.data[index].values.push({ x: x,	y:responseByService[i].ThroughPut,SSTHRESH:responseByService[i].SSTHRESH,CumulativeBytes:responseByService[i].CumulativeBytes,CWND:responseByService[i].CWND,RWND:responseByService[i].RWND,RTT:responseByService[i].RTT,RTO:responseByService[i].RTO});}//also add values
					}
					else//present in series
					{
						index=$scope.getIndexByKey(responseByService[i].PortNumber)//fetch index
						if (index != -1){$scope.data[index].values.push({ x: x,	y:responseByService[i].ThroughPut,SSTHRESH:responseByService[i].SSTHRESH,CumulativeBytes:responseByService[i].CumulativeBytes,CWND:responseByService[i].CWND,RWND:responseByService[i].RWND,RTT:responseByService[i].RTT,RTO:responseByService[i].RTO});}//direct  add values in present series						
					}								
						
				}
				
				

				
				

	  var shiftTime=60;
		if (x>shiftTime){
			
				$scope.data1=$scope.data;
			for (var i = 0; i < ($scope.data.length); i++)
			{

				
				if ($scope.data[i].values[0].x ==(x-(shiftTime+1)))
				{
					$scope.data[i].values.shift();
				}
							
			}
			
			for(var i = $scope.data.length -1; i >= 0 ; i--)
			{
				if($scope.data[i].values.length==0){
				$scope.data.splice(i, 1);
				}
			}

			}
	    x++;


			} 

		 }).
		 error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                    //alert(status);
			        //$interval.cancel(refreshId);
					//alert('erroer');
					refreshId = undefined;
					//clearInterval(refreshId);
                });}
		 //if (!$scope.run1) return;
				
		$scope.$apply();
    }, 1000);    


function getParameterByName( name ){

  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)", 
      regex = new RegExp( regexS ),
      results = regex.exec( window.location.href );
  if( results == null ){
    return "";
  } else{
    return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
}
	$scope.childOnLoad();  
});
 window.onbeforeunload = function() {
	debugger;
	var currentHostname=document.getElementById("lblPresentHostName").innerHTML;
	$.get("http://"+currentHostname+"/app/startThread/0/",function(data,status){
      status;
    });
	
	
	return 	'window closed '
};