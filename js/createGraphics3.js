
var stationData=d3.csv('./../data2/stationHeatWaveDaysProto2.csv');
var meanSumMedian=d3.csv('./../data2/HeatWaveMeanMedianSum.csv');
marginChart1 = ({top: 10, right: 20, bottom: 30, left: 20}); //10,30
marginChart2 = ({top: 10, right: 10, bottom: 10, left: 30});
chartOneWidth=300-marginChart1.left-marginChart1.right;//screen.width*0.5-marginChart1.left-marginChart1.right;//250
chartOneHeight=720-marginChart1.top-marginChart1.bottom;//screen.height-marginChart1.top-marginChart1.bottom;//430
mapWidth=500-marginChart2.left-marginChart2.right;//screen.width*0.5-chartOneWidth;
mapHeight=470-marginChart2.top-marginChart2.bottom;
//barWidth=Math.floor((screen.width-marginChart1.right-marginChart1.left)/50.0);
var yearData="Mean";
var timer;
var animationStartYear;
var narrativeYears =[1969,1975,1982,1992,1994,2007,2011,2018,2019,2020];
var narrativeData = d3.json('./../data/narrativeData.json');

var xRatio=0.45;
var yRatio=0.000;
var xRatioLegend=0.05;
var yRatioLegend=0.25;

/*if (screen.width >= 1020) {
    var xRatio=0.6;
    var yRatio=0.020;

    chartOneWidth=230-marginChart1.left-marginChart1.right;
    chartOneHeight=720-marginChart1.top-marginChart1.bottom;

    mapWidth=500-marginChart2.left-marginChart2.right;
    mapHeight=470-marginChart2.top-marginChart2.bottom;

    var xRatioLegend=0.02;
    var yRatioLegend=0.25;
}
else{
    var xRatio=0.45;
    var yRatio=0.000;
    var xRatioLegend=0.05;
    var yRatioLegend=0.25;
}*/


function adaptToScreenSize() {
    var intro1= document.getElementsByClassName("introViz");
    var intro2= document.getElementsByClassName("introViz-2");
    var stationCount= document.getElementsByClassName("stationViz");
    var chart2 = document.getElementsByClassName("viz");


    

    var w = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

    var h = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

    //console.log(w);
    //To be fixed
    if(w > 1100 ){
        intro1[0].style.maxHeight = "100vh";
        intro2[0].style.maxHeight = "100vh";
        chart2[0].style.maxHeight = "100vh";
        stationCount[0].style.maxHeight = "95vh";

        //var c2 = document.getElementById("c2");
        //console.log(c2);
        //console.log(c2.getAttribute("viewBox"));
        //c2.setAttribute("viewBox", "0 180 530 400"); //500 400
        //console.log(c2.getAttribute("viewBox"));
        //c2.style.width="75%" //75%
        //c2.style.height="110%" //110%

        //xRatio=0.68; //0.6
        xRatio=0.6; 
        yRatio=0.020;
        chartOneWidth=230-marginChart1.left-marginChart1.right;
        chartOneHeight=720-marginChart1.top-marginChart1.bottom;
        mapWidth=500-marginChart2.left-marginChart2.right;
        mapHeight=470-marginChart2.top-marginChart2.bottom;
        xRatioLegend=0.02;
        yRatioLegend=0.25;

    }
    else if( (1000<w) && (w < 1100)){
        intro1[0].style.maxHeight = "80vh";
        intro2[0].style.maxHeight = "80vh";
        chart2[0].style.maxWidth = "90vw";
        stationCount[0].style.maxHeight = "75vh";
    }
    else if( (500<w) && (w < 1000)){
        console.log(chart2[0]);
    chart2[0].style.maxWidth = "80vw";
    intro1[0].style.maxHeight = "70vh";
    intro2[0].style.maxHeight = "70vh";
    stationCount[0].style.maxHeight = "65vh";
    }
    

    if( (h < 700) && (h>625)){
        console.log('h');
        chart2[0].style.maxWidth="70vw";
        //chart2[0].style.maxHeight="0vh";
        
        var c2 = document.getElementById("c2");
        c2.setAttribute("viewBox", "-100 180 600 500"); //500 400

    }
    else if( (h < 625) && (h>400)){
        console.log('h');
        chart2[0].style.maxWidth="60vw";
        var c2 = document.getElementById("c2");
        c2.setAttribute("viewBox", "-100 180 550 450");
        

    }
}

var year = 1969;
var subStations=[];


var sweGeo = fetch('./../data/jsonSwe.json')
.then(response => response.text())
.then((data) => {
    var jData =JSON.parse(data);
    //return topojson.feature(jData,jData.objects.data);
    return topojson.feature(jData,jData.objects.data);
  });     

//Returns a radius for the circles
var radiusScale=d3.scaleLinear(
    // domain
      [ 0, 2.53 ], 
      // range
      [ '0.8%', '1.8%' ]
  );

//Calculates the radius for a given area for the circles
function radiusScaleArea(d){
    return radiusScale(Math.sqrt(d/Math.PI));
}

/*var colorRange=d3.scaleLinear().domain([ 1, 20 ])
      .range(["#fff5f0", "#99000d"]);*/

var colorRange=d3.scaleSequential().domain([1,30])
      .interpolator(d3.interpolateReds);


//Returns the radius for a station value at a given year
function getValueOfYear(d,year){
    const val = parseInt(d[year],10)
    if(val == 999){
        return radiusScaleArea(0);
    }
    return radiusScaleArea(val);
}

function getValueOfYearLegend(d){
    if(d == 999){
        return radiusScaleArea(0);
    }
    return radiusScaleArea(d);
}
//Returns the color for a station value at a given year
function getColorOfYear(d,year){
    const val = parseInt(d[year],10)
    if(val == 999){
      return '#737373';
    }
    if(val==0){
      return '#ffffff';
    }
    return colorRange(val);
}

function getColorOfYearLegend(d){
    if(d == 999){
      return '#737373';
    }
    if(d==0){
      return '#ffffff';
    }
    return colorRange(d);
}

function getColorOfYearBarFloorLegend(d){
    if(d == 999){
      return '#ffffff';
      //'#737373';
    }
    else{
      return '#000';
    }
}

function getColorOfYearBarFloor(d, year){
    const val = parseInt(d[year],10)
    if( val == 999){
      return '#ffffff';
      //'#737373';
    }
    else{
      return '#000';
    }
}

function getHeightOfYearBarFloor(d,year){
    const val = parseInt(d[year],10)
    if( val == 999){
      return "0.7%";
    }
    else{
      return '0.2%';
    }
}

function getHeightOfYearBarFloorLegend(d){
    if( d == 999){
      return "0.7%";
    }
    else{
      return '0.2%';
    }
}

function getValueOfYearRect(d,year){
    const val = parseInt(d[year],10)
    if(val == 999){
      return rectHeight(0);
    }
    return rectHeight(val);
}

function getValueOfYearRectLegend(d){
    const val = parseInt(d,10)
    if(val == 999){
      return rectHeight(0);
    }
    return rectHeight(val);
}

rectHeight=d3.scaleLinear(
    // domain
      [ 0, 30 ], 
      // range
      //[ 4, 24 ]
      [0,60]
  );



  

//Returns the number of days from each station
function getStationInfo(d){
    if(d==999){
        return "  Ingen data";
    }
    else{
        return '  '+parseInt(d,10)+' dagar';
    }
}
//Sets the year from the slider to the variable 'year'. Also calls on 'createStationCircles'
function setYear(){
    try {
        var e = document.getElementById("vizRange");
        if(window.getComputedStyle(e).display != 'none'){
        year=document.getElementById("vizRange").value; //find a solution for this
        }
      }
      catch(err) {
        console.log('error');
      }
    
    //createStationCircles();
    createStationBars();
    createScatterChartInMapChart();
    //resetStationPlot();
    //updateSelectedScatter();
    setNarrativeText();
    //updateStationWithSelected();
}

function stepperMoveBackward(){
    year=parseInt(year,10);
    if(year>1969){
        year -= 1;
        year=year.toString();
        setYear();
    }
    else{
        year="2020"
        setYear();
    }
}

function stepperMoveForward(){
    year=parseInt(year,10);
    if(year<2020){
        year += 1;
        year=year.toString();
        setYear();
    }
    else{
        year="1969"
        setYear();
    }
}

function getYear(){
    return year;
}

