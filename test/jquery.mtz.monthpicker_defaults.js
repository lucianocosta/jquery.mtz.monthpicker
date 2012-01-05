    
$(document).ready(function () {

  $('#monthpicker').monthpicker()

  var isVisible = function () {
    window.setTimeout(function () {
      equals( $('#mtz-monthpicker').css('display'), 'block', 'should display the widget')
    },500);
  };
  
  var isHidden = function () {
    window.setTimeout(function () {
      equals( $('#mtz-monthpicker').css('display'), 'none', 'should hide the widget')
    },500);
  };

  test('first call to show()', function () {
    $('#monthpicker').click();
    isVisible();
    equals( $('.mtz-monthpicker').length, 41, 'should create html elements after the first call to show()');
  });

  test('call to hide()', function () {
    $('.monthpicker').hide();
    equals( $('.mtz-monthpicker').length, 41, 'should not destroy any html element after call to hide()');
    isHidden();
  });

  test('subsequent calls to show()', function () {
    $('#monthpicker').click();
    equals( $('.mtz-monthpicker').length, 41, 'should NOT create any html elements after the first call to show()');
  });

  test('user interaction', function () {
    $('#monthpicker').click();
    isVisible();
    $('#mtz-monthpicker-year').find('option[value=2011]').attr('selected','selected');
    $('#mtz-monthpicker').find('td[data-month=2]').click();
    window.setTimeout(function () {
      equals( $('#monthpicker').val(), '02/2011', 'should select "02/2011"');
    },500);
    isHidden();
  });

});