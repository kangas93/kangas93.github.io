
var stationData=d3.csv('./../data/stationHeatWaveDaysProto2.csv');
var meanSumMedian=d3.csv('./../data/HeatWaveMeanMedianSum.csv');
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

if (screen.width >= 1020) {
    var xRatio=0.55;
    var yRatio=0.000;

    var xRatioLegend=0.02;
    var yRatioLegend=0.20;
}
else{
    var xRatio=0.45;
    var yRatio=0.000;
    var xRatioLegend=0.05;
    var yRatioLegend=0.25;


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
    createScatterChartInMapChart();
    createStationBars();
    updateSelectedScatter();
    setNarrativeText();
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
        .text("Fun fact")
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
       .attr("height",d => getValueOfYearRect(d,year))
       .attr("width","1.0%")
       .style("fill",d=>getColorOfYear(d,year))
       .style("stroke",'#000')
       .style("stroke-width",'0.1%')
       .style("opacity","0.7")
       .attr("transform", function(d,i) {
        var pos="translate(" +stationPosition[i][0].toString()+","+ (stationPosition[i][1]-getValueOfYearRect(d,year)).toString()+ ")";
        return pos;
        }
    )
        .on("mouseover", function (d,c) {
        if(!subStations.includes(c.ID)){ 
            d3.select(this)
            .style("stroke-width",'0.2%');
        }
            d3.select(this).raise();
            d3.select(".chart2 .stationText").text(c['Name']+': '+getStationInfo(c[year])).raise();
    })
    .on("mouseout", function (d,i) {
        if(!subStations.includes(i.ID)){
            d3.select(this)
            .style("stroke-width",'0.1%');
        }
        d3.select(".chart2 .stationText").text("");
        //d3.select(".infobox").style('visibility', 'hidden');
    })
    .on('click', function(d,i){

        if(subStations.includes(i.ID)){
            subStations = subStations.filter(item => item !== i.ID)
            d3.select(this).style("stroke-width",'0.2%');
        }
        else{
            subStations.push(i.ID);
            d3.select(this).style("stroke-width",'0.5%');
        }
        createStationPlot();
            
            });

    const barsFloor = d3.select('.chart2').append('g')
        .attr("class", "stationFloor")
        .selectAll('rect')
        .data( stations )
        .join('rect');
    
    barsFloor
        .attr("height",d => getHeightOfYearBarFloor(d,year))
        .attr("width","2.0%")
        .style('stroke','#000')
        .style('stroke-width','0.1%')
        .style("fill",d => getColorOfYearBarFloor(d,year))
        .attr("transform", function(d,i) {
            var pos="translate(" +(stationPosition[i][0]-mapWidth*0.005).toString()+","+ stationPosition[i][1].toString()+ ")";
            return pos;
            }
        )
        .on("mouseover", function (d,c) {
            if(!subStations.includes(c.ID)){ 
                //var val= parseFloat(d3.select(this).style('height').split('%')[0],10);
                d3.select(this)
                //.attr("height",(val+0.2)+'%');
                .style('stroke-width','0.3%').raise();
            }
                d3.select(this).raise();
                d3.select(".chart2 .stationText").text(c['Name']+': '+getStationInfo(c[year])).raise();
        })
        .on("mouseout", function (d,i) {
            if(!subStations.includes(i.ID)){
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
        .tickSizeOuter(0).ticks(5);

        yAxis = d3.axisRight(yScale)
        .tickSizeOuter(0);


        d3.selectAll('.mainLine').remove();
        var lineMain = d3.line()
            .x(function(d) { 
                return xScale(d[yearData]); })
            .y(function(d) { 
                return yScale(d.Year); })
            .curve(d3.curveLinear);

       
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
        const scatter = d3.select(".chart2").append('g')
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
                })
              );

        
        d3.selectAll('.x-axis').remove();
        d3.selectAll('.y-axis').remove();
        d3.selectAll('.x-label').remove();
        d3.selectAll('.y-label').remove();

        // Here the x axis is rendered
        d3.select(".chart2").append('g')
            .attr('class', 'x-axis')
            .style("font-size", "70%")
            .style("stroke-width","0.15%")
            .attr('transform', `translate(${mapWidth*xRatio},${mapHeight*yRatio+ chartOneHeight - marginChart1.bottom })`) //mapHeight*yRatio
            .call( xAxis );

            d3.select(".chart2").append("text")
            .attr("class", "x-label")
            .style("font-size", "70%")
            .attr("text-anchor", "end")
            .attr("x", mapWidth*xRatio+chartOneWidth/2)
            .attr("y", mapHeight*yRatio+chartOneHeight) //mapHeight*yRatio
            .text("Antal mätningar");
        
        // Y axis is rendered
        d3.select(".chart2").append('g')
            .attr('class', 'y-axis')
            .style("font-size", "60%")
            .style("stroke-width","0.15%")
            .attr('transform', `translate(${mapWidth*xRatio+ chartOneWidth - marginChart1.right - marginChart1.left},${mapHeight*yRatio})`) //mapHeight*yRatio
            .call( yAxis );
            
        
        d3.select(".chart2").append("text")
            .attr("class", "y-label")
            .style("font-size", "70%")
            .attr("text-anchor", "end")
            .attr("x", mapWidth*xRatio+chartOneWidth*1.08)
            .attr("y", mapHeight*yRatio+chartOneHeight/2) //mapHeight*yRatio
            //.attr("dy", ".75em")
            //.attr("transform", "rotate(-90)")
            .text("Årtal");
        
       updateSelectedScatter();

    })

}