//Loads and draws the map and the legend
function loadMap(){
    sweGeo.then((geo) => {
    var projection= d3.geoMercator().fitSize([mapWidth*0.8,mapHeight*1.5],geo);
    var geoPath =  d3.geoPath().projection(projection);
    
    const map = d3.select('.chart2').append("g")
    .attr("class", "map")
    .selectAll("path")
    .data(geo.features)
    .join("path")
    .attr("class", "Sweden")
    .attr("fill", '#bdbdbd') //#d9d9d9
    .attr("d", geoPath);

    //Creating a legend
    var legendData=[999, 0, 5, 10, 20]
    /*for (let i = 0; i < 21; i++) {
        if( (i % 5) == 0){
            legendData.push(i);
        }
    }*/
    const legend = d3.select('.chart2').append('g');
    
    legend
    .selectAll('g')
    .data( legendData )
    .join('g')
        .attr('class', 'legendBar')
        .attr("transform", (d,i) => {
            return "translate("+mapWidth*xRatioLegend+","+(mapHeight*yRatioLegend+25*i)+")"; //mapWidth*0.8
        })
    .call(g => g
        .append('rect')
        .attr("height",d => getValueOfYearRectLegend(d))
        .attr("width","1.0%") //1.0%
        .style("fill",d => getColorOfYearLegend(d))
        .style("stroke",'#000')
        .style("stroke-width",'0.1%')
        .style("opacity","0.7")
    )
    .call(
        g => g
        .append('rect')
        .style('stroke','#000')
        .style('stroke-width','0.1%')
        .attr("height",d => getHeightOfYearBarFloorLegend(d))
        .attr("width","2.0%")
        .style("fill",d => getColorOfYearBarFloorLegend(d))
        .attr('transform', function(d){
            return 'translate('+-mapWidth*0.005+','+ getValueOfYearRectLegend(d) +')';
        })

    )
    .call(g => g
        .append('text')
        .attr('x', '3%') //d => getValueOfYearLegend(d)
        .attr('y', d => getValueOfYearRectLegend(d)/2)
        .attr('dy', '0.35em')
        .text(d=> getStationInfo(d))
        );
    
    const place = d3.select('.chart2').append('g')
    .selectAll('g')
    .data([1])
    .join('g')
    .attr("class", "narrativePlaceLegend")
    .attr("transform", (d,i) => {
        return "translate("+mapWidth*xRatioLegend+","+(mapHeight*yRatioLegend+10+25*6)+")";
    })
    .call( g =>g
        .append('path')
        .attr("d",d3.symbol().type(d3.symbolStar))
        .style("fill",'#3182bd')
        .style("stroke",'#000')
        .style("stroke-width",'0.1%')
        .style("opacity","0.5")
    )
    .call(g => g
        .append('text')
        .attr('x', '3%') //d => getValueOfYearLegend(d)
        .attr('dy', '0.35em')
        .text("Fakta plats")
        );
    

 });
   
}

//Creates the circles that represents each station
function createStationCircles(){
    stationData.then(function(stations){
        //stationsSorted=stations["2018"].sort(d3.descending);
        var stationPosition=[];
        sweGeo.then(function(geo) {
            //Creates the projection for setting the circle position
            var projection= d3.geoMercator().fitSize([mapWidth,mapHeight],geo);
            //Creates a list with the station positions
            for (let i = 0; i < stations.length; i++) {
            var coord = projection([stations[i].Longitude,stations[i].Latitude]);
            var txt= "translate(" + coord + ")";
            stationPosition.push(txt);
            }
            //Removes the circles so that new circles can be drawn when switching year
            //It would be useful to solve the drawing in an other way. Is it better to update
            // the current circles rather than deleting them?
            d3.selectAll('.station').remove();
            d3.selectAll('.stationCenter').remove();

            //Sets the year text
            const info = d3.select('.chart2 .yearText')
            .attr('font-size', '1em')
            .attr('font-color', "#000")
            .join("text")
            .text('År: '+year).raise();
            
            //Creates the circles for each station
            const circles = d3.select('.chart2').append('g')
            .attr("class", "station")
            .selectAll('circle')
            .data( stations )
            .join('circle')
            
            circles
                .attr("r",d => getValueOfYear(d,year))
                .style("fill",d=>getColorOfYear(d,year))
                .style("stroke",'#000')
                .style("stroke-width",'0.1%')
                .style("opacity","0.5")
                .attr("transform", (d,i) => {
                    return stationPosition[i];
                })
                .on("mouseover", function (d,c) {
                    d3.select(this)
                    .style("stroke-width",'0.3%')
                    .raise();
                    d3.select(".chart2 .stationText").text(c['Name']+': '+getStationInfo(c[year])).raise();
                    }
                )
            .on("mouseout", function (d) {
            d3.select(this)
            .style("stroke-width",'0.1%');
            d3.select(".chart2 .stationText").text("");
            //d3.select(".infobox").style('visibility', 'hidden');
            })
            .on('click', function(d,i){
                subStations.push(i.ID);
                createStationScatter();
            })
            //Creating a center point for each circle
            const circleCenter = d3.select('.chart2').append('g')
                .attr("class", "stationCenter")
                .selectAll('circle')
                .data( stations )
                .join('circle')

            circleCenter
                .attr("r",'0.1%')
                .style("fill",'#000')
                .attr("transform", (d,i) => {
                    return stationPosition[i];
                });
                 
        });
    });
}


function createStationBars(){
    stationData.then(function(stations){
        //stationsSorted=stations["2018"].sort(d3.descending);
        var stationPosition=[];
        sweGeo.then(function(geo) {
            //Creates the projection for setting the circle position
            var projection= d3.geoMercator().fitSize([mapWidth*0.8,mapHeight*1.5],geo);
            //Creates a list with the station positions
            for (let i = 0; i < stations.length; i++) {
            var coord = projection([stations[i].Longitude,stations[i].Latitude]);
            //var txt= "translate(" + coord + ")";
            stationPosition.push(coord);

            }
            //Removes the circles so that new circles can be drawn when switching year
            //It would be useful to solve the drawing in an other way. Is it better to update
            // the current circles rather than deleting them?
            d3.selectAll('.station').remove();
            d3.selectAll('.stationFloor').remove();

            //Sets the year text
            const info = d3.select('.chart2 .yearText')
            .attr('font-size', '1em')
            .attr('font-color', "#000")
            .join("text")
            .text('År: '+year).raise();
            
            const bars = d3.select('.chart2').append('g')
            .attr("class", "station")
            .selectAll('rect')
            .data( stations )
            .join('rect')
    bars
       .attr("id", d => d.Name)
       .attr("height",d => getValueOfYearRect(d,year))
       .attr("width","1.0%")
       .style("fill",d=>getColorOfYear(d,year))
       .style("stroke",'#000')
       .style('stroke-width', (d) => {
        if(subStations.length>0){
            if(subStations.includes(d.Name)){
                //console.log("bar stroke");
                return "0.5%";

            }
            else{
                return "0.1%";
            }
        }
        else{
            return "0.1%";
        }
       })
       .style("opacity", (d) => {
        if(subStations.length>0){
            if(subStations.includes( d.Name)){
                return "0.7";
            }
            else{
                return "0.1"; //0.3
            }
        }
        else{
            return "0.7";
        }
       })
       .attr("transform", function(d,i) {
        var pos="translate(" +stationPosition[i][0].toString()+","+ (stationPosition[i][1]-getValueOfYearRect(d,year)).toString()+ ")";
        return pos;
        }
    )
        .on("mouseover", function (d,c) {
        if(!subStations.includes(c.Name)){ 
            d3.select(this)
            .style("stroke-width",'0.2%');
        }
            d3.select(this).raise();
            d3.select(".chart2 .stationText").text(c['Name']+': '+getStationInfo(c[year])).raise();
    })
    .on("mouseout", function (d,i) {
        if(!subStations.includes(i.Name)){
            d3.select(this)
            .style("stroke-width",'0.1%');
        }
        d3.select(".chart2 .stationText").text("");
        //d3.select(".infobox").style('visibility', 'hidden');
    })
    /*.on('click', function(d,i){

        if(subStations.includes(i.Name)){
            subStations = subStations.filter(item => item !== i.Name)
            d3.select(this).style("stroke-width",'0.2%');
        }
        else{
            subStations.push(i.Name);
            d3.select(this).style("stroke-width",'0.5%').style("opacity","0.7");
        }
        createStationPlot();
        d.stopPropagation();
            
            });*/

    const barsFloor = d3.select('.chart2').append('g')
        .attr("class", "stationFloor")
        .selectAll('rect')
        .data( stations )
        .join('rect');
    
    barsFloor
        .attr("id", d => d.Name+"_Floor")
        .attr("height",d => getHeightOfYearBarFloor(d,year))
        .attr("width","2.0%")
        .style('stroke','#000')
        .style('stroke-width', (d) => {
            if(subStations.length>0){
                if(subStations.includes(d.Name)){
                    return "0.3%";
                }
                else{
                    return "0.1%";
                }
            }
            else{
                return "0.1%";
            }
           })
        .style("opacity", (d) => {
            if(subStations.length>0){
                if(subStations.includes( d.Name)){
                    return "1";
                }
                else{
                    return "0.3";
                }
            }
            else{
                return "1";
            }
           })
        .style("fill",d => getColorOfYearBarFloor(d,year))
        .attr("transform", function(d,i) {
            var pos="translate(" +(stationPosition[i][0]-mapWidth*0.005).toString()+","+ stationPosition[i][1].toString()+ ")";
            return pos;
            }
        )
        .on("mouseover", function (d,c) {
            if(!subStations.includes(c.Name)){ 
                //var val= parseFloat(d3.select(this).style('height').split('%')[0],10);
                d3.select(this)
                //.attr("height",(val+0.2)+'%');
                .style('stroke-width','0.3%').raise();
            }
                d3.select(this).raise();
                d3.select(".chart2 .stationText").text(c['Name']+': '+getStationInfo(c[year])).raise();
        })
        .on("mouseout", function (d,i) {
            if(!subStations.includes(i.Name)){
                //var val= parseFloat(d3.select(this).style('height').split('%')[0],10);
                d3.select(this)
                //.attr("height",(val-0.2)+'%');
                .style('stroke-width','0.1%').lower();
            }
            d3.select(".chart2 .stationText").text("");
            //d3.select(".infobox").style('visibility', 'hidden');
        });

    });
    });
}

