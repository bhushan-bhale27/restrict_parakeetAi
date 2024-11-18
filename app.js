document.getElementById('checkTabShare').addEventListener('click', async () => {
    const resultElement = document.getElementById('result');

    try {
        // Request screen sharing
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const videoTrack = stream.getVideoTracks()[0];
        const settings = videoTrack.getSettings();

        // Check if the shared content is a browser tab
        if (settings.displaySurface === 'browser') {
            // Create a temporary video element to render the shared stream
            const video = document.createElement('video');
            video.srcObject = stream;
            video.muted = true;
            video.play();

            // Wait a moment for the video to load the stream
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Create a canvas to capture the video frame
            const canvas = document.createElement('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const ctx = canvas.getContext('2d');

            // Draw the shared video frame onto the canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Get the image data from the canvas
            const sharedTabData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // Capture the content of the current tab using the same canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(document.documentElement, 0, 0, canvas.width, canvas.height);
            const currentTabData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // Compare the content of the shared tab and the current tab
            const isSameTab = compareImageData(sharedTabData, currentTabData);

            // Display the result
            if (isSameTab) {
                resultElement.textContent = "✅ This tab is being shared!";
            } else {
                resultElement.textContent = "❌ Another tab is being shared.";
            }

            // Clean up resources
            videoTrack.stop();
            video.remove();
        } else {
            resultElement.textContent = "❌ This tab is not being shared.";
        }
    } catch (error) {
        console.error("Error detecting tab sharing:", error);
        resultElement.textContent = "❌ Could not detect tab sharing. Make sure to grant permission.";
    }
});

/**
 * Compare two ImageData objects for similarity.
 * @param {ImageData} data1 - The first ImageData object.
 * @param {ImageData} data2 - The second ImageData object.
 * @returns {boolean} True if the two images are similar, false otherwise.
 */
function compareImageData(data1, data2) {
    if (data1.width !== data2.width || data1.height !== data2.height) {
        return false;
    }

    // Compare pixel-by-pixel
    const totalPixels = data1.data.length;
    for (let i = 0; i < totalPixels; i++) {
        if (data1.data[i] !== data2.data[i]) {
            return false;
        }
    }
    return true;
}
