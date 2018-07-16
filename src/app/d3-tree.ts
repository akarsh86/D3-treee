import * as d3 from 'd3';

import { TreeData } from './model/tree-data';

export class D3Tree {

  public showTree(data: TreeData, selector: string): void {
    // Set the dimensions and margins of the diagram
    let margin = { top: 20, right: 90, bottom: 30, left: 90 },
      width = 1060 - margin.left - margin.right,
      height = 1000 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin


    /*var svg = d3.select("#body").append("svg").attr("width", 1000).attr("height", 1000)
    .call(zm = d3.behavior.zoom().scaleExtent([1,3]).on("zoom", redraw)).append("g")
    .attr("transform", "translate(" + 350 + "," + 20 + ")");*/
    
     var svg = d3.select(selector).append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate('
        + margin.left + ',' + margin.top + ')'); 

    var i = 0,
      duration = 750,
      rectW = 90,
      rectH = 50,
      root;

    // declares a tree layout and assigns the size
    var treemap = d3.tree().size([height, width]);

    // Assigns parent, children, height, depth
    root = d3.hierarchy(data, function (d) {
      return d.children;
    });
    root.x0 = 0;
    root.y0 = height / 2;

    // Collapse after the second level
    root.children.forEach(collapse);

    update(root);

    // Collapse the node and all it's children
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    function update(source) {

      // Assigns the x and y position for the nodes
      var treeData = treemap(root);

      // Compute the new tree layout.
      var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

      // Normalize for fixed-depth.
      nodes.forEach(function (d) {
        d.y = d.depth * 180;
      });

      // ****************** Nodes section ***************************

      // Update the nodes...
      var node = svg.selectAll('g.node')
        .data(nodes, function (d) {
          return d.id || (d.id = ++i);
        });

      // Enter any new modes at the parent's previous position.
      var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', function (d) {
          return 'translate(' + source.y0 + ',' + source.x0 + ')';
        })
        .on('click', click)
        .on('contextmenu', function (d) {
          console.log('Right mouse button clicked on ');
          console.log(d.data.name);
        });

      // Add rect for the nodes
      /*  nodeEnter.append('circle')
         .attr('class', 'node')
         .attr('r', 1e-6)
         .style('fill', function (d) {
           return d._children ? 'lightsteelblue' : '#fff';
         }); */

      nodeEnter.append("rect")
        .attr("width", rectW)
        .attr("height", rectH)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("fill", function (d) {
          return d._children ? "lightsteelblue" : "#fff";
        });

      // Add labels for the nodes
      nodeEnter.append('text')
        .attr("x", rectW / 2)
        .attr("y", rectH / 2)
        // Commented just to run below code
        /* .attr('y', function (d) {
          return d.children || d._children ? -13 : 13;
        }) */
        .attr('dy', '.35em')
        .attr('text-anchor', function (d) {
          return d.children || d._children ? 'end' : 'start';
        })
        .text(function (d) {
          return d.data.name;
        });

      // UPDATE
      var nodeUpdate = nodeEnter.merge(node);

      // Transition to the proper position for the node
      nodeUpdate.transition()
        .duration(duration)
        .attr('transform', function (d) {
          return 'translate(' + d.x + ',' + d.y + ')';
        });

      // Update the node attributes and style
      // Commented just to run below code
      /*
       nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style('fill', function (d) {
          return d._children ? 'lightsteelblue' : '#fff';
        })
        .attr('cursor', 'pointer'); */

      nodeUpdate.select("rect")
        .attr("width", rectW)
        .attr("height", rectH)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("fill", function (d) {
          return d._children ? "lightsteelblue" : "#fff";
        });
      nodeUpdate.select("text")
        .style("fill-opacity", 1);

      // Remove any exiting nodes
      var nodeExit = node.exit().transition()
        .duration(duration)
        .attr('transform', function (d) {
          return 'translate(' + source.y + ',' + source.x + ')';
        })
        .remove();

      // On exit reduce the node circles size to 0

      /* nodeExit.select('circle')
        .attr('r', 1e-6); */

        nodeExit.select("rect")
        .attr("width", rectW)
        .attr("height", rectH)
        .attr("stroke", "black")
        .attr('r', 1e-6)
        .attr("stroke-width", 1);
    
        // On exit reduce the opacity of text labels
      nodeExit.select('text')
        .style('fill-opacity', 1e-6);

      // ****************** links section ***************************

      // Update the links...
      var link = svg.selectAll('path.link')
        .data(links, function (d) {
          return d.id;
        });

      // Enter any new links at the parent's previous position.
      var linkEnter = link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr("x", rectW / 2)
        .attr("y", rectH / 2)
        .attr('d', function (d) {
          var o = { x: source.x0, y: source.y0 };
          return diagonal(o, o);
        });

      // UPDATE
      var linkUpdate = linkEnter.merge(link);

      // Transition back to the parent element position
      linkUpdate.transition()
        .duration(duration)
        .attr('d', function (d) {
          return diagonal(d, d.parent);
        });

      // Remove any exiting links
      var linkExit = link.exit().transition()
        .duration(duration)
        .attr('d', function (d) {
          var o = { x: source.x, y: source.y };
          return diagonal(o, o);
        })
        .remove();

      // Store the old positions for transition.
      nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      // Creates a curved (diagonal) path from parent to the child nodes
      function diagonal(s, d) {

        let path = `M ${s.x} ${s.y}
            C ${(s.x + d.x) / 2} ${s.y},
              ${(s.x + d.x) / 2} ${d.y},
              ${d.x} ${d.y}`;

        return path;
      }

      // Toggle children on click.
      function click(d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update(d);
      }

      //Redraw for zoom
      function redraw() {
        //console.log("here", d3.event.translate, d3.event.scale);
        svg.attr("transform",
          "translate(" + d3.event.translate + ")"
          + " scale(" + d3.event.scale + ")");
      }
    }
  }
}
