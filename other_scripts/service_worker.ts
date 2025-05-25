chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    if (message.action === "OPEN_POPUP") {
        void chrome.action.openPopup()
    }
});

