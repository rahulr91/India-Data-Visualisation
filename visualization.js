var url = './crime-against-women.json'

d3.json(url, function (json) {
  var crimes = []
  var prev = ''
  var crimehead = d3.select('#crimehead')
  for (let i = 0; i < json.data.length; i++) {
    let crime = json.data[i][1]
    if (crime != prev) {
      prev = crime
      str = crime[0] + crime.slice(1).toLowerCase()
      crimehead.append('div')
        .attr('style', 'background-color: #00b8d4;')
        .attr('class', 'crimes')
        .text(str)
        .on('click', function () {
          d3.select('#years').html('')
          drawYears(crime)
          draw(crime, 13)
        })
    }
  }
  drawYears('RAPE')
})

function drawYears (crime) {
  for (let i = 1; i < 13; i++) {
    d3.select('#years').append('div')
      .attr('style', 'background-color: #ff0;')
      .attr('class', 'years')
      .text(2000 + i)
      .on('click', function () {
        // console.log('clicked ' + i)
        var year = 1 + i
        draw(crime, year)
      })
  }
}

function draw (crime, year) {
  console.log(crime, year)
  d3.select('svg').remove()
  d3.json(url, function (json) {
    var victims = []
    var reportedCases = []

    for (var i = 0; i < json.data.length; i++) {
      if (json.data[i][1] == crime && json.data[i][0].indexOf('TOTAL') < 0) {
        victims.push(json.data[i])
        reportedCases.push(parseInt(json.data[i][year]))
      }
    }

    var maxRC = d3.max(reportedCases)

    var color = d3.scaleLinear()
      .domain([0, maxRC / 2, maxRC]).interpolate(d3.interpolateHcl)
      .range(['green', 'yellow', 'red'])

    var heightScale = d3.scaleLinear()
      .domain([0, d3.max(reportedCases)])
      .range([0, 500])
    var canvas = d3.select('#chart')
      .append('svg')
      .attr('width', 1050)
      .attr('height', 800)
      .append('g')
    canvas.append('text')
      .attr('x', 100)
      .attr('y', 100)
      .text('Crime: ' + crime + ', ' + 'Year: ' + (2000 + year - 1))
    var elements = canvas.selectAll('g')
      .data(victims)
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
      .attr('class', 'reports')
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
