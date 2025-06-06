jQuery(function ($) {
  function getCookie(cname) {
    var name = cname + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }
  if ($('body').hasClass('search-results')) {
    if (!window.adobeDataLayer) {
      window.adobeDataLayer = window.adobeDataLayer || [];
    }
    adobeDataLayer.push({
      event: 'search',
      page: { language: language },
      site: { environment: environment, code: (getCookie('entity') || '').toLowerCase() },
      search: { keyword: search_query, result: total_results },
    });
  }
});
jQuery(function ($) {
  var aVisitor = Visitor.getInstance('F64735DD5CF122370A495FCD');
  $('a').each(function () {
    var oldURL = $(this).attr('href');
    if (/^https:\/\/(login|portal|apply)/g.test(oldURL)) {
      var newURL = aVisitor.appendVisitorIDsTo(oldURL);
      $(this).attr('href', newURL);
    }
  });
});
if (!window.adobeDataLayer) {
  window.adobeDataLayer = window.adobeDataLayer || [];
}
console.log(aanumber_data);
adobeDataLayer.push({
  event: 'pageview',
  page: { language: aanumber_data.lang_code },
  site: { environment: aanumber_data.env, code: aanumber_data.entity_code },
});
jQuery(document).ready(function ($) {
  jQuery(document).on('submit_success', function () {
    console.log(aanumber_data);
    var aanumber = getCookie('aanumber');
    var is_demo = getCookie('elementor_demo');
    document.cookie = 'elementor_demo=;expires=Thu,01 Jan 1970 00:00:00 UTC;path=/;';
    var usertype = 'lead';
    if (is_demo) usertype = 'demo';
    adobeDataLayer.push({
      event: 'registration',
      page: { language: aanumber_data.lang_code },
      site: { environment: aanumber_data.env, code: aanumber_data.entity_code },
      user: { type: usertype, id: '', aanumber: aanumber },
    });
  });
});
