var url = './crime-against-women.json'

for (let i = 1; i < 13; i++) {
  d3.select('#years').append('div')
    .attr('style', 'background-color: #ff0;')
    .attr('class', 'years')
    .text(2000 + i)
    .on('click', function () {
      document.getElementsByTagName('svg').innerHTML = ''
      console.log('clicked ' + i)
      var year = 1 + i
      draw(year)
    })
}
function draw (year) {
  d3.select('svg').remove()
  d3.json(url, function (json) {
    var rape_victims = []
    var total = 0
    var index = 0
    var reportedCases = []

    for (var i = 0; i < json.data.length; i++) {
      if (json.data[i][1] == 'RAPE' && json.data[i][0].indexOf('TOTAL') < 0) {
        rape_victims.push(json.data[i])
        index = i
        reportedCases.push(parseInt(json.data[i][year]))
      }
    }
    total = parseInt(json.data[index + year][2])
    var maxRC = d3.max(reportedCases)

    var color = d3.scaleLinear()
      .domain([0, maxRC / 2, maxRC]).interpolate(d3.interpolateHcl)
      .range(['green', 'yellow', 'red'])

    console.log(rape_victims)
    console.log(total)
    // var heading = d3.select('body').append("h2")
    // .attr("style", "margin-left: 10%;")
    // .text("Data visualization of rape victims in 2001")
    var heightScale = d3.scaleLinear()
      .domain([0, d3.max(reportedCases)])
      .range([0, 500])
    var canvas = d3.select('#chart')
      .append('svg')
      .attr('width', 1050)
      .attr('height', 800)
      .append('g')
    var elements = canvas.selectAll('g')
      .data(rape_victims)
      .enter()
      .append('g')
    elements.append('text')
      .attr('x', function (d, i) {
        return -770
      })
      .attr('y', function (d, i) {
        return 25 + i * 29
      })
      .attr('dy', '.35em')
      .text(function (d) {
        str = d[0][0] + d[0].slice(1).toLowerCase()
        return str
      })
      .attr('transform', function (d) {
        return 'rotate(-90)'
      })

    var y = d3.scaleLinear()
      .range([720, 0])
    var bars = elements.append('rect')
      .attr('width', 25)
      .attr('height', 0)
      .attr('x', function (d, i) {
        return i * 29 + 15
      })
      .attr('y', 650)
      .attr('fill', function (d) {
        return color(parseInt(d[year]))
      })
    bars.transition()
      .duration(2000)
      .attr('y', function (d) {
        return 650 - heightScale(d[year])
      })
      .attr('height', function (d) {
        return heightScale(d[year])
      })
    var text = elements.append('text')
      .attr('x', function (d, i) {
        return i * 29 + 15
      })
      .attr('y', 640)
      .text(function (d) {
        return d[year]
      })
    text.transition()
      .duration(2000)
      .attr('y', function (d, i) {
        return 645 - heightScale(d[year])
      })
  })
}
