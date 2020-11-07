$.isMobile = () =>
  /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent.toLowerCase()
  );
let orbitPan = $(".orbit-container")[0];
orbitPan = Panzoom(orbitPan, {
  exclude: Array.from(document.querySelectorAll("g.node:not(.parent)")),
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
  orbitPan.setOptions({ disablePan: scale === 1 });
}
$(".orbit-container")[0].addEventListener("panzoomzoom", (event) => {
  const { scale } = event.detail;
  if (scale === 1) {
    orbitPan.reset();
  }
});
$(".orbit-container")[0].addEventListener("panzoomchange", (event) => {
  const { scale } = event.detail;
  checkScale(scale);
});
$.zoomControl = function(action) {
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
function resetOnDesktop() {
  if (!$.isMobile()) {
    orbitPan.reset();
    orbitPan.setOptions({ disablePan: true });
  } else {
    orbitPan.setOptions({ disablePan: false });
  }
}
//$(window).on("resize", resetOnDesktop);
//resetOnDesktop();
$(".orbit-container")[0].parentElement.addEventListener("wheel", function(
  event
) {
  const { deltaY, ctrlKey } = event;
  if (ctrlKey) return;
  if (deltaY > 0) orbitPan.zoom(orbitPan.getScale() - 0.5);
  else orbitPan.zoom(orbitPan.getScale() + 0.5);
});
