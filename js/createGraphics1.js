function loadAndCreateMap(){
    var sweGeo=fetch('./../data/jsonSwe.json')
    .then(response => response.text())
    .then((data) => {
      var jData =JSON.parse(data)
      return topojson.feature(jData,jData.objects.data);
      });
    
  var projection=d3.geoMercator().fitSize([80,80],sweGeo);
  var geoPath= d3.geoPath().projection(projection);

  const map = d3.select('svg').append("g")
    .attr("class", "map")
    .selectAll("path")
    .data(sweGeo.features)
    .join("path")
    .attr("class", "Sweden")
    .attr("fill", '#d9d9d9')
    .attr("d", geoPath);
    map.node();

}

function makeDemo1() {                                      
    d3.tsv( "test.tsv" )                            
        .then( function( data ) {                              
            d3.select( "svg" )                                 
                .selectAll( "circle" )                         
                .data( data )                                  
                .enter()                                       
                .append( "circle" )                            
                .attr( "r", 5 ).attr( "fill", "red" )          
                .attr( "cx", function(d) { return d["x"] } )   
                .attr( "cy", function(d) { return d["y"] } );
        } );
}

function msg(){
    console.log('HejHej');
}