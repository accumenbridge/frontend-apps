document.getElementById('upload-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Replace this URL with the temporary ngrok URL from your Google Colab notebook
    const apiUrl = 'YOUR_NGROK_URL_HERE'; 

    const fileInput = document.getElementById('image-upload');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image to upload.");
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');

    // Show loading indicator
    loadingDiv.classList.remove('hidden');
    resultsDiv.innerHTML = '<h2>Results</h2>';

    try {
        const response = await fetch(apiUrl + '/predict', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Server returned status: ${response.status}`);
        }

        const data = await response.json();

        // Display image preview
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('image-preview');
            preview.innerHTML = `<img src="${e.target.result}" alt="Uploaded image">`;
        }
        reader.readAsDataURL(file);

        // Display detection results
        const detectionsDiv = document.getElementById('detections');
        if (data.detections && data.detections.length > 0) {
            let html = '<h3>Detections:</h3><ul>';
            data.detections.forEach(detection => {
                html += `<li>Class: ${detection.class}, Confidence: ${Math.round(detection.confidence * 100)}%</li>`;
            });
            html += '</ul>';
            detectionsDiv.innerHTML = html;
        } else {
            detectionsDiv.innerHTML = '<p>No objects detected.</p>';
        }

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while processing the image. Please try again.');
        document.getElementById('detections').innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    } finally {
        // Hide loading indicator
        loadingDiv.classList.add('hidden');
    }
});