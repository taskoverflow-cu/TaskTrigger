
$(function(){
    // datetime picker
    (function(){
        $('.datepicker').datepicker();
        $('.timepicker').timepicker();

    }());

    // tags
    (function(){
        $('.chips').chips();

        $('.chips-placeholder').chips({
            placeholder: 'Enter a tag',
            secondaryPlaceholder: '+Tag',
            limit: 20,
          });
    }());
    
    
    // select
    (function(){
        $('select').formSelect();
    }());
});