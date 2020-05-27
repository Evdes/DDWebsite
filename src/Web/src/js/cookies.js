if (localStorage.getItem("cookie-consent") != "true") {
    $(".cookie-banner").delay(500).fadeIn();
  };

  $(".close-banner").click(function() {
    localStorage.setItem("cookie-consent", "true");
    $(".cookie-banner").fadeOut();
  })