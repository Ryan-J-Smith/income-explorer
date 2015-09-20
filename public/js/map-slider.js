$(function() {
  $( "#income-range" ).slider({
    orientation: 'horizontal',
    range: true,
    min: 0,
    max: 205000,
    step: 5000,
    values: [10000, 60000],
    slide: function( event, ui ) {
      $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
    }
  });
  $( "#amount" ).val( "$" + $( "#income-range" ).slider( "values", 0 ) +
  " - $" + $( "#income-range" ).slider( "values", 1 ) );
});