function createStackedBarChart(){
    var stackedData=d3.csv('./../data2/stackedMean.csv');
    marginStacked =  ({top: 10, right: 20, bottom: 30, left: 20});
    stackedWidth=400-marginStacked.left-marginStacked.right;//screen.width*0.5-marginChart1.left-marginChart1.right;//250
    stackedHeight=720-marginStacked.top-marginStacked.bottom;

    stackedData.then(function(data){

        var xTrans=125;

        xMax = d3.max(data, d => parseInt(d['HighTemp'],10)+parseInt(d['Class1'],10)+parseInt(d['Class2'],10));
        yDomain = data.map(d => parseInt(d.Year, 10));
        

        xScale = d3.scaleLinear()
        .domain([ 0, xMax ])
        .range([stackedWidth - marginStacked.left - marginStacked.right , marginStacked.right ]);
        //.range([marginStacked.right,stackedWidth - marginStacked.left - marginStacked.right  ]);

        yScale = d3.scaleBand()
            .domain( yDomain )
            .range([ marginStacked.top+20, stackedHeight - marginStacked.bottom ])
            //.range([ stackedHeight - marginStacked.bottom, marginStacked.top+20,  ]) //
            .padding(0.1)
        /*yScale = d3.scaleLinear()
        .domain([ 1969, 2020 ])
        .range([ marginStacked.top+20, stackedHeight - marginStacked.bottom ]);*/

        xAxis = d3.axisBottom(xScale)
        .tickSizeOuter(0).ticks(10);

        var tickVals =[]
         for (let i = 1969; i < 2021; i+=3) {
            tickVals.push(
                (i).toString()
            );
        }

        yAxis = d3.axisRight(yScale)
        .tickSizeOuter(0).tickValues(tickVals);

        colors = d3.scaleOrdinal(
            ['HighTemp','Class1','Class2'],
            d3.schemeReds[6].slice(2)
          )

        stack = d3.stack()
            .keys( ['HighTemp','Class1','Class2'] )


        const chartData = stack( data ) 

        const groups = d3.select('.barStacked').append('g')
            .selectAll('g')
            .data( chartData )
            .join('g')
            .style('fill', (d,i) => colors(d.key))
        
        groups.selectAll('rect')
        // Now we place the rects, which are the children of the layer array
        .data(d => d)
        .join('rect')
            .attr("transform", `translate(${xTrans},0)`)
            .attr('x', d => xScale(d[1]))
            .attr('y', d => yScale(d.data.Year))
            .attr('height', yScale.bandwidth())
            .attr('width', d => xScale(d[0]) - xScale(d[1]))
            //.attr('width', d => stackedWidth+xScale(d[0]) - xScale(d[1]))
    
        d3.select('.barStacked').append('g')
        .attr('transform', `translate(${xTrans},${ stackedHeight - marginStacked.bottom })`)
        .attr('color','gainsboro')
        .call(xAxis);

        d3.select('.barStacked').append("text")
            .style("font-size", "100%")
            .attr("text-anchor", "end")
            .attr('fill','gainsboro')
            .attr("transform", `translate(${xTrans},0)`)
            .attr("x", stackedWidth/2 + 70)
            .attr("y", stackedHeight+10)
            .text("Antal dagar");
        
        d3.select('.barStacked').append('g')
        .attr('transform', `translate(${xTrans+stackedWidth - marginStacked.right - marginStacked.left},0)`)
        //.attr('transform', `translate(${xTrans+marginStacked.right},0)`)
        .attr('color','gainsboro')
        .style('font-size','80%')
        .call(yAxis)

        d3.select(".barStacked").append("text")
            .style("font-size", "100%")
            .attr("text-anchor", "end")
            .attr('fill','gainsboro')
            .attr("transform", `translate(${xTrans},0)`)
            //.attr("transform", `translate(${-xTrans-marginStacked.left},0)`)
            //.attr("x", stackedWidth-70)
            .attr("x", stackedWidth+50)
            .attr("y", stackedHeight/2)
            //.attr("dy", ".75em")
            //.attr("transform", "rotate(-90)")
            .text("Årtal");


    //Creating legend
        
    var legendData = ["Höga temperaturer","Mycket höga temperaturer","Extremt höga temperaturer"]
    colorsLegend = d3.scaleOrdinal(
        ["Höga temperaturer","Mycket höga temperaturer","Extremt höga temperaturer"],
        d3.schemeReds[6].slice(2)
      );
    const legend = d3.select('.barStacked').append('g');
    
    legend
    .selectAll('g')
    .data( legendData )
    .join('g')
        .attr('class', 'legendBar')
        .attr("transform", (d,i) => {
            return "translate("+0+","+(marginStacked.top+40+25*i)+")"; //mapWidth*0.8
        })
    .call(g => g
        .append('rect')
        .attr("height","2%")
        .attr("width","2.5%") //1.0%
        .style("fill",(d) => colorsLegend(d))
        .style("stroke",'#000')
        .style("stroke-width",'0.1%')
        .style("opacity","1")
    )
    .call(g => g
        .append('text')
        .attr('x', '4%') //d => getValueOfYearLegend(d)
        .attr('y', "1.0%")
        .attr('dy', '0.35em')
        .attr("fill","#e6e6e6")
        .text(d => d)
        );
    


    });


}

function createStackedBarChartTropical(){
    var stackedData=d3.csv('./../data2/stackedMinHeatWaveMean.csv');
    marginStacked =  ({top: 10, right: 20, bottom: 30, left: 20});
    stackedWidth=400-marginStacked.left-marginStacked.right;//screen.width*0.5-marginChart1.left-marginChart1.right;//250
    stackedHeight=720-marginStacked.top-marginStacked.bottom;

    stackedData.then(function(data){

        var xTrans=125;

        xMax = d3.max(data, d => parseInt(d['HeatWave'],10)+parseInt(d['Min'],10));
        yDomain = data.map(d => parseInt(d.Year, 10));
        

        xScale = d3.scaleLinear()
        .domain([ 0, xMax ])
        .range([stackedWidth - marginStacked.left - marginStacked.right , marginStacked.right ]);
        //.range([marginStacked.right,stackedWidth - marginStacked.left - marginStacked.right  ]);

        yScale = d3.scaleBand()
            .domain( yDomain )
            .range([ marginStacked.top+20, stackedHeight - marginStacked.bottom ])
            //.range([ stackedHeight - marginStacked.bottom, marginStacked.top+20,  ]) //
            .padding(0.1)
        /*yScale = d3.scaleLinear()
        .domain([ 1969, 2020 ])
        .range([ marginStacked.top+20, stackedHeight - marginStacked.bottom ]);*/

        xAxis = d3.axisBottom(xScale)
        .tickSizeOuter(0).ticks(10);

        var tickVals =[]
         for (let i = 1969; i < 2021; i+=3) {
            tickVals.push(
                (i).toString()
            );
        }

        yAxis = d3.axisRight(yScale)
        .tickSizeOuter(0).tickValues(tickVals);

        colors = d3.scaleOrdinal(
            ['HeatWave','Min'],
            ['#feb24c','#ffeda0']
          )

        stack = d3.stack()
            .keys( ['HeatWave','Min'] )


        const chartData = stack( data ) 

        const groups = d3.select('.barStacked-2').append('g')
            .selectAll('g')
            .data( chartData )
            .join('g')
            .style('fill', (d,i) => colors(d.key))
        
        groups.selectAll('rect')
        // Now we place the rects, which are the children of the layer array
        .data(d => d)
        .join('rect')
            .attr("transform", `translate(${xTrans},0)`)
            .attr('x', d => xScale(d[1]))
            .attr('y', d => yScale(d.data.Year))
            .attr('height', yScale.bandwidth())
            .attr('width', d => xScale(d[0]) - xScale(d[1]))
            //.attr('width', d => stackedWidth+xScale(d[0]) - xScale(d[1]))
    
        d3.select('.barStacked-2').append('g')
        .attr('transform', `translate(${xTrans},${ stackedHeight - marginStacked.bottom })`)
        .attr('color','gainsboro')
        .call(xAxis);

        d3.select('.barStacked-2').append("text")
            .style("font-size", "100%")
            .attr("text-anchor", "end")
            .attr('fill','gainsboro')
            .attr("transform", `translate(${xTrans},0)`)
            .attr("x", stackedWidth/2 + 70)
            .attr("y", stackedHeight+10)
            .text("Antal dagar");
        
        d3.select('.barStacked-2').append('g')
        .attr('transform', `translate(${xTrans+stackedWidth - marginStacked.right - marginStacked.left},0)`)
        //.attr('transform', `translate(${xTrans+marginStacked.right},0)`)
        .attr('color','gainsboro')
        .style('font-size','80%')
        .call(yAxis)

        d3.select(".barStacked-2").append("text")
            .style("font-size", "100%")
            .attr("text-anchor", "end")
            .attr('fill','gainsboro')
            .attr("transform", `translate(${xTrans},0)`)
            //.attr("transform", `translate(${-xTrans-marginStacked.left},0)`)
            //.attr("x", stackedWidth-70)
            .attr("x", stackedWidth+50)
            .attr("y", stackedHeight/2)
            //.attr("dy", ".75em")
            //.attr("transform", "rotate(-90)")
            .text("Årtal");


    //Creating legend
        
    var legendData = ["Värmebölja","Tropiska dygn"]
    colorsLegend = d3.scaleOrdinal(
        ["Värmebölja","Tropiska dygn"],
        ['#feb24c','#ffeda0']
      );
    const legend = d3.select('.barStacked-2').append('g');
    
    legend
    .selectAll('g')
    .data( legendData )
    .join('g')
        .attr('class', 'legendBar-2')
        .attr("transform", (d,i) => {
            return "translate("+0+","+(marginStacked.top+40+25*i)+")"; //mapWidth*0.8
        })
    .call(g => g
        .append('rect')
        .attr("height","2%")
        .attr("width","2.5%") //1.0%
        .style("fill",(d) => colorsLegend(d))
        .style("stroke",'#000')
        .style("stroke-width",'0.1%')
        .style("opacity","1")
    )
    .call(g => g
        .append('text')
        .attr('x', '4%') //d => getValueOfYearLegend(d)
        .attr('y', "1.0%")
        .attr('dy', '0.35em')
        .attr("fill","#e6e6e6")
        .text(d => d)
        );
    


    });


}

