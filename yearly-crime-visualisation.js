var crimeDataUrl = './crime-against-women.json'
var populationUrl = './state-wise-population.json'

d3.json(crimeDataUrl, function (json) {
  var crimes = []
  var prev = ''
  var crimehead = d3.select('#crimehead')
  for (let i = 0; i < json.data.length; i++) {
    let crime = json.data[i][1]
    if (crime != prev && crime.indexOf('TOTAL CRIMES AGAINST WOMEN') < 0) {
      prev = crime
      str = crime[0] + crime.slice(1).toLowerCase()
      crimehead.append('div')
        .attr('style', 'background-color: #00b8d4;')
        .attr('class', 'crimes')
        .text(str)
        .on('click', function () {
          draw(crime)
        })
    }
  }
  draw('RAPE')
})

function draw (crime) {
  d3.select('svg').remove()
  d3.json(populationUrl, function (data) {
    var years = [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012]
    var population = data['TOTAL (ALL-INDIA)']
    d3.json(crimeDataUrl, function (json) {
      var total
      for (var i = 0; i < json.data.length; i++) {
        if (json.data[i][1] == crime && json.data[i][0].indexOf('TOTAL (ALL-INDIA)') >= 0) {
          total = json.data[i]
        }
      }
      total.shift()
      total.shift()
      var percent = []
      for (var i = 0; i < total.length; i++) {
        percent.push((100 * total[i]) / population[i])
      }
      var max = d3.max(percent)

      var height = d3.scaleLinear()
        .domain([0, max])
        .range([0, 500])

      var color = d3.scaleLinear()
        .domain([0, max / 2, max]).interpolate(d3.interpolateHcl)
        .range(['green', 'yellow', 'red'])

      var canvas = d3.select('#chart')
        .append('svg')
        .attr('width', 1050)
        .attr('height', 800)
        .append('g')

      canvas.append('text')
        .attr('x', 100)
        .attr('y', 100)
        .text('Crime: ' + crime + ', ' + 'Year: 2001 - 2012')

      canvas.append('text')
        .text('')

      var elements = canvas.selectAll('g')
        .data(percent)
        .enter()
        .append('g')

      var bars = elements.append('rect')
        .attr('width', 25)
        .attr('height', 0)
        .attr('x', function (d, i) {
          return i * 65 + 15
        })
        .attr('y', 650)
        .attr('fill', function (d) {
          return color(d)
        })

      bars.transition()
        .duration(2000)
        .attr('y', function (d) {
          return 650 - height(d)
        })
        .attr('height', function (d) {
          return height(d)
        })

      elements.append('text')
        .attr('x', function (d, i) {
          return -705
        })
        .attr('y', function (d, i) {
          return i * 65 + 25
        })
        .attr('dy', '.35em')
        .attr('id', 'states')
        .text(function (d, i) {
          return years[i]
        })
        .attr('transform', function (d) {
          return 'rotate(-90)'
        })

      var text = elements.append('text')
        .attr('x', function (d, i) {
          return i * 65 + 15
        })
        .attr('y', 645)
        .attr('class', 'reports')
        .text(function (d, i) {
          return total[i]
        })

      text.transition()
        .duration(2000)
        .attr('y', function (d, i) {
          return 645 - height(d)
        })
    })
  })
}
