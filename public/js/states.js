var ie = $('body').hasClass('ie8') || $('body').hasClass('ie7') || $('body').hasClass('ie6') || silk === true;
var silk = navigator.userAgent.toLowerCase().indexOf("silk") >= 0;
var iframe = false;
    if (document.location.href.indexOf('template=iframe') !== -1) {
        iframe = true;
        $('body').addClass('iframe');
    };

	if (!ie){
      //using the big container instead of map contaier because that works for iframes


      var low = 60;
      var high = 75;
      var counts = [];


    function isBigEnough(value) {
      return value > 0;
    }


      $(function() {
          $( "#slider-range" ).slider({
            range: true,
            min: 9,
            max: 108,
            values: [ low, high ],
            slide: function( event, ui ) {
              
              $( "#amount" ).val( ui.values[ 0 ] + " degrees to " + ui.values[ 1 ] + " degrees" );
              update(ui.values[0], ui.values[1]);
            }
          });
          $( "#amount" ).val($( "#slider-range" ).slider( "values", 0 ) +
            " degrees to " + $( "#slider-range" ).slider( "values", 1 ) + " degrees" );
        });


      function update(ll,hh) {  
          //console.log(ll-7,hh);

          counts = [];
          data.forEach(function(d) { 
            var count = 0;

              for(var i = ll; i < hh+1; i++){
                var accessor = "d" + i;
                var num = +d[accessor];

                
                  count += num;
                
        
              }
              d.count = count;

              counts.push(count);
              dataMap.set(d.code, +d[vv]); 
         });

          var filtered = counts.filter(isBigEnough);
          q.domain(filtered);

          var extent = d3.extent(filtered)

          //set min label
          svg.selectAll("#leftlabel")
          .text(extent[0]);

          //set max label
          svg.selectAll("#rightlabel")
          .text(extent[1]);

          svg.selectAll(".cc")
              .attr("fill", function(d) {

              if(!isNaN(dataMap.get(d.id))) {

                    if(dataMap.get(d.id) == 0) {
                      return "#eee";
                    }
                    return q(dataMap.get(d.id))
                    
                  } else { 
                    return "#ccc";
                  } 

              })
      }

      var data = []

      var width = parseInt($('body').width())
          , width = width
          , mapRatio = .75
          , emBiggen = 1.39
          , height = width * mapRatio;

      var projection = d3.geo.albersUsa()
          .scale(width*emBiggen)
          .translate([width / 2, height / 2]);

      var path = d3.geo.path()
            .projection(projection);

      var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height);



      var dataMap = d3.map();
      var nameMap = d3.map();

      var cs = ['rgb(255,255,217)','rgb(237,248,177)','rgb(199,233,180)','rgb(127,205,187)','rgb(65,182,196)','rgb(29,145,192)','rgb(34,94,168)','rgb(37,52,148)','rgb(8,29,88)']

      var q = d3.scale.quantile()
      .range(cs);


//key
      svg.selectAll("rect")
        .data(cs)
        .enter()
        .append("rect")
        .attr("x", function(d,i){
          return 25 + (i * 50);
        })
        .attr("y", 10)
        .attr("width", 50)
        .attr("height", 10)
        .attr("fill", function(d) {return d})

      svg.append("text")
        .attr("id", "leftlabel")
        .style({"font-size":"18px","font-weight":"bold", "fill":"#333", "text-anchor": "end"})
        .attr("x", 20)
        .attr("y", 20)
        .text("34"); 

      svg.append("text")
        .attr("id", "rightlabel")
        .style({"font-size":"18px","font-weight":"bold", "fill":"#333"})
        .attr("x", 480)
        .attr("y", 20)
        .text("264"); 



      var vv = "count";
	}

