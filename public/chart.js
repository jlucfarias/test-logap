const setFilename = event => {
  const parent = event.target.parentElement;
  if (!parent.classList.contains('active')) {
    parent.classList.add('active');
  }
  parent.children[1].innerHTML = event.target.files[0].name;
};

const sendCurve = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  var request = new XMLHttpRequest();
  request.open("POST", "/");
  request.send(formData);
  request.onreadystatechange = async () => {
    if (request.readyState === 4) {
      if (request.response === 'Done') {
        await getCurves();
        event.target.reset();
        event.target.children[1].children[1].innerHTML = "Informe o arquivo para upload";
      }
    }
  }
};

const getCurves = () => {
  fetch('/curves')
    .then(response => response.json())
    .then(curves => {
      const select = $('#chart > main > select');
      select.innerHTML = "<option value='false'>Escolha uma opção</option>";
      curves = curves.filter(c => c !== null && c !== undefined);
      curves.map(curve => {
        const option = document.createElement('option');
        option.value = curve.data.map(JSON.stringify).join('|');
        const text = document.createTextNode(curve.name);
        option.appendChild(text);
        select.appendChild(option);
      });
    })
    .catch(error => console.error(error));
};

const changeChart = event => {
  event.preventDefault();
  const selected = Array.from(event.target.options).filter(option => option.selected)[0];
  
  if (selected.value !== "false") {
    const data = event.target.value.split('|').map(JSON.parse);
    const labels = Object.keys(data[0]);
    
    Highcharts.chart('container', {
      chart: {
          type: 'scatter',
          zoomType: 'xy'
      },
      title: {
          text: selected.innerHTML
      },
      xAxis: {
          title: {
              enabled: true,
              text: labels[0]
          },
          startOnTick: true,
          endOnTick: true,
          showLastLabel: true
      },
      yAxis: {
          title: {
              text: labels[1]
          }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        headerFormat: '<table>',
        pointFormat: `
          <tr>
            <td>x: <b>{point.x}</b></td>
          </tr>
          <tr>
            <td>y: <b>{point.y}</b></td>
          </tr>`,
        footerFormat: '</table>',
      },
      plotOptions: {
          scatter: {
              marker: {
                  radius: 5,
                  states: {
                      hover: {
                          enabled: true,
                          lineColor: 'rgb(100,100,100)'
                      }
                  }
              },
              states: {
                  hover: {
                      marker: {
                          enabled: false
                      }
                  }
              }
          }
      },
      series: [{
          color: 'rgba(0, 0, 0, 1)',
          data: data.map(Object.values).map(v => v.map(vv => typeof vv === 'string' && vv.replace(',', '.'))).map(v => v.map(Number))
      }]
    });
  }
};
