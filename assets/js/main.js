!function (e) { var a = e(window), l = e("body"), s = e("#main"); breakpoints({ xlarge: ["1281px", "1680px"], large: ["981px", "1280px"], medium: ["737px", "980px"], small: ["481px", "736px"], xsmall: ["361px", "480px"], xxsmall: [null, "360px"] }), a.on("load", function () { window.setTimeout(function () { l.removeClass("is-preload") }, 100) }); var t = e("#nav"); if (t.length > 0) { s.scrollex({ mode: "top", enter: function () { t.addClass("alt") }, leave: function () { t.removeClass("alt") } }); var i = t.find("a"); i.scrolly({ speed: 1e3, offset: function () { return t.height() } }).on("click", function () { var a = e(this); "#" == a.attr("href").charAt(0) && (i.removeClass("active").removeClass("active-locked"), a.addClass("active").addClass("active-locked")) }).each(function () { var a = e(this), l = a.attr("href"), s = e(l); s.length < 1 || s.scrollex({ mode: "middle", initialize: function () { browser.canUse("transition") && s.addClass("inactive") }, enter: function () { s.removeClass("inactive"), 0 == i.filter(".active-locked").length ? (i.removeClass("active"), a.addClass("active")) : a.hasClass("active-locked") && a.removeClass("active-locked") } }) }) } e(".scrolly").scrolly({ speed: 1e3 }) }(jQuery);