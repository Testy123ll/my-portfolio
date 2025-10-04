document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('chat-form');
    const statusMessage = document.getElementById('status-message'); // Assume you have a p or div with this ID near your form

    if (!form || !statusMessage) {
        console.error("Contact form or status message element not found in the HTML.");
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop the default form submission

      
        const BACKEND_URL = 'https://my-portfolio-backend-1oun.onrender.com/send-email'; 
       
        
        // --- 2. Data Collection ---
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Simple validation to prevent empty submissions
        if (!data.name || !data.email || !data.message) {
            statusMessage.textContent = 'Please fill out all fields.';
            statusMessage.className = 'error';
            return;
        }

        // --- 3. Pre-Submission UI Update ---
        statusMessage.textContent = 'Sending message...';
        statusMessage.className = 'sending'; 
        form.querySelector('button[type="submit"]').disabled = true;

        // --- 4. Send Data to the Backend ---
        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            // Parse the JSON response from the server
            const result = await response.json();

            // --- 5. Handle Server Response ---
            if (response.ok && result.status === 'success') {
                statusMessage.textContent = result.message || 'Message sent successfully!';
                statusMessage.className = 'success';
                form.reset(); // Clear the form fields
            } else {
                // Handle application-level errors (e.g., server returned 400 or 500)
                statusMessage.textContent = result.message || 'Failed to send message. Please try again later.';
                statusMessage.className = 'error';
                console.error('Server response error:', result);
            }

        } catch (error) {
            // Handle network/connection errors
            statusMessage.textContent = 'A connection error occurred. Check the console for details.';
            statusMessage.className = 'error';
            console.error('Network or Fetch Error:', error);

        } finally {
            // Re-enable the submit button
            form.querySelector('button[type="submit"]').disabled = false;
        }
    });
});
