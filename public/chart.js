window.addEventListener('DOMContentLoaded', (event) => {
  const renewalData = renewals.map((renewal) => {
    return {
      year: renewal.start_date.substring(0, 4), 
      price: renewal.price,
      productName: renewal.product_name,  
      startDate: renewal.start_date.split('T')[0],
      signOffDate: renewal.end_date.split('T')[0],  
      contractDuration: renewal.contract_duration,
      consultingHours: renewal.consulting_hours
    };
});


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
  const labels = renewalData.map(data => data.start_date);
  const statuses = renewalData.map(data => data.status);
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
                `Renewal Start Date: ${data.startDate}`,
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
        <h3>Service: ${data.productName}</h3>
        <p>Renewal Start Date: ${data.startDate}</p>
        <p>Sign-off Date: ${data.signOffDate}</p>
        <p>Contract Duration: ${data.contractDuration}</p>
        <p>Subscription Price: $${data.price}</p>
        <p>Consulting Hours: ${data.consultingHours} hours per quarter</p>
      `;
      renewalInfo.style.display = "block";
    } else {
      renewalInfo.style.display = "none";
    }
  };
});