//Updates the barchart so that the slider year is highlighted in the barchart
function updateSelectedScatter(){
    d3.selectAll('.stationLines').remove();
    subStations=[];
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

}

function setYearValueText(yearValue){

    if(yearData=='Mean'){
        var text="Medelvärde: "+yearValue.toString()+" dagar";
    }
    else if (yearData=='Sum'){
        var text="Totalt: "+yearValue.toString()+" mätningar";

    }
    else if (yearData=='Median'){
        var text="Median: "+yearValue.toString()+" dagar";
    };
     d3.select('.chart2 .yearValueText')
            .attr('font-size', '1em')
            .attr('font-color', "#000")
            .join("text")
            .text(text).raise();

}

//Not finished - placeholder function. When clicking on the circles on the map
// a line scatterplot is going to appear instead of the barchart, showing the timeline
//of the station
function createStationPlot(){

    if(stationData.length ==0){
        d3.selectAll('.stationLines').remove();
        createScatterChart();
        return;

    }
    stationData.then(function(stations){
        //for(let i=0; i<subStations.length; i++){

            var data=stations.filter(function(d){
                return subStations.includes(d.ID);
            })
            //transformedData = {ID:[], Year:[], Value:[]}
            transformedData = [];
            
           for(let j=0; j<data.length; j++){
                
                for(let i=1969; i<2021; i++){
                    object={ID:data[j].ID, Year:i, Value:parseInt(data[j][i],10)};
                    transformedData.push(object);
                    //transformedData['ID'].push(data[j].ID);
                    //transformedData['Year'].push(i);
                    //transformedData['Value'].push(data[j][i]);
                }
           }
        console.log(transformedData);

        xMax = d3.max(transformedData, d => d.Value);
        yDomain = transformedData.map(d => d.Year);
        

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

        const names =  transformedData.map(d => d.ID);
        var colors=d3.scaleOrdinal( 
            names,
            d3.schemeCategory10
          );
        


        //d3.selectAll('.mainLine').remove();
        d3.selectAll('.stationLines').remove();
        /*var lineStation = d3.line()
            .x(function(d) { 
                return xScale(d.Value); })
            .y(function(d) { 
                return yScale(d.Year); })
            .curve(d3.curveLinear);*/
        var lineStation = d3.line()
        .x( d => xScale(d.Value))
        .y(d => yScale(d.Year))
        .curve(d3.curveLinear);
       
        var stLine = d3.select(".chart1").append("g")
        .attr("class", 'stationLines')
        .selectAll('path')
        .data(transformedData)
        .join('path')
            .attr('d', lineStation(transformedData))
            .style('stroke',d => colors(d.ID))
            .style('stroke-width', '0.5%')
            .attr("fill", 'transparent');
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
    var projection= d3.geoMercator().fitSize([mapWidth*0.8,mapHeight],geo);
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
    var type = document.querySelector('input[name="filterData"]:checked').value;
    if(type == 'Min'){
        meanSumMedian=d3.csv('./../data/meanMedianSumMin20.csv');
        stationData=d3.csv('./../data/stationMin20Proto2.csv');
    }
    if(type == 'Max'){
        stationData=d3.csv('./../data/stationOver30Proto2.csv');
        meanSumMedian=d3.csv('./../data/meanMedianSumOver30.csv');
    }
    if(type == 'HeatWave')
    {
        stationData=d3.csv('./../data/stationHeatWaveDaysProto2.csv');
        meanSumMedian=d3.csv('./../data/HeatWaveMeanMedianSum.csv');
    }
    if(type == 'HighTemp')
    {   console.log('hej');
        stationData=d3.csv('./../data/stationHighTempDaysProto2.csv');
        meanSumMedian=d3.csv('./../data/HighTempMeanMedianSum.csv');
    }
    if(type == 'Class1')
    {
        stationData=d3.csv('./../data/stationClass1DaysProto2.csv');
        meanSumMedian=d3.csv('./../data/Class1MeanMedianSum.csv');
    }
    if(type == 'Class2')
    {
        stationData=d3.csv('./../data/stationClass2DaysProto2.csv');
        meanSumMedian=d3.csv('./../data/Class2MeanMedianSum.csv');
    }
    //createStationCircles();
    createStationBars();
    //createScatterChart();
    createScatterChartInMapChart();
}

function changeYearData(){
    var type = document.querySelector('input[name="filterYear"]:checked').value;
    if(type == 'Sum'){
        yearData='Sum';
    }
    else if(type == 'Mean'){
        yearData='Mean';
    }
    else if(type == 'Median'){
        yearData='Median';
    }
    //createScatterChart();
    createScatterChartInMapChart();
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