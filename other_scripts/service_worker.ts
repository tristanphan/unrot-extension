chrome.runtime.onMessage.addListener((
    message,
    _sender,
    sendResponse
) => {
    console.log(message)
    if (message.action === "OPEN_POPUP") {
        void chrome.action.openPopup()
    }
    if (message.action === "FETCH_URL") {
        if (message.url === undefined) {
            sendResponse({ error: "Failed to fetch image" });
            return true;
        }
        fetch(message.url)
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    sendResponse({ dataUrl: reader.result });
                };
                reader.readAsDataURL(blob);
            })
            .catch(error => {
                console.error(`URL ${message.url} fetch failed: `, error);
                sendResponse({ error: "Failed to fetch image" });
            });
        return true;
    }
});

