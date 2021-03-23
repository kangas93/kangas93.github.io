
var stationData=d3.csv('./../data/stationsDataProto2.csv');
var meanSum=d3.csv('./../data/meanSum30.csv');
mapWidth=800;
mapHeight=600;
barWidth=2000;
barHeight=300;
var margin = ({
    top: 100,
    right: 100, // 10
    bottom: 0,
    left: 20 // 35
  });

var year = 1970;
var subStations=[];

var sweGeo = fetch('./../data/jsonSwe.json')
.then(response => response.text())
.then((data) => {
    var jData =JSON.parse(data);
    //return topojson.feature(jData,jData.objects.data);
    return topojson.feature(jData,jData.objects.data);
  });     


var radiusScale=d3.scaleLinear(
    // domain
      [ 0, 2.53 ], 
      // range
      [ '1%', '2%' ]
  );

function radiusScaleArea(d){
    return radiusScale(Math.sqrt(d/Math.PI));
}

var colorRange=d3.scaleLinear().domain([ 1, 20 ])
      .range(["#fff5f0", "#99000d"]);



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

function getStationInfo(d){
    if(d==999){
        return "Ingen data";
    }
    else{
        return parseInt(d,10)+' dagar';
    }
}

function setYear(){
    year=parseInt(document.getElementById("vizRange").value,10);
    createStationCircles();
    updateSelectedBar();
}

function getYear(){
    return year;
}


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

    //CREATING A LEGEND
    var legendData=[999]
    for (let i = 0; i < 21; i++) {
        if( (i % 5) == 0){
            legendData.push(i);
        }
    }
    const legend = d3.select('.chart2').append('g');
            //.attr("class", "legendCircle")
            //.selectAll('circle')
            //.data( legendData )
            //.join('circle')
            
            /*circles
                .attr("r",d => getValueOfYearLegend(d))
                .style("fill",d=>getColorOfYearLegend(d))
                .style("stroke",'#000')
                .style("stroke-width",'0.1%')
                .style("opacity","0.7")
                .attr("transform", (d,i) => {
                    return "translate(800,"+45*i+")";
                });*/
    legend
    .selectAll('g')
    .data( legendData )
    // each data point is a group
    .join('g')
        .attr('class', 'legendCircle')
        .attr("transform", (d,i) => {
            return "translate(800,"+45*i+")";
        })
    // .call() passes in the current d3 selection
    // This is great if we want to append something
    // but still want to work with the original selection after that
    .call(g => g
        // first we append a circle to our data point
        .append('circle')
        .attr("r",d => getValueOfYearLegend(d))
        .style("fill",d=>getColorOfYearLegend(d))
        .style("stroke",'#000')
        .style("stroke-width",'0.1%')
        .style("opacity","0.5")
    )
    .call(g => g
        // then we append a text label to the data point
        .append('text')
        .attr('x', d => getValueOfYearLegend(d))
        .attr('dy', '0.35em')
        // I've filter out values too low in order to avoid label overlap
        // see what happens if you remove the condition and just return d.company
        .text(d=> getStationInfo(d))
        );
    
    /*const text = d3.select('.chart2 .legendText').append('g')
    .attr("class", "legendText")
    .data( legendData)
    .append('tspan')
    //.join('tspan');
    .attr('x',"810")
    .attr('y', (d,i) => 90*i)
    .attr('font-size', "100%")
    .attr('font-color', "#000")
    .text(d, d=> getStationInfo(d));*/
                
    /*const text = d3.select('.chart2').append('text')
    .attr("class", "legendText")
    .selectAll('text')
    .data( legendData )
    .join('text');
    
    text
        .attr('x',"800")
        .attr('y', (d,i) => 90*i)
        .attr('font-size', "100%")
        .attr('font-color', "#000")
        .text(d, d=> getValueOfYearLegend(d));*/

 })
   
}

