const renewalData = renewals;


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

    const productNameCell = document.createElement('td');
    productNameCell.textContent = `Product Name: ${renewal.product_name}`;
    tableRow.appendChild(productNameCell);

    const linkCell = document.createElement('td');
    const linkElement = document.createElement('a');
    linkElement.textContent = 'Link';
    linkElement.href = `http://localhost:3000/messages/${renewal.friend_id}`;
    linkElement.classList.add('renewal-link');
    linkCell.appendChild(linkElement);
    tableRow.appendChild(linkCell);


    if (renewal.status === 'Ongoing') {
      ongoingRenewals.appendChild(tableRow.cloneNode(true));
    } else if (renewal.status === 'Upcoming') {
      upcomingRenewals.appendChild(tableRow.cloneNode(true));
    } else if (renewal.status === 'Completed') {
      finishedRenewals.appendChild(tableRow.cloneNode(true));
    }        

    // Update activity table
    const activityTableRow = document.createElement('tr');

    const activityTableCellName = document.createElement('td');
    activityTableCellName.textContent = `${renewal.product_name}`;
    activityTableRow.appendChild(activityTableCellName);

    const details = document.createElement('td');
    details.textContent = `${renewal.contract_duration}`;
    activityTableRow.appendChild(details);

    const activityTableCellStartDate = document.createElement('td');
    activityTableCellStartDate.textContent = formatDate(renewal.start_date);
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
console.log(renewalData); // To check the actual data you're receiving
