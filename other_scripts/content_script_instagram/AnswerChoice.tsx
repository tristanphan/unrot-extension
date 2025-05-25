import { CSSProperties, useCallback, useEffect, useId, useRef, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

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
    const [isTruncated, setIsTruncated] = useState<boolean>(false)
    const tooltipId: string = useId()
    const textRef = useRef<HTMLDivElement | null>(null)

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

    useEffect(() => {
        if (textRef.current) {
            const isTruncated = textRef.current.scrollWidth > textRef.current.clientWidth
                || textRef.current.scrollHeight > textRef.current.clientHeight;
            setIsTruncated(isTruncated);
        }
    }, [text]);

    return <div
        className={"unrot-answer-choice-box"}
        style={cardStyle}
        onClick={(isEnabled) ? onClick : () => {
        }}
    >
        {isTruncated &&
            <ReactTooltip
                id={tooltipId}
                place={"bottom"}
                style={{
                    maxWidth: "250px",
                }}
                variant={"light"}
            >{text}</ReactTooltip>
        }
        <div
            data-tooltip-id={tooltipId}
            className={"unrot-answer-choice-text"}
            ref={textRef}
            style={{
                overflow: "hidden",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: "7",
                textOverflow: "ellipsis",
                height: "fit-content",
                wordWrap: "break-word",
                lineHeight: "normal",
            }}
        >
            {text}
        </div>
    </div>
}

export default AnswerChoice