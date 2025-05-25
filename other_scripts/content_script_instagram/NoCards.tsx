function NoCards() {
    return <div
        style={{
            display: "flex",
            minWidth: "50%",
            flexDirection: "column",
        }}>
        <div>
            add some flashcards to unrot your brain
        </div>
        <div
            className={"unrot-open-quizlet-button"}
            style={{
                backgroundColor: "#4255ff",
                border: "1px solid #424242",
                borderRadius: "15px",
                cursor: "pointer",
                padding: "10px 15px",
                margin: "20px 0 5px 0",
                fontWeight: "bold",
            }}
            onClick={() => window.open("https://quizlet.com/", "_blank")}
        >
            open quizlet to load a set
        </div>
        <div
            className={"unrot-open-popup-button"}
            style={{
                backgroundColor: "#4255ff",
                border: "1px solid #424242",
                borderRadius: "15px",
                cursor: "pointer",
                padding: "10px 15px",
                fontWeight: "bold",
            }}
            onClick={() => chrome.runtime.sendMessage({ action: "OPEN_POPUP" })}
        >
            or convert a pdf
        </div>
    </div>
}

export default NoCards