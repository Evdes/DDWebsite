import $ from 'jquery';
window.jQuery = $;
window.$ = $;
import "bootstrap";
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'
import "../css/app.scss";

$(function(){
    $("#nav-placeholder").load("navbar.html");
    $("#footer-placeholder").load("footer.html");
  });
