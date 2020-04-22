var s_account = undefined;
var s_code_src = document.getElementsByTagName("script")[document.getElementsByTagName("script").length-1].src;
var currentUrl = window.location.href;

function isProductionUrl() {
  return currentUrl.indexOf("docs.netapp.com") > -1
    && currentUrl.indexOf("clouddocs.netapp.com") == -1
    && containsLocale(currentUrl)
}

function containsLocale(url) {
  var regex = /[a-zA-Z]{2}\-[a-zA-Z]{2}\/.+$/g;
  return regex.test(url);
}

function getApiUrl() {
  var baseEndpoint = s_code_src.indexOf("cssweb") > -1 ? "https://mysupport.netapp.com/css/cssweb/js/" : "https://mysupport.netapp.com/NOW/public/js/";
  return baseEndpoint+'s_code.js';
}

// Get the current timestamp and convert it to PST
function getTimestamp() {
  var d = new Date();
  var nd = new Date(((d.getTime()+(d.getTimezoneOffset()*60000))+(3600000*-7)));
  return {"timestamp":nd.getHours()+":"+(nd.getMinutes()<10?'0':'') + nd.getMinutes(), "day":['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][nd.getDay()]};
}

function getUrlContext() {
  var uhref = window.location.href;
  var url = uhref.substring(uhref.indexOf('/', 8) + 1);
  var arr = url.split("/");
  return arr[0];
}

function getUrlContext2() {
  var uhref = window.location.href;
  var url = uhref.substring(uhref.indexOf('/', 8) + 1);
  var arr = url.split("/");
  return arr[0] + "/" + arr[1];
}

function setDefaultParams(cloudParams) {
  cloudParams = cloudParams || {};
  var hrefChunks = window.location.href.split('/');
  var projectId = 'CloudDocs';
  var lang = hrefChunks[3];
  var productId = hrefChunks[4];

  var _date = getTimestamp();

  cloudParams.channel = projectId+':'+productId;
  cloudParams.pageName = 'NSS:Documentation:'+projectId+':'+productId+':'+document.title;
  cloudParams.pageType = "html";
  cloudParams.server = projectId;

  cloudParams.prop1 = getUrlContext();
  cloudParams.prop2 = getUrlContext2();
  cloudParams.prop35 = lang;
  cloudParams.prop37 = cloudParams.server;
  cloudParams.prop39 = s_account;
  cloudParams.prop52 = _date.timestamp;
  cloudParams.prop53 = _date.day;

  cloudParams.eVar35 = cloudParams.prop35;
  cloudParams.eVar37 = cloudParams.prop37;
  cloudParams.eVar39 = cloudParams.prop39;
}

function sendAnalyticsPageLoad(cloudParams) {
  cloudParams = cloudParams || {};
  $.getScript(getApiUrl(), function () {
    if (typeof(s) == "undefined") {
      return;
    }

    $.extend(s,cloudParams);
    s.t();
  });
}

function sendAnalyticsSearchClick(searchParams, cloudParams) {
  cloudParams = cloudParams || {};
  var linkParams = {
    "prop28": cloudParams.channel+":Search Results",
    "prop29": searchParams.searchString,
    "href": searchParams.href,
  };
  sendAnalyticsLinkClick(linkParams, cloudParams);
}

function sendAnalyticsPdfDownload(pdfParams, cloudParams) {
  cloudParams = cloudParams || {};
  var linkParams = {
    "prop28": cloudParams.channel+":pdf:"+pdfParams.level,
    "prop29": pdfParams.title,
    "href": pdfParams.href,
  };
  sendAnalyticsLinkClick(linkParams, cloudParams);
}

function sendAnalyticsLinkClick(linkParams, cloudParams) {
  cloudParams = cloudParams || {};
  cloudParams.prop28 = linkParams.prop28;
  cloudParams.prop29 = linkParams.prop29;
  cloudParams.prop50 = linkParams.href;
  cloudParams.eVar28 = cloudParams.prop28;
  cloudParams.eVar29 = cloudParams.prop29;
  cloudParams.eVar50 = cloudParams.prop50;
  cloudParams.linkTrackVars = "prop28,prop29,prop50,eVar28,eVar29,eVar50,";
  cloudParams.linkTrackEvents = "None"; //(this allows to trigger following events)

  $.getScript(getApiUrl(), function () {
    if (typeof(s) == "undefined") {
      return;
    }

    $.extend(s,cloudParams);
    s.tl(true, "o", "Link Clicked");
    delete cloudParams.prop28;
    delete cloudParams.prop29;
    delete cloudParams.prop50;
    delete cloudParams.eVar28;
    delete cloudParams.eVar29;
    delete cloudParams.eVar50;
    delete s.prop28;
    delete s.prop29;
    delete s.prop50;
    delete s.eVar28;
    delete s.eVar29;
    delete s.eVar50;
  });
}

function qs(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

function pdfLevel(url) {
  if (url == null) return "other";
  else if(url.indexOf("pdfs/fullsite-sidebar") > -1) return "site";
  else if(url.indexOf("pdfs/sidebar") > -1) return "section";
  else if(url.indexOf("pdfs/pages") > -1) return "topic";
  else return "other";
}

function cleanTitle(title) {
  if(title == null) return "none";
  var bar = title.indexOf("|");
  return (bar > -1) ? title.substring(0, bar-1).trim() : title;
}

$(document).ready(function() {
  if (currentUrl == null) {
    return;
  }

  if (isProductionUrl()) {
    s_account = "networkapplsupport-global";
  } else {
    s_account="networkapplsupport-global-dev";
  }

  var cloudParams = {};
  setDefaultParams(cloudParams);

  if (!cloudParams.hasOwnProperty('prop35') || (typeof cloudParams.prop35 === "undefined") || cloudParams.prop35.length == 0) {
    return;
  }

  sendAnalyticsPageLoad(cloudParams);

  $('#search-demo-container').on("click", "a", function(){
    var searchResultUrl = this.href;
    if (searchResultUrl == null || searchResultUrl.indexOf("http") != 0) {
      var inputHref = $( this ).attr("href");
      searchResultUrl = window.location.protocol + "//" + window.location.hostname;
      searchResultUrl = window.location.port ? searchResultUrl+":"+ window.location.port : searchResultUrl;
      searchResultUrl = searchResultUrl + (inputHref.indexOf("/") == 0 ? "" : "/") + inputHref;
    }

    var searchParams = {
      "html": $( this ).prop("outerHTML"),
      "pageName": $( this ).children('.sk-hits-hit__title').first().text(),
      "searchString": qs('q'),
      "href": searchResultUrl
    };

    sendAnalyticsSearchClick(searchParams, cloudParams);
  });

  // Topic Link Click
  $('article:first, #toggleContainerPdf').on("click", "a", function() {
    var topicLink = this.href;
    if (topicLink == null || topicLink.indexOf("http") != 0) {
      var clickedLink = $( this ).attr("href");
      topicLink = window.location.protocol + "//" + window.location.hostname;
      topicLink = window.location.port ? pdfUrl+":"+window.location.port : topicLink;
      topicLink = topicLink + (clickedLink.indexOf("/") == 0 ? "" : "/") + clickedLink;
    }

    var linkLevel = pdfLevel(topicLink);
    var fromContainer = $( this ).parents('#toggleContainerPdf').length > 0;
    if (fromContainer || linkLevel != "other") {
      var pdfParams = {
        "fileName": topicLink.substring(topicLink.lastIndexOf("/") + 1),
        "title": fromContainer ? $( this ).text().trim() : cleanTitle(document.title),
        "level": linkLevel,
        "href": topicLink
      };
      sendAnalyticsPdfDownload(pdfParams, cloudParams);
    }
  });
});