function createStationCountBarChart(){
    var stackedData=d3.csv('./../data2/stationCount.csv');
    marginStacked =  ({top: 40, right: 20, bottom: 30, left: 20});
    stackedWidth=400-marginStacked.left-marginStacked.right;//screen.width*0.5-marginChart1.left-marginChart1.right;//250
    stackedHeight=720-marginStacked.top-marginStacked.bottom;

    stackedData.then(function(data){

        var xTrans=125;

        xMax = d3.max(data, d => parseInt(d['AmountOfStations'],10));
        yDomain = data.map(d => parseInt(d.Year, 10));
        

        xScale = d3.scaleLinear()
        .domain([ 0, xMax ])
        .range([stackedWidth - marginStacked.left - marginStacked.right , marginStacked.right ]);
        //.range([marginStacked.right,stackedWidth - marginStacked.left - marginStacked.right  ]);

        yScale = d3.scaleBand()
            .domain( yDomain )
            .range([ marginStacked.top+20, stackedHeight - marginStacked.bottom ])
            //.range([ stackedHeight - marginStacked.bottom, marginStacked.top+20,  ]) //
            .padding(0.1)
        /*yScale = d3.scaleLinear()
        .domain([ 1969, 2020 ])
        .range([ marginStacked.top+20, stackedHeight - marginStacked.bottom ]);*/

        xAxis = d3.axisBottom(xScale)
        .tickSizeOuter(0).ticks(10);

        var tickVals =[]
         for (let i = 1969; i < 2021; i+=3) {
            tickVals.push(
                (i).toString()
            );
        }

        yAxis = d3.axisRight(yScale)
        .tickSizeOuter(0).tickValues(tickVals);

        colors = d3.scaleOrdinal(
            ['AmountOfStations'],
            ['#fc9272']
          )

        stack = d3.stack()
            .keys( ['AmountOfStations'] )


        const chartData = stack( data ) 

        const groups = d3.select('.barStation').append('g')
            .selectAll('g')
            .data( chartData )
            .join('g')
            .style('fill', (d,i) => colors(d.key))
        
        groups.selectAll('rect')
        // Now we place the rects, which are the children of the layer array
        .data(d => d)
        .join('rect')
            .attr("transform", `translate(${xTrans},0)`)
            .attr('x', d => xScale(d[1]))
            .attr('y', d => yScale(d.data.Year))
            .attr('height', yScale.bandwidth())
            .attr('width', d => xScale(d[0]) - xScale(d[1]))
            //.attr('width', d => stackedWidth+xScale(d[0]) - xScale(d[1]))
    
        d3.select('.barStation').append('g')
        .attr('transform', `translate(${xTrans},${ stackedHeight - marginStacked.bottom })`)
        .attr('color','gainsboro')
        .style('font-size','80%')
        .call(xAxis);

        d3.select('.barStation').append("text")
            .style("font-size", "100%")
            .attr("text-anchor", "end")
            .attr('fill','gainsboro')
            .attr("transform", `translate(${xTrans},0)`)
            .attr("x", stackedWidth/2 + 70)
            .attr("y", stackedHeight+10)
            .text("Antal stationer");
        
        d3.select('.barStation').append('g')
        .attr('transform', `translate(${xTrans+stackedWidth - marginStacked.right - marginStacked.left},0)`)
        //.attr('transform', `translate(${xTrans+marginStacked.right},0)`)
        .attr('color','gainsboro')
        .style('font-size','80%')
        .call(yAxis)

        d3.select(".barStation").append("text")
            .style("font-size", "100%")
            .attr("text-anchor", "end")
            .attr('fill','gainsboro')
            .attr("transform", `translate(${xTrans},0)`)
            //.attr("transform", `translate(${-xTrans-marginStacked.left},0)`)
            //.attr("x", stackedWidth-70)
            .attr("x", stackedWidth+50)
            .attr("y", stackedHeight/2)
            //.attr("dy", ".75em")
            //.attr("transform", "rotate(-90)")
            .text("Årtal");

    });


}
//Creates the bar chart showing the mean value
function createScatterChart(){
    meanSumMedian.then(function(data){

        xMax = d3.max(data, d => parseInt(d[yearData],10));
        yDomain = data.map(d => parseInt(d.Year, 10));

        xScale = d3.scaleLinear()
        .domain([ 0, xMax +1 ])
        .range([chartOneWidth - marginChart1.left - marginChart1.right , marginChart1.right ]);

        yScale = d3.scaleBand()
            .domain( yDomain )
            .range([ marginChart1.top+20, chartOneHeight - marginChart1.bottom ]) //
            .padding(0.5)

        xAxis = d3.axisBottom(xScale)
        .tickSizeOuter(0);

        yAxis = d3.axisRight(yScale)
        .tickSizeOuter(0);


        d3.selectAll('.mainLine').remove();
        var lineMain = d3.line()
            .x(function(d) { 
                return xScale(d[yearData]); })
            .y(function(d) { 
                return yScale(d.Year); })
            .curve(d3.curveLinear);

       
        d3.select(".chart1").append("g")
        .attr("class", 'mainLine')
        .selectAll('path')
        .data(data)
        .join('path')
            .attr('d', lineMain(data))
            .style('stroke','#d9d9d9')
            .style('stroke-width', '0.5%')
            .attr("fill", 'transparent');
            

       
        d3.selectAll('.scatter').remove();
        const scatter = d3.select(".chart1").append('g')
        .selectAll('g')
        .data( data )
        .join('g');
        
        scatter
            .attr('class', 'scatter')
            .attr('transform', d => `translate(${xScale(d[yearData])},${yScale(d.Year)})`)
            .call(g => g
                // first we append a circle to our data point
                .append('circle')
                //.attr('transform',`translate(0,1)`)
                .attr('r', '1.0%')
                .style('fill', '#d9d9d9')
                .style('stroke-width','0.05%')
                .style('stroke', '#000')
                .on('click',function(d,i){
                    var allScatter=scatter.nodes();
                    d3.selectAll('.scatter').each((k,j) =>{
                        if(k.Year==i.Year){
                            //d3.select(this).style('stroke-width','0.2%');
                            d3.select(allScatter[j]).select('circle').style('fill','#fc9272')
                            .style('stroke-width','0.2%')
                            .style('stroke','#99000d');
                            year=i.Year;
                            document.getElementById("vizRange").value=i.Year;
                            //setYearValueText(i[yearData]);
                            //createStationCircles();
                            setYear();
    
                        }
                        else{
                            d3.select(allScatter[j]).select('circle').style('stroke-width','0.05%')
                            .style('fill', '#d9d9d9')
                            .style('stroke', '#000');
                            
                        }
                    });
                })
              );

        
        d3.selectAll('.x-axis').remove();
        d3.selectAll('.y-axis').remove();
        d3.selectAll('.x-label').remove();
        d3.selectAll('.y-label').remove();

        // Here the x axis is rendered
        d3.select(".chart1").append('g')
            .attr('class', 'x-axis')
            .style("font-size", "30%")
            .style("stroke-width","0.15%")
            .attr('transform', `translate(0,${ chartOneHeight - marginChart1.bottom })`)
            .call( xAxis );

            d3.select(".chart1").append("text")
            .attr("class", "x-label")
            .style("font-size", "30%")
            .attr("text-anchor", "end")
            .attr("x", chartOneWidth/2)
            .attr("y", chartOneHeight)
            .text("Antal mätningar");
        
        // Y axis is rendered
        d3.select(".chart1").append('g')
            .attr('class', 'y-axis')
            .style("font-size", "40%")
            .style("stroke-width","0.15%")
            .attr('transform', `translate(${ chartOneWidth - marginChart1.right - marginChart1.left},0)`)
            .call( yAxis );
            
        
        d3.select(".chart1").append("text")
            .attr("class", "y-label")
            .style("font-size", "30%")
            .attr("text-anchor", "end")
            .attr("x", chartOneWidth)
            .attr("y", chartOneHeight/2)
            //.attr("dy", ".75em")
            //.attr("transform", "rotate(-90)")
            .text("Årtal");
        
       updateSelectedScatter();

    })

}

