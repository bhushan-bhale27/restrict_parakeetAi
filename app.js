document.getElementById("checkTabShare").addEventListener("click", async () => {
    const resultElement = document.getElementById("result");

    try {
        // Step 1: Request screen-sharing permission
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const videoTrack = stream.getVideoTracks()[0];
        const settings = videoTrack.getSettings();

        // Step 2: Check if the shared surface is a browser tab
        if (settings.displaySurface === "browser") {
            // Step 3: Check if the current tab has focus
            if (document.hasFocus()) {
                resultElement.textContent =
                    "✅ This tab is likely being shared by a screen-sharing session!";
            } else {
                resultElement.textContent =
                    "❌ Another tab is likely being shared, not this one.";
            }
        } else {
            resultElement.textContent =
                "❌ This tab is not being shared (another surface is shared).";
        }

        // Step 4: Stop the stream
        videoTrack.stop();
    } catch (error) {
        console.error("Error detecting tab sharing:", error);
        resultElement.textContent =
            "❌ Could not detect tab sharing. Ensure you grant permission.";
    }
});
