function fN(x,y){
    if(x[0] < y[0]){return(-1)}
    if(x[0] > y[0]){return(1)}
    return(0)
}


function setBarOptions(data){
    var jsdata = JSON.parse(data)
    var currencies = jsdata.currency
    var latest = jsdata.latest
    var lat_val = []
    for (var val of currencies){
        var temp_val = []
        temp_val = [val, latest[val]]
        lat_val.push(temp_val)
    }
    var option = {
        title : {
            text: 'Latest exchange rates against USD'
        },
        xAxis:{
            splitLine:{
                show:false
            },
            axisLabel:{
                fontSize: 13
            },
            type: 'category',
            data:currencies
        },
        yAxis: {
            type: 'value',
            axisLabel:{
                fontSize: 13
            }
        },
        series:[{
            type:'bar',
            data:lat_val
        }]
    }
    return(option)
}


function setLineOptions(data){
    var jsdata = JSON.parse(data)
    var timelist = []
    for(var time of jsdata.dates){
        var timestd = new Date(time)
        timelist.push(timestd)
    }
    var currencies = jsdata.currency
    var temp_array = []
    for (var val in jsdata.values){
        var tv_pairs = []
        for (var i=0; i<jsdata.values[val].length; i++){
            var time_value = [timelist[i], jsdata.values[val][i]]
            tv_pairs.push(time_value)
        }
        tv_pairs.sort(fN)
        var temp_obj = {
            name: val,
            type: 'line',
            lineStyle: {
                normal: {
                    width: 2.5,
                }
            },
            data:tv_pairs
        }
        temp_array.push(temp_obj)
    }


    var option = {
        title:{
            text: 'Currency trends against USD in past 30 days'
        },
        legend:{
            data:currencies
        },
        xAxis:{
            splitLine:{
                show:true
            },
            axisLabel:{
                fontSize: 13
            },
            type: 'time',
            data: timelist
        },
        yAxis: {
            type: 'value',
            nameTextStyle: {
                fontSize: 18
            },
            axisLabel:{
                fontSize: 13
            }
        },
        series:temp_array
    }
    return(option)
}


function loadCharts(){
    var myChart1 = echarts.init(document.getElementById("barChart"))
    var myChart2 = echarts.init(document.getElementById("lineChart"))
    myChart1.showLoading()
    myChart2.showLoading()
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function(){
        if (this.readyState === 4 && this.status === 200){
            var option1 = setBarOptions(this.response)
            var option2 = setLineOptions(this.response)
            myChart1.hideLoading()
            myChart2.hideLoading()
            myChart1.setOption(option1)
            myChart2.setOption(option2)
        }
    }
    xhttp.open("GET", "/data")
    xhttp.send()
}