function createScatterChartInMapChart(){
    meanSumMedian.then(function(data){

        if(yearData == "None"){
            updateSelectedScatter();
            return;
        }

        if(subStations.length>0){
            xMaxData = d3.max(data, d => parseInt(d[yearData],10));
            xMaxStation = d3.max(transformedData, (d) => {
                if(d.Value == 999){
                    return 0;
                }
                else{
                    return d.Value;
                }
                });

            xMax = d3.max([xMaxData,xMaxStation]);

        }
        else{
            xMax = d3.max(data, d => parseInt(d[yearData],10));

            
        }

       
        
        yDomain = data.map(d => parseInt(d.Year, 10));

        xScale = d3.scaleLinear()
        .domain([ 0, xMax+1])
        .range([chartOneWidth - marginChart1.left - marginChart1.right , marginChart1.right ]);


        yScale = d3.scaleBand()
            .domain( yDomain )
            .range([ marginChart1.top+20, chartOneHeight - marginChart1.bottom ]) //
            .padding(0.5)

        xAxis = d3.axisBottom(xScale)
        .tickSizeOuter(0).ticks(4);

        var tickVals =[]
         for (let i = 1969; i < 2021; i+=3) {
            tickVals.push(
                (i).toString()
            );
        }

        yAxis = d3.axisRight(yScale)
        .tickSizeOuter(0).tickValues(tickVals);

        /*brush = d3.brush()
        .extent([ [mapWidth*xRatio , 0 ], [ mapWidth, mapHeight] ])
        .on('brush', brushing)

        d3.select( '.chart2' )
        .call( brush );*/

        /*function make_x_gridlines() {	
            return d3.axisBottom(xScale).ticks(4);
        }
        
        
        d3.select(".chart2").append('g')		
        .attr("class", "grid")
        .attr('transform', `translate(${mapWidth*xRatio},${mapHeight*yRatio+ chartOneHeight - marginChart1.bottom })`)
        .call(make_x_gridlines()
            .tickSize(-(mapHeight*yRatio -40+ chartOneHeight - marginChart1.bottom))
            .tickFormat("")
        ).style("opacity", "0.1")
        .style("stroke","#f0f0f0").lower()*/

        // add the X gridlines
        d3.selectAll('.grid').remove();

        d3.select(".chart2").append('g')		
        .attr("class", "grid")
        .attr('transform', `translate(${mapWidth*xRatio},${mapHeight*yRatio+ chartOneHeight - marginChart1.bottom })`)
        .selectAll("line")
        .data(xScale.ticks(4))
        .join("line")
        .attr("class", "gridLine")
        .attr("x1", d =>   xScale(d))
        .attr("x2", d =>   xScale(d))
        .attr("y1", 0)
        .attr("y2", -(chartOneHeight-marginChart1.top - mapHeight*yRatio - marginChart1.bottom-10 ))
        .style("opacity", "0.1")
        .style("stroke","#000");

        d3.select(".chart2").select(".grid").lower();
        


        //console.log(xScale.ticks(4));

        /*d3.select(".chart2").append('g').attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.1)
        .call(g => g.append("g")
      .selectAll("line")
      .data(xScale.ticks())
      .join("line")
        .attr("x1", d => 0.5 + xScale(d))
        .attr("x2", d => 0.5 + xScale(d))
        .attr("y1", margin.top)
        .attr("y2", height - margin.bottom))*/
    
        


        d3.selectAll('.mainLine').remove();
        var lineMain = d3.line()
            .x(function(d) { 
                return xScale(d[yearData]); })
            .y(function(d) { 
                return yScale(d.Year); })
            .curve(d3.curveLinear);
        
        //const chart1 = d3.select(".chart2").append("g").attr("class", 'chart1');
       
        //chart1.append('g') //.attr("class", 'mainLine') 
        d3.select(".chart2").append("g")
        .attr("class", 'mainLine')  
        .selectAll('path')
        .data(data)
        .join('path')
            .attr("transform", (d) => {
                return "translate("+mapWidth*xRatio+","+mapHeight*yRatio+")"; //mapHeight*yRatio
            })
            .attr('d', lineMain(data))
            .style('stroke','#d9d9d9') //
            .style('stroke-width', '0.5%')
            .attr("fill", 'transparent');
            

       
        d3.selectAll('.scatter').remove();
        const scatter = d3.select(".chart2").append('g')//chart1.append('g') //d3.select(".chart2").append('g')
        .selectAll('g')
        .data( data )
        .join('g')

        scatter
            .attr('class', 'scatter')
            .attr('transform', d => `translate(${mapWidth*xRatio+xScale(d[yearData])},${mapHeight*yRatio+yScale(d.Year)})`) //mapHeight*yRatio
            .call(g => g
                // first we append a circle to our data point
                .append('circle')
                //.attr('transform',`translate(0,1)`)
                .attr('r', '1.5%')
                .style('fill', '#d9d9d9')
                .style('stroke-width','0.05%')
                .style('stroke', '#000')
                .on('click',function(d,i){
                    var allScatter=scatter.nodes();
                    d3.selectAll('.scatter').each((k,j) =>{
                        if(k.Year==i.Year){
                            //d3.select(this).style('stroke-width','0.2%');
                            d3.select(allScatter[j]).select('circle').style('fill','#fc9272')
                            .style('stroke-width','0.2%')
                            .style('stroke','#99000d');
                            year=i.Year;
                            //document.getElementById("vizRange").value=i.Year;
                            try {
                                var e = document.getElementById("vizRange");
                                if(window.getComputedStyle(e).display != 'none'){
                                document.getElementById("vizRange").value = i.Year; //find a solution for this
                                }
                              }
                              catch(err) {
                                console.log('error');
                              }



                            //setYearValueText(i[yearData]);
                            //createStationCircles();
                            setYear();
    
                        }
                        else{
                            d3.select(allScatter[j]).select('circle').style('stroke-width','0.05%')
                            .style('fill', '#d9d9d9')
                            .style('stroke', '#000');
                            
                        }
                    });
                    d.stopPropagation(); })
              );
        

        let svg = document.getElementById('c2');
        var pt = svg.createSVGPoint();  // Created once for document
        
        function alert_coords(evt) {
            pt.x = evt.clientX;
            pt.y = evt.clientY;
        
            // The cursor point, translated into svg coordinates
            var cursorpt =  pt.matrixTransform(svg.getScreenCTM().inverse());
            //console.log("(" + cursorpt.x + ", " + cursorpt.y + ")");
            return cursorpt;
        }
        
        d3.selectAll('.chart2').on('click', function(d,i){
            //console.log(d);
            let cc = alert_coords(d);
            let tempMin = 12000;
            let index= 20000;

            if(yearData=="None"){

                if(subStations.length < 1){
                    return;
                }
                var allScatter=d3.selectAll(".scatterStation").nodes();
                var scattYear=0;

                for(let i=0; i<allScatter.length; i++){
                    var split = d3.select(allScatter[i]).attr('transform').split(/[(]|[)]|[,]/);
                    var x=parseFloat(split[1],10);
                    var y=parseFloat(split[2],10);
                    console.log("inne nivå 2");
        
                    var dist = Math.sqrt((x - cc.x)**2 + (y-cc.y)**2);
                    if(dist < tempMin){
                        tempMin=dist;
                        index=i;
                        scattYear=d3.selectAll('.scatterStation').data()[i].Year;
                        //console.log(d3.selectAll('.scatterStation').data()[i].Year);
    
                    }
                }
                    
                    d3.selectAll('.scatterStation').each((k,j) =>{
                        if(k.Year==scattYear){
                            //d3.select(this).style('stroke-width','0.2%');
                            d3.select(allScatter[j]).select('circle')
                            .style('stroke-width','0.2%')
                            year=k.Year;
                            //document.getElementById("vizRange").value=i.Year;
                            try {
                                var e = document.getElementById("vizRange");
                                if(window.getComputedStyle(e).display != 'none'){
                                document.getElementById("vizRange").value = k.Year; //find a solution for this
                                }
                                }
                                catch(err) {
                                console.log('error');
                                }
                            setYear();
    
                        }
                        else{
                            d3.select(allScatter[j]).select('circle').style('stroke-width','0.05%')
                            
                        }
                    });

            }
            else{
            var allScatter=scatter.nodes();

            for(let i=0; i<allScatter.length; i++){
                var split = d3.select(allScatter[i]).attr('transform').split(/[(]|[)]|[,]/);
                var x=parseFloat(split[1],10);
                var y=parseFloat(split[2],10);
    
                var dist = Math.sqrt((x - cc.x)**2 + (y-cc.y)**2);
                if(dist < tempMin){
                    tempMin=dist;
                    index=i;

                }
            }
                
                d3.selectAll('.scatter').each((k,j) =>{
                    if(j==index){
                        //d3.select(this).style('stroke-width','0.2%');
                        d3.select(allScatter[j]).select('circle').style('fill','#fc9272')
                        .style('stroke-width','0.2%')
                        .style('stroke','#99000d');
                        year=k.Year;
                        //document.getElementById("vizRange").value=i.Year;
                        try {
                            var e = document.getElementById("vizRange");
                            if(window.getComputedStyle(e).display != 'none'){
                            document.getElementById("vizRange").value = k.Year; //find a solution for this
                            }
                            }
                            catch(err) {
                            console.log('error');
                            }
                        setYear();

                    }
                    else{
                        d3.select(allScatter[j]).select('circle').style('stroke-width','0.05%')
                        .style('fill', '#d9d9d9')
                        .style('stroke', '#000');
                        
                    }
                });
            }
        })

        
        d3.selectAll('.x-axis').remove();
        d3.selectAll('.y-axis').remove();
        d3.selectAll('.x-label').remove();
        d3.selectAll('.y-label').remove();
        

        // Here the x axis is rendered
        d3.select(".chart2").append('g')
            .attr('class', 'x-axis')
            .style("font-size", "80%")
            .style("stroke-width","0.15%")
            .attr('transform', `translate(${mapWidth*xRatio},${mapHeight*yRatio+ chartOneHeight - marginChart1.bottom })`) //mapHeight*yRatio
            .call( xAxis );
        
            
            d3.select(".chart2").append("text")
            .attr("class", "x-label")
            .style("font-size", "80%")
            .attr("text-anchor", "end")
            .attr("x",30 + mapWidth*xRatio+chartOneWidth/2)
            .attr("y", 10+mapHeight*yRatio+chartOneHeight) //mapHeight*yRatio
            .text("Antal mätningar"); //"Antal mätningar"
        
        // Y axis is rendered
        d3.select(".chart2").append('g')
            .attr('class', 'y-axis')
            .style("font-size", "80%")
            .style("stroke-width","0.15%")
            .attr('transform', `translate(${mapWidth*xRatio+ chartOneWidth - marginChart1.right - marginChart1.left},${mapHeight*yRatio})`) //mapHeight*yRatio
            .call( yAxis );
            
        
        d3.select(".chart2").append("text")
            .attr("class", "y-label")
            .style("font-size", "80%")
            .attr("text-anchor", "end")
            .attr("x", mapWidth*xRatio+chartOneWidth*1.12)
            .attr("y", mapHeight*yRatio+chartOneHeight/2) //mapHeight*yRatio
            //.attr("dy", ".75em")
            //.attr("transform", "rotate(-90)")
            .text("Årtal");
        
       updateSelectedScatter();

    })

}
//Not used
function brushing({selection}){

    if( selection === null ) {

        return;
  
      } else {
        var allScatter = d3.selectAll(".scatter").nodes();
        // First get the selection x coords in one array and the selection y coords in another
        const centerX = selection[0][0]+(selection[1][0]-selection[0][0])/2;
        const centerY= selection[0][1]+(selection[1][1] - selection[0][1])/2;

        let tempMin=13000;
        let e = 20000;
        
        for(let i=0; i<allScatter.length; i++){
            var split = d3.select(allScatter[i]).attr('transform').split(/[(]|[)]|[,]/);
            var x=parseFloat(split[1],10);
            var y=parseFloat(split[2],10);

            var d = Math.sqrt((x - centerX)**2 + (y-centerY)**2);
            if(d < tempMin){
                tempMin=d;
                e=i;
            }
        }

        d3.selectAll('.scatter').each((k,j) =>{
            if (j==e){
                d3.select(allScatter[j]).select('circle').style('stroke-width','0.2%')
                .style('stroke','#99000d').style('fill','#fc9272');
                //setYearValueText(k[yearData]);
                //year=k.Year;
                //setYear();
            }
            else{
                d3.select(allScatter[j]).select('circle').style('stroke-width','0.05%').style('fill', '#d9d9d9')
                .style('stroke', '#000');
            }
        });

      }  

}

