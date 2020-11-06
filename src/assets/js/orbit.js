const ORBIT_SIZE = 4000;
const ORBIT_SPEED = 20;
const ORBIT = false;
const RAISE_OFFSET = (i) => i >= 0 && i <= 36;
let lineAnimationTick;

window.animateCurrentBlock = function() {};

function makeViz(size = [ORBIT_SIZE, ORBIT_SIZE]) {
  d3.json("assets/js/validators.json", function(data) {
    drawOrbit(data, size);
    window.data2 = data?.children;
    $("#viz")
      .css("width", size[0])
      .css("height", size[1]);
    $("#viz svg")
      .css("width", size[0])
      .css("height", size[1]);
  });
}

function drawOrbit(_data, size) {
  var div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  colors = d3.scale.category20b();

  orbitScale = d3.scale
    .linear()
    .domain([1, 3])
    .range([3.8, 1.5])
    .clamp(true);
  radiusScale = d3.scale
    .linear()
    .domain([0, 1, 2, 3])
    .range([20, 10, 3, 1])
    .clamp(true);

  orbit = d3.layout
    .orbit()
    .size(size)
    .children(function(d) {
      return d.children;
    })
    .revolution(function(d) {
      return d.depth;
    })
    .orbitSize(function(d) {
      return orbitScale(d.depth);
    })
    .speed(0.1)
    .nodes(_data);
  d3.select("svg")
    .selectAll("g.node")
    .data(orbit.nodes())
    .enter()
    .append("g")
    .attr("class", function(d) {
      if (!d.parent) {
        return "node parent";
      } else {
        return "node";
      }
    });

  orbit
    .nodes()
    .filter((q) => !!q.parent)
    .forEach((d, i) => {
      d3.selectAll("g.node.parent")
        .append("g")
        .attr("class", "line-group cyan")
        .append("line")
        .attr("class", "connector")
        .attr("data-name", d.name)
        .attr("stroke", "cyan")
        .attr("x2", 0)
        .attr("y2", 0)
        .attr("stroke-dasharray", "6,6")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", "2px");
    });
  d3.selectAll("g.line-group.cyan")
    .append("image")
    .attr("class", "cube-tween")
    .attr("href", "assets/images/cube-tween.svg")
    .attr("width", "50");

  d3.selectAll("g.node.parent")
    .append("image")
    .attr("href", "assets/images/cube-center.svg")
    .attr("width", "250")
    .attr(
      "style",
      `transform: translate(-256px, -200px) scale(6) rotateY(55deg);
      -webkit-transform: translate(-256px, -200px) scale(6) rotateY(55deg)`
    );

  d3.selectAll("g.node:not(.parent)")
    .append("image")
    .attr("href", function(d) {
      return d.logo;
    })
    .attr("class", "node-logo")
    .attr("width", 50)
    .on("mousedown", function(d, i) {
      let name = "validator-" + i;
      let offset =
        $("a[name=" + name + "]").offset().top -
        $("a[name=" + name + "]")
          .offsetParent()
          .offset().top;
      $(".validator-info").animate(
        {
          scrollTop: offset + $(".validator-info").scrollTop(),
        },
        500
      );
    })
    .on("mouseover", nodeOver)
    .on("mouseout", nodeOut);

  d3.selectAll("g.node:not(.parent)")
    .append("image")
    .attr("href", "assets/images/node.svg")
    .attr(
      "style",
      `transform: translate(-130px, -270px) rotateY(55deg) scale(3);pointer-events:none;-webkit-transform: translate(-130px, -270px) rotateY(55deg) scale(3);pointer-events:none;`
    );
  d3.select("svg")
    .selectAll("circle.orbits")
    .data(orbit.orbitalRings())
    .enter()
    .insert("circle", "g")
    .attr("class", "ring")
    .attr("r", function(d) {
      return d.r;
    })
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })
    .style("fill", "none")
    .style("stroke", "cyan")
    .style("stroke-width", "2px")
    .style("stroke-opacity", 1);
  function raise(d) {
    d3.selectAll("g.node").each(function() {
      let datum = d3.select(this).datum();
      if (datum.name === d.name) {
        if (this.previousSibling)
          this.parentNode.insertBefore(this, this.parentNode.firstChild);
      }
    });
    d3.selectAll("circle").each(function() {
      if (this.previousSibling)
        this.parentNode.insertBefore(this, this.parentNode.firstChild);
    });
    d3.selectAll("g.node.parent").each(function() {
      if (this.previousSibling)
        this.parentNode.insertBefore(this, this.parentNode.firstChild);
    });
  }
  orbit.on("tick", function() {
    let toBeRaised = [];
    d3.selectAll("g.node").attr("style", function(d, i) {
      let transform = "transform:translate(" + d.x + "px," + d.y + "px); ";
      if (RAISE_OFFSET(i)) {
        toBeRaised.push(d);
      }
      if (!(d.angle % 1));
      return transform;
    });
    toBeRaised.forEach(function(d) {
      raise(d);
    });
    d3.selectAll("circle.ring")
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      });
  });

  function isSelected(el, currentBlock) {
    let name = el.getAttribute("data-name");
    let node = window.data2?.find((q) => q.name === name);
    if (node && currentBlock) {
      if (!!node.address?.find((q) => q === currentBlock.author)) {
        d3.selectAll("line.connector").each(function() {
          if (this.getAttribute("data-name") === name) {
            d3.select(this).attr("stroke", "cyan");
          } else {
            d3.select(this).attr("stroke", "#684999");
          }
        });
        return true;
      }
    }
  }
  function drawLines(block) {
    d3.selectAll("line.connector")
      .attr("x1", function(d) {
        let name = this.getAttribute("data-name");
        let node = d?.children?.find((q) => q.name === name);
        if (node) {
          return node.x - d.ring;
        } else return 0;
      })
      .attr("y1", function(d) {
        let name = this.getAttribute("data-name");
        let node = d?.children?.find((q) => q.name === name);
        if (node) return node.y - d.ring;
        else return 0;
      })
      .attr("style", "display:block")
      .attr("stroke", "#684999");
  }
  function drawCubes(block) {
    d3.selectAll("g.line-group.cyan").each(function() {
      d3.select(this)
        .select("image")
        .attr("style", function(d) {
          let yoffset = -50;
          let xoffset = -10;
          let name = this.previousSibling.getAttribute("data-name");
          let node = d?.children?.find((q) => q.name === name);
          return `opacity:0;transition: transform 0s ease-out;
          transform: translate(${node.x -
            d.ring +
            xoffset}px,${node.y + yoffset - d.ring}px)  rotateY(55deg) scale(1.3);-webkit-transform: translate(${node.x - d.ring + xoffset}px,${node.y + yoffset - d.ring}px)  rotateY(55deg) scale(1.3)`;
        });
      if (!isSelected(this.firstChild, block)) return;
      window.clearTimeout(window.turnoffLineTick);
      d3.select(this)
        .select("image")
        .attr("style", function(d) {
          let name = this.previousSibling.getAttribute("data-name");
          let node = d.children?.find((q) => q.name === name);
          if (node) {
            let x = node.x - d.ring;
            let y = node.y - d.ring;
            return `opacity:1;
            transform: translate(-20px,-50px) rotateY(55deg) scale(1.3);-webkit-transform: translate(-20px,-50px) rotateY(55deg) scale(1.3)`;
          } else
            return `opacity:0;transition: transform 0s ease-out;
          transform: translate(${node.x}px,${node.y}px) rotateY(55deg) scale(1.3);-webkit-transform: translate(${node.x}px,${node.y}px) rotateY(55deg) scale(1.3)`;
        });
      window.turnoffLineTick = setTimeout(() => {
        d3.selectAll("line.connector").attr("stroke", "#684999");
        d3.select(this)
          .select("image")
          .attr("style", function(d) {
            let yoffset = -50;
            let xoffset = -10;
            let name = this.previousSibling.getAttribute("data-name");
            let node = d?.children?.find((q) => q.name === name);
            return `opacity:0;transition: transform 0s ease-out;
            transform: translate(${node.x -
              d.ring +
              xoffset}px,${node.y + yoffset - d.ring}px)  rotateY(55deg) scale(1.3);-webkit-transform: translate(${node.x - d.ring + xoffset}px,${node.y + yoffset - d.ring}px)  rotateY(55deg) scale(1.3)`;
          });
      }, 3500);
    });
  }
  animateCurrentBlock = function(block) {
    drawLines(block);
    drawCubes(block);
  };
  if (ORBIT) {
    lineAnimationTick = setInterval(() => {
      drawLines(window.currentBlock);
      drawCubes(window.currentBlock);
    }, ORBIT_SPEED);
  } else {
    animateCurrentBlock();
  }

  orbit.start();

  function nodeOver(d) {
    if (d.parent) {
      div
        .transition()
        .duration(200)
        .style("opacity", 0.9);
      div
        .html(d.name)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 50 + "px");
    }
  }

  function nodeOut(d) {
    if (d.parent) {
      div
        .transition()
        .duration(500)
        .style("opacity", 0);
    }
  }
}
let $svg = $("svg");
let initialScale;
function scaleOrbit() {
  let scale = ($(window).width() + 300) / ORBIT_SIZE;
  $svg.css("transform", `scale(${scale})`);
  if (!initialScale) {
    initialScale = scale;
  }
}
$(window).on("resize", scaleOrbit);
scaleOrbit();
