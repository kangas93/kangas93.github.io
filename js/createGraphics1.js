
var stationData=d3.csv('./../data/stationsDataProto2.csv');
var meanSumMedian=d3.csv('./../data/meanMedianSum30.csv');
marginChart1 = ({top: 20, right: 30, bottom: 10, left: 60});
marginChart2 = ({top: 20, right: 30, bottom: 30, left: 60});
chartOneWidth=screen.width*0.8-marginChart1.left-marginChart1.right;//2000;
chartOneHeight=screen.height*0.2;
mapWidth=chartOneWidth*0.5;
mapHeight=screen.height*0.68-chartOneHeight-marginChart2.top-marginChart2.bottom;
//barWidth=Math.floor((screen.width-marginChart1.right-marginChart1.left)/50.0);
var yearData="Mean";
var yearValue="";


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

var colorRange=d3.scaleSequential().domain([1,20])
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
    year=parseInt(document.getElementById("vizRange").value,10);
    createStationCircles();
    updateSelectedBar();
}

function getYear(){
    return year;
}

//Loads and draws the map and the legend
function loadMap(){
    sweGeo.then((geo) => {
    var projection= d3.geoMercator().fitSize([mapWidth,mapHeight],geo);
    var geoPath =  d3.geoPath().projection(projection);
    
    const map = d3.select('.chart2').append("g")
    .attr("class", "map")
    .selectAll("path")
    .data(geo.features)
    .join("path")
    .attr("class", "Sweden")
    .attr("fill", '#d9d9d9')
    .attr("d", geoPath);

    //Creating a legend
    var legendData=[999]
    for (let i = 0; i < 21; i++) {
        if( (i % 5) == 0){
            legendData.push(i);
        }
    }
    const legend = d3.select('.chart2').append('g');
    
    legend
    .selectAll('g')
    .data( legendData )
    .join('g')
        .attr('class', 'legendCircle')
        .attr("transform", (d,i) => {
            return "translate("+mapWidth*0.8+","+(mapHeight*0.1+25*i)+")";
        })
    .call(g => g
        .append('circle')
        .attr("r",d => getValueOfYearLegend(d))
        .style("fill",d=>getColorOfYearLegend(d))
        .style("stroke",'#000')
        .style("stroke-width",'0.1%')
        .style("opacity","0.5")
    )
    .call(g => g
        .append('text')
        .attr('x', '2%') //d => getValueOfYearLegend(d)
        .attr('dy', '0.35em')
        .text(d=> getStationInfo(d))
        );

 })
   
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
            .text('År: '+year);
            
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
//Creates the bar chart showing the mean value
// TODO: add title and axis labels
function createBarChart(){
    meanSumMedian.then(function(data){
        var yMaxM = d3.max(data, d => parseInt(d[yearData],10));
        xDomain = data.map(d => parseInt(d.Year, 10));

        xScale = d3.scaleBand()
        .domain( xDomain )
        .range([ marginChart1.left, chartOneWidth - marginChart1.right - marginChart1.left ])
        .padding(0.1); //.padding(0.5);

        yScale = d3.scaleLinear()
        .domain([ 0, yMaxM ])
        .range([ chartOneHeight - marginChart1.bottom, marginChart1.top ])

        xAxis = d3.axisBottom(xScale)
        .tickSizeOuter(0);

        yAxis = d3.axisLeft(yScale)
        .tickSizeOuter(0);

        d3.selectAll('.bars').remove();
        const rect = d3.select(".chart1").append('g')
        .attr('class', 'bars')
        .selectAll('rect')
        .data( data )
        .join('rect');

        rect
            .attr('class', 'bar')
            .attr('x', d => xScale(parseInt(d.Year,10)))
            .attr('y', d => yScale(parseInt(d[yearData], 10)))
            .attr('width',xScale.bandwidth()) //xScale.bandwidth()
            .attr('height', d => yScale(0) - yScale(parseInt(d[yearData], 10)))
            .style('fill', '#d9d9d9')
            .style('stroke-width','0.05%')
            .style('stroke', '#000')
            .on('click',function(d,i){
                var allRect=rect.nodes();
                d3.selectAll('.bar').each((k,j) =>{
                    if(k.Year==i.Year){
                        //d3.select(this).style('stroke-width','0.2%');
                        d3.select(allRect[j]).style('fill','#fc9272')
                        .style('stroke-width','0.2%')
                        .style('stroke','#99000d');
                        year=i.Year;
                        document.getElementById("vizRange").value=i.Year;
                        createStationCircles();

                    }
                    else{
                        d3.select(allRect[j]).style('stroke-width','0.05%')
                        .style('fill', '#d9d9d9')
                        .style('stroke', '#000');
                        
                    }
                });
            });
    
    d3.selectAll('.x-axis').remove();
    d3.selectAll('.y-axis').remove();
    d3.selectAll('.x-label').remove();
    d3.selectAll('.y-label').remove();

    // Here the x axis is rendered
    d3.select(".chart1").append('g')
        .attr('class', 'x-axis')
        .style("font-size", "40%")
        .attr('transform', `translate(0,${ chartOneHeight - marginChart1.bottom })`)
        .call( xAxis );
    
        d3.select(".chart1").append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", (chartOneWidth-marginChart1.right-marginChart1.left)/2)
        .attr("y", chartOneHeight+30)
        .text("Årtal");
    
    // Y axis is rendered
    d3.select(".chart1").append('g')
        .attr('class', 'y-axis')
        .style("font-size", "100%")
        .attr('transform', `translate(${ marginChart1.left },0)`)
        .call( yAxis );
    
    d3.select(".chart1").append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", -40)
        .attr("y", 3)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Antal mätningar");
    
    updateSelectedBar();

    })

}
//Updates the barchart so that the slider year is highlighted in the barchart
function updateSelectedBar(){
    var allRect=d3.selectAll(".bar").nodes();
    d3.selectAll('.bar').each((k,j) =>{
        if(parseInt(k.Year,10)==year){
            //d3.select(this).style('stroke-width','0.2%');
            d3.select(allRect[j]).style('stroke-width','0.2%')
            .style('stroke','#99000d').style('fill','#fc9272');
            yearValue=k[yearData];
        }
        else{
            d3.select(allRect[j]).style('stroke-width','0.05%').style('fill', '#d9d9d9')
            .style('stroke', '#000');
        }
    });

    if(yearData=='Mean'){
        var text="Medelvärde per station: "+yearValue.toString()+" dagar";
    }
    else if (yearData=='Sum'){
        var text="Årets mätningar: "+yearValue.toString()+" mätningar";

    }
    else if (yearData=='Median'){
        var text="Medianen för stationerna: "+yearValue.toString()+" dagar";
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
function createStationScatter(){

    for(let i=0; i<subStations.length; i++){
        console.log(subStations[i]);

    }
}

//Not finished - placeholder function. Creates a svg element with buttons that can filter
// the view for the user.
function createFilterSettings(){
}

function changeDataSet() {
    var type = document.querySelector('input[name="filterData"]:checked').value;
    if(type == 'Min'){
        meanSumMedian=d3.csv('./../data/meanMedianSumMin20.csv');
        stationData=d3.csv('./../data/stationMinProto2.csv');
    }
    if(type == 'Max'){
        stationData=d3.csv('./../data/stationsDataProto2.csv');
        meanSumMedian=d3.csv('./../data/meanMedianSum30.csv');
    }
    createStationCircles();
    createBarChart();
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
    createBarChart();
}

function msg(){
    console.log('HejHej');
}