//Updates the barchart so that the slider year is highlighted in the barchart
function updateSelectedScatter(){
    if(yearData == "None"){
        var allScatter=d3.selectAll(".scatterStation circle").nodes();
        d3.selectAll(".scatterStation").each((k,j) =>{

            if(parseInt(k.Year,10)==year){
                //d3.select(this).style('stroke-width','0.2%');
                d3.select(allScatter[j]).style('stroke-width','0.2%').attr("r","1%");
                setYearValueText(yearData);
                }
            else{
                d3.select(allScatter[j]).style('stroke-width','0.05%').attr('r', '0.5%');
            }

        });
    }
    else{
    var allScatter=d3.selectAll(".scatter").nodes();
    d3.selectAll('.scatter').each((k,j) =>{
        if(parseInt(k.Year,10)==year){
            //d3.select(this).style('stroke-width','0.2%');
            d3.select(allScatter[j]).select('circle').style('stroke-width','0.2%')
            .style('stroke','#99000d').style('fill','#fc9272');
            setYearValueText(k[yearData]);
            }
        else{
            d3.select(allScatter[j]).select('circle').style('stroke-width','0.05%').style('fill', '#d9d9d9')
            .style('stroke', '#000');
        }
    });
    d3.selectAll(".stationLines").raise();
    d3.selectAll(".allScaSta").raise();
    }

    updateStationText();

}

function updateStationText(){
    if(subStations.length == 1){
        var allStations=d3.selectAll(".station").selectAll("rect").nodes();
        
        for(let i=0; i<allStations.length; i++){
        
            if(allStations[i].id==subStations[0]){
                
                //d3.select(this).style('stroke-width','0.2%');
                stationData.then(function(stations){
                    var data=stations.filter(function(d){
                        return subStations.includes(d.Name);
                    })
                    //console.log(data[0][year]);
                    d3.select(".chart2 .stationText").text(allStations[i].id+': '+getStationInfo(data[0][year])).raise();
                })
                return;
                }
        }

    }
    else{
        d3.select(".chart2 .stationText").text("");
    }

}

function resetStationPlot(){

    d3.selectAll('.stationLines').remove();
    d3.selectAll('.scatterStation').remove();
    //document.getElementById('chooseStation').value="Empty";
    subStations=[];
    stationLineColors={};
    d3.select(".chart2 .stationText").text("");

}

function setYearValueText(yearValue){

    if(yearData=='Mean'){
        var text="Medelvärde: "+yearValue.toString().split(".")[0]+" dagar";
    }
    else if (yearData=='Sum'){
        var text="Totalt: "+yearValue.toString().split(".")[0]+" mätningar";

    }
    else if (yearData=='Median'){
        var text="Median: "+yearValue.toString().split(".")[0]+" dagar";
    }
    else if(yearData=="None"){
        var text="";
    };
     d3.select('.chart2 .yearValueText')
            .attr('font-size', '1em')
            .attr('font-color', "#000")
            .join("text")
            .text(text).raise();

}

var stationLineColors={}
function checkColorsForStationplot(){
    if(Object.keys(stationLineColors).length==0){
        for(let i=0; i <subStations.length; i++){
            stationLineColors[subStations[i]]=d3.schemeTableau10[i];
        }
    }
    else {

        var keys = Object.keys(stationLineColors)

        /*for(let i=0; i <keys.length; i++){
            if (!subStations.includes(keys[i])){
                delete stationLineColors[keys[i]];
            }
        }*/
        
        for(let i=0; i <subStations.length; i++){
            if (!keys.includes(subStations[i])){
                    index = (Object.keys(stationLineColors).length)%10;
                    stationLineColors[subStations[i]]=d3.schemeTableau10[index];

            }
        }
            
    }
    
}

