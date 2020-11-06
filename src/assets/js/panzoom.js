$.isMobile = () =>
  /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent.toLowerCase()
  );
let orbitPan = $(".orbit-container")[0];
orbitPan = Panzoom(orbitPan, {
  exclude: Array.from(document.querySelectorAll("image")),
  minScale: 1,
  cursor: "auto",
});
function checkScale(scale) {
  if (scale >= 4) {
    $(".zoom-controls .plus").addClass("disabled");
    $(".zoom-controls .minus").removeClass("disabled");
  } else if (scale <= 1) {
    $(".zoom-controls .plus").removeClass("disabled");
    $(".zoom-controls .minus").addClass("disabled");
  } else {
    $(".disabled").removeClass("disabled");
  }
}
$(".orbit-container")[0].addEventListener("panzoomchange", (event) => {
  checkScale(event.detail?.scale);
});
$.zoomControl = function(el, action) {
  switch (action) {
    case "zoom-in":
      let scale = orbitPan.getScale() + 0.5;
      checkScale(scale);
      orbitPan.zoom(scale, { animate: true });
      break;
    case "reset":
      orbitPan.reset();
  }
};
