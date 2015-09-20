// From http://stackoverflow.com/questions/967372/jquery-slider-how-to-make-step-size-change

$(function() {
    var trueValues = [" < $10000", "$10000", "$15000", "$20000", "$25000", "$30000", "$35000", "$40000", "$45000", "$50000", "$60000", "$75000", "$100000", "$125000", "$150000", "$200000", " > $200000"];

    var values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30, 40, 41]

    var slider = $("#income-range").slider({
        orientation: 'horizontal',
        range: true,
        min: 1,
        max: 41,
        values: [4, 15],
        slide: function(event, ui) {
            var includeLeft = event.keyCode != $.ui.keyCode.RIGHT;
            var includeRight = event.keyCode != $.ui.keyCode.LEFT;
            var value = findNearest(includeLeft, includeRight, ui.value);
            if (ui.value == ui.values[0]) {
                slider.slider('values', 0, value);
            }
            else {
                slider.slider('values', 1, value);
            }
            $("#amount").val(getRealValue(slider.slider('values', 0)) + ' to ' + getRealValue(slider.slider('values', 1)));
            return false;
        },
        change: function(event, ui) { 
            getHomeListings();
        }
    });

    $("#amount").val(getRealValue(slider.slider('values', 0)) + ' to ' + getRealValue(slider.slider('values', 1)));

    function findNearest(includeLeft, includeRight, value) {
        var nearest = null;
        var diff = null;
        for (var i = 0; i < values.length; i++) {
            if ((includeLeft && values[i] <= value) || (includeRight && values[i] >= value)) {
                var newDiff = Math.abs(value - values[i]);
                if (diff == null || newDiff < diff) {
                    nearest = values[i];
                    diff = newDiff;
                }
            }
        }
        return nearest;
    }

    function getRealValue(sliderValue) {
        for (var i = 0; i < values.length; i++) {
            if (values[i] >= sliderValue) {
                return trueValues[i];
            }
        }
        return 0;
    }

});