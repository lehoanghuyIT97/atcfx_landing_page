jQuery(document).ready(function (t) {
  var s = t('#pass-strength-result');
  s.length &&
    s.parents('form').on('submit', function () {
      t(this).append('<input type="hidden" name="slt-fsp-pass-strength-result" value="' + s.attr('class') + '">');
    });
});
