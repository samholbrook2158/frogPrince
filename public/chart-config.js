const renewalData = [
    {
      year: '2018',
      price: 1000,
      productName: 'Service: Cloud storage system',
      signOffDate: '2018-01-01',
      contractDuration: '12 months',
      consultingHours: 20
    },
    {
      year: '2019',
      price: 1100,
      productName: 'Service: Cloud storage system',
      signOffDate: '2019-01-01',
      contractDuration: '12 months',
      consultingHours: 25
    },
    {
      year: '2020',
      price: 1200,
      productName: 'Service: Cloud storage system',
      signOffDate: '2020-01-01',
      contractDuration: '12 months',
      consultingHours: 30
    }
  ];
  
  const chartData = {
    labels: renewalData.map((data) => data.year),
    datasets: [
      {
        label: 'Renewal Price',
        data: renewalData.map((data) => data.price),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: 'rgba(75, 192, 192, 1)',
        pointHoverRadius: 7,
        pointHoverBackgroundColor: 'rgba(75, 192, 192, 0.6)',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };
  
  const ctx = document.getElementById('renewal-chart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Price',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Year',
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            afterBody: function (context) {
              const index = context[0].dataIndex;
              const data = renewalData[index];
              return [
                `Product: ${data.productName}`,
                `Sign-off Date: ${data.signOffDate}`,
                `Contract Duration: ${data.contractDuration}`,
                `Consulting Hours: ${data.consultingHours}`,
              ];
            },
          },
        },
      },
    },
  });
  
  document.getElementById('renewal-chart').onclick = function (evt) {
    const activePoints = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
  
    const renewalInfo = document.getElementById('renewal-info');
  
    if (activePoints.length > 0) {
      const dataIndex = activePoints[0].index;
      const data = renewalData[dataIndex];
  
      renewalInfo.innerHTML = `
        <h3>${data.productName}</h3>
        <p>Sign-off Date: ${data.signOffDate}</p>
        <p>Contract Duration: ${data.contractDuration}</p>
        <p>Price: $${data.price}</p>
        <p>Consulting Hours: ${data.consultingHours} hours/quarter</p>
      `;
      renewalInfo.style.display = "block";
    } else {
      renewalInfo.style.display = "none";
    }
  };
  
  