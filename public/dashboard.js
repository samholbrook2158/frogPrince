const renewalData = [
    {
        id: 1,
        productName: 'Service: Cloud storage system',
        signOffDate: '2018-01-01',
        contractDuration: '12 months',
        endDate: '2019-01-01',
        status: 'completed',
    },
    {
        id: 2,
        productName: 'Service: Cloud storage system',
        signOffDate: '2019-01-01',
        contractDuration: '12 months',
        endDate: '2020-01-01',
        status: 'completed',
    },
    {
        id: 3,
        productName: 'Service: Cloud storage system',
        signOffDate: '2020-01-01',
        contractDuration: '12 months',
        endDate: '2021-01-01',
        status: 'completed',
    },
];

// Function to format the date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

// Function to display renewal data
function displayRenewals() {
    const ongoingRenewals = document.getElementById('ongoing-renewals');
    const upcomingRenewals = document.getElementById('upcoming-renewals');
    const finishedRenewals = document.getElementById('finished-renewals');
    const activityTableBody = document.getElementById('activity-table-body');

    const today = new Date().toISOString().split('T')[0];

    renewalData.forEach((renewal) => {
        const renewalItem = document.createElement('p');
        renewalItem.textContent = `${renewal.productName} - ${renewal.contractDuration}`;

        if (renewal.signOffDate <= today && renewal.endDate >= today) {
            ongoingRenewals.appendChild(renewalItem);
        } else if (renewal.signOffDate > today) {
            upcomingRenewals.appendChild(renewalItem);
        } else if (renewal.endDate < today) {
            finishedRenewals.appendChild(renewalItem);
        }

        // Update activity table
        const tableRow = document.createElement('tr');

        const activityName = document.createElement('td');
        activityName.textContent = renewal.productName;
        tableRow.appendChild(activityName);

        const details = document.createElement('td');
        details.textContent = `${renewal.contractDuration}`;
        tableRow.appendChild(details);

        const startDate = document.createElement('td');
        startDate.textContent = formatDate(renewal.signOffDate);
        tableRow.appendChild(startDate);

        const status = document.createElement('td');
        status.textContent = renewal.status;
        tableRow.appendChild(status);

        const link = document.createElement('td');
        const linkElement = document.createElement('a');
        linkElement.textContent = 'Link';
        linkElement.href = `localhost:3000/messages/${renewal.id}`;
        link.appendChild(linkElement);
        tableRow.appendChild(link);

        activityTableBody.appendChild(tableRow);
    });

}

// Call the displayRenewals function to update the dashboard
displayRenewals();