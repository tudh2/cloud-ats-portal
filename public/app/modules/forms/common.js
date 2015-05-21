define(function() {
  return {
    validateOptions: {
      errorElement: 'em',
      errorClass: 'invalid',
      highlight: function(element, errorClass, validClass) {
        $(element).addClass(errorClass).removeClass(validClass);
        $(element).parent().addClass('state-error').removeClass('state-success');
      },
      unhighlight: function(element, errorClass, validClass) {
        $(element).removeClass(errorClass).addClass(validClass);
        $(element).parent().addClass('state-success').removeClass('state-error');
      },
      errorPlacement: function(error, element) {
        error.insertAfter(element.parent());
      }
    }
  }
})