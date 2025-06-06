jQuery(document).ready(function (b) {
  var a = b('tr#password');
  if (a.length) {
    a.next('tr')
      .find('.indicator-hint')
      .html(
        'To make a strong password, it\'s usually best to use a passphrase. Here\'s <a href="http://xkcd.com/936/" target="_blank">how and why</a>. You can also use <a href="https://dl.dropboxusercontent.com/u/209/zxcvbn/test/index.html" target="_blank">this strength tester</a> for more details on your password choice.'
      );
  }
});
