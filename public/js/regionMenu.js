    <script>
        $(function() {
            $( "#regions" )
                .selectmenu()
                .selectmenu( "menuWidget" )
                .addClass( "overflow" );
        });
    </script>
    <style>
    fieldset {
      border: 0;
    }
    label {
      display: block;
      margin: 10px 0 0 0;
    }
    select {
      width: 300px;
    }
    .overflow {
      height: 200px;
    }
  </style>

    <form action="#"> 
      <fieldset>
        <label for="regions">Select a region</label>
        <select name="regions" id="regions">
            <option value="balt" selected="selected">Baltimore City</option>
            <option value="greater_balt">Baltimore City and County</option>
            <option value="maryland">Maryland</option>
        </select>
      </fieldset>
    </form>