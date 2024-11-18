document.getElementById('checkTabShare').addEventListener('click', async () => {
    const resultElement = document.getElementById('result');
    try {
        // Request screen sharing
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const videoTrack = stream.getVideoTracks()[0];
        const settings = videoTrack.getSettings();

        // Check if the shared content is "this tab"
        if (settings.displaySurface === 'browser') {
            resultElement.textContent = "✅ This tab is being shared!";
        } else {
            resultElement.textContent = "❌ This tab is not being shared.";
        }

        // Stop the stream to free resources
        videoTrack.stop();
    } catch (error) {
        console.error("Error detecting tab sharing:", error);
        resultElement.textContent = "❌ Could not detect tab sharing. Make sure to grant permission.";
    }
});
