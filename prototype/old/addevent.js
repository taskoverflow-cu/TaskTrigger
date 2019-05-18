
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


    // cancel POST for S3
    (function(){
        $(".waves-effect").click(function(){
            return false;
        });
    }());
});