var transformedData = [];
function createStationPlot(){

    if(subStations.length < 1){
        d3.selectAll('.stationLines').remove();
        d3.selectAll('.scatterStation').remove();
        return;

    }
    stationData.then(function(stations){
            var data=stations.filter(function(d){
                return subStations.includes(d.Name);
            })
            transformedData = [];
            
           for(let j=0; j<data.length; j++){
                
                for(let i=1969; i<2021; i++){
                    object={Name:data[j].Name, Year:i, Value:parseInt(data[j][i],10)};
                    transformedData.push(object);
                    
                }
           }
           

           var nestedData = d3.groups(transformedData, d => d.Name);
           
           meanSumMedian.then(function(data){

            if(yearData == "None"){
                xMax = d3.max(transformedData, (d) => {
                    if(d.Value == 999){
                        return 0;
                    }
                    else{
                        return d.Value;
                    }
                    });
            }
            else{
                xMaxStation = d3.max(transformedData, (d) => {
                    if(d.Value == 999){
                        return 0;
                    }
                    else{
                        return d.Value;
                    }
                    });
                xMaxData = d3.max(data, d => parseInt(d[yearData],10));

                xMax = d3.max([xMaxStation,xMaxData]);
            }
            console.log(xMax);
            
            yDomain = data.map(d => parseInt(d.Year, 10));
    
            xScale = d3.scaleLinear()
            .domain([ 0, xMax ])
            .range([chartOneWidth - marginChart1.left - marginChart1.right , marginChart1.right ]);
    
            yScale = d3.scaleBand()
                .domain( yDomain )
                .range([ marginChart1.top+20, chartOneHeight - marginChart1.bottom ]) //
                .padding(0.5)

        //if(yearData=="None"){
            /*function make_x_gridlines() {	
                return d3.axisBottom(xScale).ticks(4);
            }
            
            
            // add the X gridlines
            d3.selectAll('.grid').remove();
            d3.select(".chart2").append('g')		
            .attr("class", "grid")
            .attr('transform', `translate(${mapWidth*xRatio},${mapHeight*yRatio+ chartOneHeight - marginChart1.bottom })`)
            .call(make_x_gridlines()
                .tickSize(-(mapHeight*yRatio-40+ chartOneHeight - marginChart1.bottom))
                .tickFormat("")
            ).style("opacity", "0.1")
            .style("stroke","#f0f0f0").lower()*/

            // add the X gridlines
            d3.selectAll('.grid').remove();
            d3.select(".chart2").append('g')		
            .attr("class", "grid")
            .attr('transform', `translate(${mapWidth*xRatio},${mapHeight*yRatio+ chartOneHeight - marginChart1.bottom })`)
            .selectAll("line")
            .data(xScale.ticks(4))
            .join("line")
            .attr("class", "gridLine")
            .attr("x1", d =>   xScale(d))
            .attr("x2", d =>   xScale(d))
            .attr("y1", 0)
            .attr("y2", -(chartOneHeight-marginChart1.top - mapHeight*yRatio - marginChart1.bottom-10 ))
            .style("opacity", "0.1")
            .style("stroke","#000");

            d3.select(".chart2").select(".grid").lower();


            xAxis = d3.axisBottom(xScale)
            .tickSizeOuter(0).ticks(4);

            d3.select(".x-axis").remove();
            d3.select(".chart2").append('g')
            .attr('class', 'x-axis')
            .style("font-size", "80%")
            .style("stroke-width","0.15%")
            .attr('transform', `translate(${mapWidth*xRatio},${mapHeight*yRatio+ chartOneHeight - marginChart1.bottom })`) //mapHeight*yRatio
            .call( xAxis );

            d3.select(".x-label").remove();
            d3.select(".chart2").append("text")
            .attr("class", "x-label")
            .style("font-size", "80%")
            .attr("text-anchor", "end")
            .attr("x",30 + mapWidth*xRatio+chartOneWidth/2)
            .attr("y", 10+mapHeight*yRatio+chartOneHeight) //mapHeight*yRatio
            .text("Antal mätningar");
            
        //}

          /*var names=[]
          for(let j=0; j<stations.length; j++){
              names.push(stations[j].Name)
          }*/

          checkColorsForStationplot();

          /*var range = [];
            for (let i = 0; i < names.length; i++) {
                range.push(i/(names.length-1))
            }  */
        
            /*function shiftColor(h, shift) {
                let r = 0, g = 0, b = 0;
              
                // 3 digits
                if (h.length == 4) {
                  r = "0x" + h[1] + h[1];
                  g = "0x" + h[2] + h[2];
                  b = "0x" + h[3] + h[3];
              
                // 6 digits
                } else if (h.length == 7) {
                  r = "0x" + h[1] + h[2];
                  g = "0x" + h[3] + h[4];
                  b = "0x" + h[5] + h[6];
                }

                var rgb = "rgb("+ +r + "," + +g + "," + +b + ")";
                var val = rgb.split(/[(]|[)]|[,]/).slice(1,4);

                if(shift== -60){
                    console.log(val);
                }
                
                r = (+parseFloat(val[0],10)+shift).toString(16);
                g = (+parseFloat(val[1],10)+shift).toString(16);
                b = (+parseFloat(val[2],10)+shift).toString(16);

                if (r.length == 1)
                    r = "0" + r;
                if (g.length == 1)
                    g = "0" + g;
                if (b.length == 1)
                    b = "0" + b;

                return "#" + r + g + b;
              }*/
        
        /*var names={}
        var count=0;
        var colorCount=0;
        c=d3.schemeTableau10;
        console.log(c);
          for(let j=0; j<stations.length; j++){
              if((j%10) == 0){
                var s = -60+count;
                count +=20;
              }
              if(colorCount==10){
                  colorCount=0;
              }
              names[stations[j].Name] =shiftColor(c[colorCount],s);
              colorCount +=1;
          }

          console.log(names);*/
    
          
        //var scale = d3.scaleOrdinal(names,range);

        /*function color(val) {
            return names[val];
        };*/

         /*var color=d3.scaleOrdinal( 
            names,
            d3.schemeTableau10
          );*/

        d3.selectAll('.stationLines').remove();
        var lineStation = d3.line()
        .x( (d) => {
            if(d.Value == 999){
                return xScale(0);
            }
            else{
                return  xScale(d.Value);
            }
           })
        .y(d => yScale(d.Year))
        .curve(d3.curveLinear);
       
        var stLine = d3.select(".chart2").append("g")
        .attr("class", 'stationLines')
        .selectAll('path')
        .data(nestedData)
        .join('path')
        .attr("transform", (d) => {
            return "translate("+mapWidth*xRatio+","+mapHeight*yRatio+")"; //mapHeight*yRatio
        })
        .attr('d', d => lineStation(d[1]))
        .style('stroke',(d,i) => stationLineColors[d[1][i].Name]) //colors(d[1][i].Name) 
        .style('stroke-width', '0.4%')
        .attr("fill", 'transparent');

        d3.selectAll('.scatterStation').remove();
        d3.selectAll('.allScaSta').remove();
        const scatterStation = d3.select(".chart2").append('g')//chart1.append('g') //d3.select(".chart2").append('g')
        .attr('class','allScaSta')
        .selectAll('g')
        .data( transformedData )
        .join('g')

        scatterStation
            .attr('class', 'scatterStation')
            .attr('transform', (d,i) =>{
                //console.log(d))
                if(d.Value == 999){
                    var x = 0;
                }
                else{
                    var x = d.Value;
                }
            return `translate(${mapWidth*xRatio+xScale(x)},${mapHeight*yRatio+yScale(d.Year)})`
            }) //mapHeight*yRatio
            .call(g => g
                // first we append a circle to our data point
                .append('circle')
                //.attr('transform',`translate(0,1)`)
                .attr('r', '0.5%')
                .style('fill', (d,i) => stationLineColors[d.Name]) //color(d.Name)
                .style('stroke-width','0.05%')
                .style('stroke', '#000')
              );
        //_____________

        /*d3.selectAll('.chart2').on('click', function(d,i){
            //console.log(d);
            if(yearData=="None"){
            let cc = alert_coords(d);
            var allScatter=scatterStation.nodes();

            let tempMin = 12000;
            let index= 20000;
            let scattYear=0;

            for(let i=0; i<allScatter.length; i++){
                var split = d3.select(allScatter[i]).attr('transform').split(/[(]|[)]|[,]/);
                var x=parseFloat(split[1],10);
                var y=parseFloat(split[2],10);

    
                var dist = Math.sqrt((x - cc.x)**2 + (y-cc.y)**2);
                if(dist < tempMin){
                    tempMin=dist;
                    index=i;
                    scattYear=d3.selectAll('.scatterStation')[i].Year;
                    console.log(scattYear);
                }
            }
                
                d3.selectAll('.scatterStation').each((k,j) =>{
                    if(k.Year==scattYear){
                        //d3.select(this).style('stroke-width','0.2%');
                        d3.select(allScatter[j]).select('circle')
                        .style('stroke-width','0.2%');
                        year=k.Year;
                        //document.getElementById("vizRange").value=i.Year;
                        try {
                            var e = document.getElementById("vizRange");
                            if(window.getComputedStyle(e).display != 'none'){
                            document.getElementById("vizRange").value = k.Year; //find a solution for this
                            }
                            }
                            catch(err) {
                            console.log('error');
                            }
                        setYear();

                    }
                    else{
                        d3.select(allScatter[j]).select('circle').style('stroke-width','0.05%');
                        
                    }
                });
            }
            else{
                return;
            }
        })*/

        

        //__________________

        /*if(yearData =="None"){

           

            xAxis = d3.axisBottom(xScale)
            .tickSizeOuter(0).ticks(4);

            d3.select(".x-axis").remove();
            d3.select(".chart2").append('g')
            .attr('class', 'x-axis')
            .style("font-size", "80%")
            .style("stroke-width","0.15%")
            .attr('transform', `translate(${mapWidth*xRatio},${mapHeight*yRatio+ chartOneHeight - marginChart1.bottom })`) //mapHeight*yRatio
            .call( xAxis );

            d3.select(".x-label").remove();
            d3.select(".chart2").append("text")
            .attr("class", "x-label")
            .style("font-size", "80%")
            .attr("text-anchor", "end")
            .attr("x",30 + mapWidth*xRatio+chartOneWidth/2)
            .attr("y", 10+mapHeight*yRatio+chartOneHeight) //mapHeight*yRatio
            .text("Antal mätningar");

            if(yearData=="None"){
                setYear();
            }

        }*/

        //if(yearData=="None"){
            setYear();
       // }
        
        
    });

    });

   

}

function setNarrativeText(){
    d3.selectAll('.narrativePlace').remove();
    d3.select('.narrativeText').style('visibility', 'hidden');
    if (narrativeYears.includes(parseInt(year,10))) {
        narrativeData.then(function(data){
            d3.select('.narrativeText').style('visibility', 'visible');
            if(data[year].Lat == 0){
                d3.select('.narrativeText')
                .attr('font-size', '0.5em') //0.5
                .attr('font-color', "#000")
                .join("text")
                .text(data[year].Text).raise();
            }
            else{
                d3.select('.narrativeText')
                .attr('font-size', '0.5em')
                .attr('font-color', "#000")
                .join("text")
                .text(data[year].Text).raise();
                sweGeo.then((geo) => setNarrativeSymhol(geo,data));
            }
        });
    }
    return;
}

function setNarrativeSymhol(geo,data){
    var projection= d3.geoMercator().fitSize([mapWidth*0.8,mapHeight*1.5],geo);
    var coord = "translate("+projection([data[year].Long,data[year].Lat])+")";
    //d3.selectAll('.station').remove();
    //d3.selectAll('.stationCenter').remove();
    //Creates the circles for each station
    const place = d3.select('.chart2').append('g')
    .attr("class", "narrativePlace")
    .selectAll('path')
    .data([1])
    .join('path');
    
    place
        .attr("d",d3.symbol().type(d3.symbolStar))
        .style("fill",'#3182bd')
        .style("stroke",'#000')
        .style("stroke-width",'0.1%')
        .style("opacity","0.5")
        .attr("transform", coord)
        .on("mouseover", function() {
            d3.select(this)
            .style("stroke-width",'0.2%')
            .raise();
            d3.select(".narrativeText").style("background-color","#000")
            .style("color","#FFFFFF");
            }
        )
    .on("mouseout", function () {
    d3.select(this)
    .style("stroke-width",'0.1%');
    d3.select(".narrativeText").style("background-color","")
    .style("color","#000");
    //d3.select(".infobox").style('visibility', 'hidden');
    });

}

