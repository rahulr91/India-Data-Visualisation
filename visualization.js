var url = './crime-against-women.json'

d3.json(url, function (json) {

  // Creates the divs to select the various crimes
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

// Creates the clickable years divs for the year selection
function drawYears (crime) {
  for (let i = 1; i < 13; i++) {
    d3.select('#years').append('div')
      .attr('style', 'background-color: #ff0;')
      .attr('class', 'years')
      .on('click', function () {
        var year = 1 + i
        draw(crime, year)
      })
      .append('p')
      .attr('style', 'vertical-align: middle;')
      .text(2000 + i)
  // .on('click', function () {
  //   var year = 1 + i
  //   draw(crime, year)
  // })
  }
}

// Takes the name and year of the crime and draws the graph using d3
function draw (crime, year) {
  d3.select('svg').remove()
  d3.json(url, function (json) {
    var stateWiseVictims = []
    var reportedCases = []

    // push the state Wise Victims data into the stateWiseVictims array, push the number of reported cases to an array
    for (var i = 0; i < json.data.length; i++) {
      if (json.data[i][1] == crime && json.data[i][0].indexOf('TOTAL') < 0) {
        stateWiseVictims.push(json.data[i])
        reportedCases.push(parseInt(json.data[i][year]))
      }
    }

    var maxRC = d3.max(reportedCases)

    // Scale to create a gradient of colours for the graph. It returns various colours for each of the values with which it is called
    var color = d3.scaleLinear()
      .domain([0, maxRC / 2, maxRC]).interpolate(d3.interpolateHcl)
      .range(['green', 'yellow', 'red'])

    // Creates a scale to determine the height of the bars in the graph.
    // It returns a value between the numbers in the range array.
    var heightScale = d3.scaleLinear()
      .domain([0, d3.max(reportedCases)])
      .range([0, 500])

    // selects the chart div and appends a canvas to it
    var canvas = d3.select('#chart')
      .append('svg')
      .attr('width', 1050)
      .attr('height', 800)
      .append('g')

    // appends a heading to the chart
    canvas.append('text')
      .attr('x', 100)
      .attr('y', 100)
      .text('Crime: ' + crime + ', ' + 'Year: ' + (2000 + year - 1))

    // creates g tag for each element in the stateWiseVictims array
    var elements = canvas.selectAll('g')
      .data(stateWiseVictims)
      .enter()
      .append('g')

    // appends a rectangle on the graph
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

    // adds transition for the bars
    bars.transition()
      .duration(2000)
      .attr('y', function (d) {
        return 650 - heightScale(d[year])
      })
      .attr('height', function (d) {
        return heightScale(d[year])
      })

    // appends the state name to the canvas under each bar on the graph
    elements.append('text')
      .attr('x', function (d, i) {
        return -775
      })
      .attr('y', function (d, i) {
        return 25 + i * 29
      })
      .attr('dy', '.35em')
      .attr('id', 'states')
      .text(function (d) {
        str = d[0][0] + d[0].slice(1).toLowerCase()
        return str
      })
      .attr('transform', function (d) {
        return 'rotate(-90)'
      })

    // appends the number of cases reported above the bars on the graph
    var text = elements.append('text')
      .attr('x', function (d, i) {
        return i * 29 + 15
      })
      .attr('y', 645)
      .attr('class', 'reports')
      .text(function (d) {
        return d[year]
      })

    // adds transition to the text to change position along with the bar graph's transition
    text.transition()
      .duration(2000)
      .attr('y', function (d, i) {
        return 645 - heightScale(d[year])
      })
  })
}
