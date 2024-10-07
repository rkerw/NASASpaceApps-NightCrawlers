document.getElementById('userEmailSubmit').addEventListener('click', function (event) {
    
    var useremail = {
        // Add coordinates here
        email: document.getElementById('userEmailField').value,
        path: document.getElementById('userEmailSubmit').getAttribute("path"),
        row: document.getElementById('userEmailSubmit').getAttribute("row"),
    };
    fetch('/email-notification', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(useremail),
    })
        .then((response) => response.json())
        .then((data) => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));
    document.getElementById('userEmailField').value = "";
});