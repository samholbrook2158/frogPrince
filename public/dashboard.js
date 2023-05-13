const renewalData = [
    {
        id: 1,
        organization: 'Company A',
        productName: 'Service: Cloud storage system',
        signOffDate: '2018-01-01',
        contractDuration: '12 months',
        endDate: '2019-01-01',
        status: 'completed',
    },
    {
        id: 2,
        organization: 'Company B',
        productName: 'Service: Cloud storage system',
        signOffDate: '2019-01-01',
        contractDuration: '12 months',
        endDate: '2020-01-01',
        status: 'completed',
    },
    {
        id: 3,
        organization: 'Company C',
        productName: 'Service: Cloud storage system',
        signOffDate: '2023-05-01',
        contractDuration: '12 months',
        endDate: '2024-05-01',
        status: 'upcoming',
    },
    {
        id: 4,
        organization: 'Company D',
        productName: 'Service: Cloud storage system',
        signOffDate: '2023-04-01',
        contractDuration: '12 months',
        endDate: '2024-04-01',
        status: 'ongoing',
      }      
];


// Function to format the date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

// Function to display renewal data
function displayRenewals() {
    const ongoingRenewals = document.getElementById('ongoing-renewals-body');
    const upcomingRenewals = document.getElementById('upcoming-renewals-body');
    const finishedRenewals = document.getElementById('finished-renewals-body');
    const activityTableBody = document.getElementById('activity-table-body');
  
    const today = new Date().toISOString().split('T')[0];
  
    renewalData.forEach((renewal) => {
      const tableRow = document.createElement('tr');
  
      const orgCell = document.createElement('td');
      orgCell.textContent = `Organization: ${renewal.organization}`;
      tableRow.appendChild(orgCell);
  
      const productNameCell = document.createElement('td');
      productNameCell.textContent = `Renewal: ${renewal.productName}`;
      tableRow.appendChild(productNameCell);
  
      const linkCell = document.createElement('td');
      const linkElement = document.createElement('a');
      linkElement.textContent = 'Link';
      linkElement.href = `http://localhost:3000/messages/${renewal.id}`;
      linkElement.classList.add('renewal-link');
      linkCell.appendChild(linkElement);
      tableRow.appendChild(linkCell);
  
      if (renewal.status === 'ongoing') {
        ongoingRenewals.appendChild(tableRow.cloneNode(true));
      } else if (renewal.status === 'upcoming') {
        upcomingRenewals.appendChild(tableRow.cloneNode(true));
      } else if (renewal.status === 'completed') {
        finishedRenewals.appendChild(tableRow.cloneNode(true));
      }
  
      // Update activity table
      const activityTableRow = document.createElement('tr');
  
      const activityTableCellName = document.createElement('td');
      activityTableCellName.textContent = `${renewal.organization} - ${renewal.productName}`;
      activityTableRow.appendChild(activityTableCellName);
  
      const details = document.createElement('td');
      details.textContent = `${renewal.contractDuration}`;
      activityTableRow.appendChild(details);
  
      const activityTableCellStartDate = document.createElement('td');
      activityTableCellStartDate.textContent = formatDate(renewal.signOffDate);
      activityTableRow.appendChild(activityTableCellStartDate);
  
      const status = document.createElement('td');
      status.textContent = renewal.status;
      activityTableRow.appendChild(status);
  
      const activityTableCellLink = document.createElement('td');
      activityTableCellLink.appendChild(linkElement.cloneNode(true));
      activityTableRow.appendChild(activityTableCellLink);
  
      activityTableBody.appendChild(activityTableRow);
    });
  }
  
  // Call the displayRenewals function to update the dashboard
  displayRenewals();