function createStationCircles(){
    stationData.then(function(stations){
        //stationsSorted=stations["2018"].sort(d3.descending);
        var stationPosition=[];
        sweGeo.then(function(geo) {
            var projection= d3.geoMercator().fitSize([mapWidth,mapHeight],geo);
            for (let i = 0; i < stations.length; i++) {
            var coord = projection([stations[i].Longitude,stations[i].Latitude]);
            var txt= "translate(" + coord + ")";
            stationPosition.push(txt);
            }

            d3.selectAll('.station').remove();
            d3.selectAll('.stationCenter').remove();

            const info = d3.select('.chart2 .infotext')
            .attr('font-size', "100%")
            .attr('font-color', "#000")
            .join("text")
            .text('År: '+year);
            
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
                    d3.select(".chart2 .infotext").text(c['Name']+': '+getStationInfo(c[year]));
                    }
                )
            .on("mouseout", function (d) {
            d3.select(this)
            .style("stroke-width",'0.1%');
            d3.select(".chart2 .infotext").text('År: '+year);
            //d3.select(".infobox").style('visibility', 'hidden');
            })
            .on('click', function(d,i){
                subStations.push(i.ID);
                createStationScatter();
            })

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

function createBarChart(){
    meanSum.then(function(data){
        var yMaxM = d3.max(data, d => parseInt(d.Mean,10));
        xDomain = data.map(d => parseInt(d.Year, 10));

        xScale = d3.scaleBand()
        .domain( xDomain )
        .range([ margin.left, barWidth - margin.right - margin.left ])
        .padding(0.5);

        yScale = d3.scaleLinear()
        .domain([ 0, yMaxM ])
        .range([ barHeight - margin.bottom, margin.top ])

        xAxis = d3.axisBottom(xScale)
        .tickSizeOuter(0);

        yAxis = d3.axisLeft(yScale)
        .tickSizeOuter(0);

        const rect = d3.select(".chart1").append('g')
        .attr('class', 'bars')
        .selectAll('rect')
        .data( data )
        .join('rect');

        rect
            .attr('class', 'bar')
            .attr('x', d => xScale(parseInt(d.Year,10)))
            .attr('y', d => yScale(parseInt(d.Mean, 10)))
            .attr('width', xScale.bandwidth())
            .attr('height', d => yScale(0) - yScale(parseInt(d.Mean, 10)))
            .style('fill', '#d9d9d9')
            .style('stroke-width','0.05%')
            .style('stroke', '#000')
            .on('click',function(d,i){
                var allRect=rect.nodes();
                d3.selectAll('.bar').each((k,j) =>{
                    if(k.Year==i.Year){
                        //d3.select(this).style('stroke-width','0.2%');
                        d3.select(allRect[j]).style('stroke-width','0.2%')
                        .style('stroke','#99000d');
                        year=i.Year;
                        document.getElementById("vizRange").value=i.Year;
                        createStationCircles();

                    }
                    else{
                        d3.select(allRect[j]).style('stroke-width','0.05%').
                        style('stroke', '#000');
                    }
                });
            });
        
    // Here we render the x axis
    d3.select(".chart1").append('g')
        .attr('class', 'x-axis')
        // First set its container's (g) position to the 
        // bottom of the chart
        .attr('transform', `translate(0,${ barHeight - margin.bottom })`)
        // then just call this to render it
        .call( xAxis )

    // it works the same for the y axis
    d3.select(".chart1").append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${ margin.left },0)`)
        .call( yAxis );

    })

}

function updateSelectedBar(){
    var allRect=d3.selectAll(".bar").nodes();
    d3.selectAll('.bar').each((k,j) =>{
        if(parseInt(k.Year,10)==year){
            //d3.select(this).style('stroke-width','0.2%');
            d3.select(allRect[j]).style('stroke-width','0.2%')
            .style('stroke','#99000d');
        }
        else{
            d3.select(allRect[j]).style('stroke-width','0.05%')
            .style('stroke', '#000');
        }
    });
}

function createStationScatter(){

    for(let i=0; i<subStations.length; i++){
        console.log(subStations[i]);

    }
}

function msg(){
    console.log('HejHej');
}