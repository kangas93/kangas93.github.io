
var stationData=d3.csv('./../data/stationsDataProto2.csv');
var meanSum=d3.csv('./../data/meanSum30.csv');
mapWidth=800;
mapHeight=600;
barWidth=2000;
barHeight=400;
var margin = ({
    top: 20,
    right: 150, // 10
    bottom: 20,
    left: 150 // 35
  });

var year =1970;

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

function setYear(){
    year=parseInt(document.getElementById("vizRange").value,10);
    createStationCircles();
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

    var legendData=[999]
    for (let i = 0; i < 21; i++) {
        if( (i % 5) == 0){
            legendData.push(i);
        }
    }
    const circles = d3.select('.chart2').append('g')
            .attr("class", "legend")
            .selectAll('circle')
            .data( legendData )
            .join('circle')
            
            circles.call(g => g
                .attr("r",d => getValueOfYearLegend(d))
                .style("fill",d=>getColorOfYearLegend(d))
                .style("stroke",'#000')
                .style("stroke-width",'0.1%')
                .style("opacity","0.7")
                .attr("transform", (d,i) => {
                    return "translate(800,"+45*i+")";
                }))
                .call(g => g
                    // then we append a text label to the data point
                    .append('text')
                    .attr('font-size', "100%")
                    .attr('font-color', "#000")
                    .attr('x', 10)
                      .attr('dy', '0.35em')
                    // I've filter out values too low in order to avoid label overlap
                    // see what happens if you remove the condition and just return d.company
                    .text(d=> getValueOfYearLegend(d))
                   );
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

function projectPoints(data){
    points=sweGeo.then(function(geo) {
        return d3.geoMercator().fitSize([mapWidth,projHeigth],geo);})
        .then(function(projection){
            var coord = projection([data.Longitude,data.Latitude]);
            return coord;
        }).then(function(c){
           return "translate(" + c + ")";
        })
    return points.then(function(result) {
        console.log(result);
        return result;
    });
}

function projectPoints2(data){
    return proj1.then(function(c){
        var coord = projection([data.Longitude,data.Latitude]);
        return coord;
    })
    .then(function(c){
        return "translate(" + c + ")";
     });

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
            .text('Year: '+year);
            
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
                .style("opacity","0.7")
                .attr("transform", (d,i) => {
                    return stationPosition[i];
                })
                .on("mouseover", function (d,c) {
                    d3.select(this)
                    .style("stroke-width",'0.2%')
                    .raise();
                    d3.select(".chart2 .infotext").text(c['Name']+': '+c[year]);
                    }
                )
            .on("mouseout", function (d) {
            d3.select(this)
            .style("stroke-width",'0.1%');
            d3.select(".chart2 .infotext").text('Year: '+year);
            //d3.select(".infobox").style('visibility', 'hidden');
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

        d3.select(".chart1").append('g')
        .attr('class', 'bars')
        .selectAll('rect')
        .data( data )
        .join('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(parseInt(d.Year,10)))
        .attr('y', d => yScale(parseInt(d.Mean, 10)))
        // bandwidth is a special function of scaleBand
        // it returns the width of the band (bar) based on the configuration
        // we set up earlier
        .attr('width', xScale.bandwidth())
        // remember that yScale(0) is the height of the entire chart
        // so we subtract the y position of the top of the bar yScale(d.value)
        // from it to get the total height of the bar.
        .attr('height', d => yScale(0) - yScale(parseInt(d.Mean, 10)))
        .style('fill', '#7472c0')
    
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

function msg(){
    console.log('HejHej');
}