function changeDataSet() {
    //var type = document.querySelector('input[name="filterData"]:checked').value;
    var type = document.getElementById("dataType").value;
    if(type == 'Min'){
        meanSumMedian=d3.csv('./../data2/meanMedianSumMin20.csv');
        stationData=d3.csv('./../data2/stationMin20Proto2.csv');
    }
    /*if(type == 'Max'){
        stationData=d3.csv('./../data/stationOver30Proto2.csv');
        meanSumMedian=d3.csv('./../data/meanMedianSumOver30.csv');
    }*/
    if(type == 'HeatWave')
    {
        stationData=d3.csv('./../data2/stationHeatWaveDaysProto2.csv');
        meanSumMedian=d3.csv('./../data2/HeatWaveMeanMedianSum.csv');
    }
    if(type == 'HighTemp')
    {   
        stationData=d3.csv('./../data2/stationHighTempDaysProto2.csv');
        meanSumMedian=d3.csv('./../data2/HighTempMeanMedianSum.csv');
    }
    if(type == 'Class1')
    {
        stationData=d3.csv('./../data2/stationClass1DaysProto2.csv');
        meanSumMedian=d3.csv('./../data2/Class1MeanMedianSum.csv');
    }
    if(type == 'Class2')
    {
        stationData=d3.csv('./../data2/stationClass2DaysProto2.csv');
        meanSumMedian=d3.csv('./../data2/Class2MeanMedianSum.csv');
    }
    //createStationCircles();
    createStationBars();
    //createScatterChart();
    createScatterChartInMapChart();
    createStationPlot();
}

function changeYearData(){
    //var type = document.querySelector('input[name="filterYear"]:checked').value;
    var type = document.getElementById("dataDes").value;
    if(type == 'Sum'){
        yearData='Sum';
    }
    else if(type == 'Mean'){
        yearData='Mean';
    }
    else if(type == 'Median'){
        yearData='Median';
    }
    else if(type == 'None'){
        yearData='None';
        d3.selectAll(".mainLine").remove();
        d3.selectAll('.scatter').remove();
        createStationPlot();
        return;
    }
    //createScatterChart();
    createScatterChartInMapChart();
    createStationPlot();
}

function playSlider(){
    var state=document.getElementById("playButton").value;
    if(state == "Pausa"){
        document.getElementById("playButton").value="Spela";
        clearInterval(timer);
    }
    else{
        document.getElementById("playButton").value="Pausa";
        animationStartYear = parseInt(document.getElementById("vizRange").value,10);
        timer = setInterval(function(){
            if(animationStartYear<2021){
                animationStartYear += 1;
                document.getElementById("vizRange").value=animationStartYear.toString();
                setYear();
            }
            else{
                clearInterval(timer);
                document.getElementById("playButton").value="Spela";
            }
        },225);
        
    }
}


var multiSelect="";
function createStationOptions(){
    stationData.then(function(data){

        var optionData = []
        for(let i=0; i<data.length; i++){
            optionData.push({label: data[i].Name, value: data[i].Name})
        }

        multiSelect = new SelectPure(".multi-select", {
            options: optionData,
            multiple: true,
            icon: "fa fa-times",
            placeholder: "Välj stationer",
            autocomplete: true,
            onChange: value => { chooseStationWithSelect(value) },
            classNames: {
          select: "select-pure__select",
          dropdownShown: "select-pure__select--opened",
          multiselect: "select-pure__select--multiple",
          label: "select-pure__label",
          placeholder: "select-pure__placeholder",
          dropdown: "select-pure__options",
          option: "select-pure__option",
          autocompleteInput: "select-pure__autocomplete",
          selectedLabel: "select-pure__selected-label",
          selectedOption: "select-pure__option--selected",
          placeholderHidden: "select-pure__placeholder--hidden",
          optionHidden: "select-pure__option--hidden",
        }
        });
    });
}


function createStationOptionsMobile(){
    stationData.then(function(data){

        var optionData = []
        for(let i=0; i<data.length; i++){
            
            var select = document.getElementById("chooseStation");
            var option = document.createElement("option");
            option.text = data[i].Name;
            option.value= data[i].Name;
            select.add(option);
            optionData.push({label: data[i].Name, value: data[i].Name})
        }
    });
}

function resetMulti(){
    try{
    multiSelect.reset();
    resetStationBars();
    resetStationPlot();
    }
    catch(err){
        console.log('Mobile Device');
    }
}

function chooseStationWithSelectMobile(){
    subStations = [];
    var type = document.getElementById("chooseStation").value;
    var allStations=d3.selectAll(".station").selectAll("rect").nodes();
    var allStationFloors =d3.selectAll(".stationFloor").selectAll("rect").nodes();
 
    for(let i=0; i<allStations.length; i++){
        if(allStations[i].id==type){
            //d3.select(this).style('stroke-width','0.2%');
            var h=d3.select(allStations[i]).attr("height");
            d3.select(allStations[i]).style('stroke-width','0.5%').style("opacity","0.7");
            d3.select(".chart2 .stationText").text(allStations[i].id+': '+getStationInfo(rectHeight.invert(h))).raise();
            subStations.push(allStations[i].id);
            }
        else if(type=="Empty") {
            d3.select(allStations[i]).style('stroke-width','0.1%').style("opacity","0.7");
        }
        else{
            d3.select(allStations[i]).style('stroke-width','0.1%').style("opacity","0.3");
        }
    }


    for(let i=0; i<allStationFloors.length; i++){
        if(allStationFloors[i].id==(type+"_Floor")){
            d3.select(allStationFloors[i]).style('stroke-width','0.3%').style("opacity","1");
            }
        else if(type=="Empty") {
            d3.select(allStationFloors[i]).style('stroke-width','0.1%').style("opacity","1");
        }
        else{
            d3.select(allStationFloors[i]).style('stroke-width','0.1%').style("opacity","0.3");
        }

    }

    if(type=="Empty"){
        d3.select(".chart2 .stationText").text("");
        resetStationPlot();
        return;
    }




    createStationPlot();

}
//For multi-select
function resetStationBars(){

    var allStations=d3.selectAll(".station").selectAll("rect").nodes();
    var allStationFloors =d3.selectAll(".stationFloor").selectAll("rect").nodes();

    for(let i=0; i<allStations.length; i++){
        d3.select(allStations[i]).style('stroke-width','0.1%').style("opacity","0.7");
    }

    for(let i=0; i<allStationFloors.length; i++){
        d3.select(allStationFloors[i]).style('stroke-width','0.1%').style("opacity","1");
    }
}

function chooseStationWithSelect(value){
    subStations=[...value];
    
    if(subStations.length<1){
        d3.select(".chart2 .stationText").text("");
        resetStationPlot();
        resetStationBars();
        return;
    }

 var allStations=d3.selectAll(".station").selectAll("rect").nodes();
 var allStationFloors =d3.selectAll(".stationFloor").selectAll("rect").nodes();

visitedSt=[];
visitedFl=[];
 for(let j=0; j<subStations.length; j++){
    for(let i=0; i<allStations.length; i++){
        if(visitedSt.includes(i)){
            continue;
        }
        else if(allStations[i].id==subStations[j]){
            //d3.select(this).style('stroke-width','0.2%');
            visitedSt.push(i);
            var h=d3.select(allStations[i]).attr("height");
            d3.select(allStations[i]).style('stroke-width','0.5%').style("opacity","0.7");
            d3.select(".chart2 .stationText").text(allStations[i].id+': '+getStationInfo(rectHeight.invert(h))).raise();
            //subStations.push(allStations[i].id);
            }
        else {
            d3.select(allStations[i]).style('stroke-width','0.1%').style("opacity","0.3"); // 0.1% 0.3
        }
    }

    for(let i=0; i<allStationFloors.length; i++){
        if(visitedFl.includes(i)){
            continue;
        }
        else if(allStationFloors[i].id==(subStations[j]+"_Floor")){
            visitedFl.push(i);
            d3.select(allStationFloors[i]).style('stroke-width','0.3%').style("opacity","1");
            }
        else{
            d3.select(allStationFloors[i]).style('stroke-width','0.1%').style("opacity","0.3"); //0.3
        }

    }
  }
    /*stationData.then(function(stations){
        var names=[]
        for(let j=0; j<stations.length; j++){
            names.push(stations[j].Name)
        }
    
    var color=d3.scaleOrdinal( 
        names,
        d3.schemeTableau10
        );


        var sLabels = document.getElementsByClassName('select-pure__selected-label');
        for(let j=0; j<sLabels.length; j++){
            sLabels[j].style.background = color(sLabels[j].innerHTML.split("<")[0]);
        }
    });*/
    checkColorsForStationplot();
    var sLabels = document.getElementsByClassName('select-pure__selected-label');
        for(let j=0; j<sLabels.length; j++){
            sLabels[j].style.background = stationLineColors[sLabels[j].innerHTML.split("<")[0]];
        }

  

createStationPlot();

}
/*
function updateStationWithSelected(){


    if(subStations.length<1){
        d3.select(".chart2 .stationText").text("");
        return;
    }
 var allStations=d3.selectAll(".station").selectAll("rect").nodes();
 var allStationFloors =d3.selectAll(".stationFloor").selectAll("rect").nodes();
 

visitedSt=[];
visitedFl=[];
 for(let j=0; j<subStations.length; j++){
    for(let i=0; i<allStations.length; i++){
        if(visitedSt.includes(i)){
            continue;
        }
        else if(allStations[i].id==subStations[j]){
            visitedSt.push(i);
            d3.select(allStations[i]).style('stroke-width','0.5%').style("opacity","0.7");
            }
        else {
            d3.select(allStations[i]).style('stroke-width','0.1%').style("opacity","0.3");
            //console.log("changing opacity");
            //console.log(allStations[i]);
        }
    }

    for(let i=0; i<allStationFloors.length; i++){
        if(visitedFl.includes(i)){
            continue;
        }
        else if(allStationFloors[i].id==(subStations[j]+"_Floor")){
            visitedFl.push(i);
            d3.select(allStationFloors[i]).style('stroke-width','0.3%').style("opacity","1");
            }
        else{
            d3.select(allStationFloors[i]).style('stroke-width','0.1%').style("opacity","0.3");
        }

    }
  }

createStationPlot();

}*/
