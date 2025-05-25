import { CSSProperties, useCallback, useState } from "react";

function AnswerChoice(
    {
        text,
        isCorrect,
        isEnabled,
        clickHandler,
    }: {
        text: string,
        isCorrect: boolean,
        isEnabled: boolean,
        clickHandler: (correct: boolean) => void,
    }
) {
    const [selected, setSelected] = useState<boolean>(false)
    const cardStyle: CSSProperties = {
        padding: "10px",
        border: "1px solid #424242",
        borderRadius: "15px",
        margin: "5px",
        textAlign: "center",
        backgroundColor: (selected)
            ? (isCorrect ? "#00973c" : "#c91a25")
            : "#2e2e2e",
        cursor: (isEnabled) ? "pointer" : "default",
        transition: "0.2s",
        width: "40%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }

    const onClick = useCallback(() => {
        setSelected(true)
        clickHandler(isCorrect)
    }, [clickHandler, isCorrect])

    return <div
        className={"unrot-answer-choice-box"}
        style={cardStyle}
        onClick={(isEnabled) ? onClick : () => {
        }}
    >
        <div
            className={"unrot-answer-choice-text"}
            style={{
                overflow: "hidden",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: "7",
                textOverflow: "ellipsis",
                height: "fit-content",
                wordWrap: "break-word",
            }}
        >{text}</div>
    </div>
}

export default AnswerChoice