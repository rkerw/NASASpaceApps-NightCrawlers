document.getElementById('cloudCover').addEventListener('input', function() {
    // Get the current value of the slider
    const sliderValue = this.value;
    
    // Display the value
    document.getElementById('cloudValueText').textContent = sliderValue;
});

document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById('startdate').valueAsDate = new Date();
    document.getElementById('enddate').valueAsDate = new Date();
});