(function($){

    $(document).ready(function() {
      if (!ie) {
        makeMap();
      } else {
       document.getElementById("map").innerHTML = '<img src="data/oldbrowser.png">'
      }
    }); // close of document ready

//
// BUILD MAP FUNCTIONS
//




    function makeMap(){

      queue()
          .defer(d3.json, "data/us.json")
          .defer(d3.csv, "data/t2.csv", function(d) { 
              data.push(d);
              var count = 0;

              for(var i = low; i < high+1; i++){
                var accessor = "d" + i;
                var num = +d[accessor];
                count += num;
                
        
              }
              d.count = count;
             
            dataMap.set(d.code, +d[vv]); 
            nameMap.set(d.code, d.county); 

            counts.push(count)
          })
          .await(ready);
          
    }



    function ready(error, us) {
    var filtered = counts.filter(isBigEnough);

    var extent = d3.extent(filtered)

    //set min label
    svg.selectAll("#leftlabel")
    .text(extent[0]);

    //set max label
    svg.selectAll("#rightlabel")
    .text(extent[1]);

    q.domain(filtered);

    var g = svg.append("g").attr("class", "counties");
    svg.append("defs").append("path")
      .attr("id", "land")
      .datum(topojson.feature(us, us.objects.land))
      .attr("d", path);
        
        // clips
        svg.append("clipPath")
          .attr("id", "clip-land")
          .append("use")
          .attr("xlink:href", "#land"); 

        g.attr("clip-path", "url(#clip-land)")
      
        // counties
        .selectAll("path")
          .data(topojson.feature(us, us.objects.counties).features)
          .enter().append("path")
          .attr("class","cc")
          .attr('id', function(d){return cleanFips(d.id)})
          .attr("fill", function(d) {

            if(!isNaN(dataMap.get(d.id))) {

                  if(dataMap.get(d.id) == 0) {
                    return "#eee";
                  }
                  return q(dataMap.get(d.id))
                  
                } else { 
                  return "#ccc";
                } 

          })
          .attr('vector-effect', 'non-scaling-stroke')
          .attr("d", path)
          .on("mouseover", function (d) {
            
            var county = d3.select(this);
            county.classed('active', true);
            this.parentNode.appendChild(this);
            showTooltip(d);
          })
          .on("mouseout", function (d) {
            statesToFront(svg);
            var county = d3.select(this);
            county.classed('active', false);
            $.hideTooltip('map');
          })

        var s = g.append('g').attr('class', 'states');
        //states
        s.append("path")
          .attr("class", "state-boundaries")
          .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
          .attr("d", path)
          .attr("fill","none")
          .attr('vector-effect', 'non-scaling-stroke');  

        d3.select(window).on('resize', resize);
        resize();
    };

    function statesToFront(svg){
      var states = svg.selectAll('g.states');
      $.each(states[0], function(k,v){
        v.parentNode.appendChild(v)
      });
    }

    function resize() {
      // adjust things when the window size changes
      width = parseInt(d3.select('#map').style('width'));
      width = width;
      height = width * mapRatio;

      // update projection
      projection
          .translate([width / 2, height / 2])
          .scale(width*emBiggen);

      // resize the map container
      svg
          .style('width', width + 'px')
          .style('height', height + 'px');

      // resize the map
      d3.selectAll('.counties path').attr('d', path);
      d3.selectAll('.state-boundaries path').attr('d', path);
      d3.selectAll('#land').attr('d', path);
      d3.selectAll('#clip-land').attr('d', path);
  };

  function showTooltip(dd){
      $.showTooltip({
          wrapperId: 'map',
          data: dd,
          contentFunction: function(d) {

              var lbl = dataMap.get(dd.id);
              var text = lbl;
              
              if(nameMap.get(dd.id)){
              return '<p class="franklin">'+nameMap.get(dd.id)+'</p>' + getWords(text);
            } else {
              return "No data for Alaska or Hawaii. Bummer!";
            }
          },
          xOffset: 10, // Optional: Defaults to 20
          yOffset: 0 //Optional: Defaults to 0
      });
  }

  function getWords(gg) {
    
      return '<p class="franklin">On average, the high temperature is within the range you selected <strong>'+ gg +'</strong> days of the year. </p>'
  }

  //we need this because this json file drops zeroes sometimes! worst!
  function cleanFips(d) {
      var f = String(d);
      len = f.length;

        return f;
      
    };

})(jQuery);