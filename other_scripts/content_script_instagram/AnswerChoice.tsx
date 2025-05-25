import { CSSProperties, useCallback, useEffect, useId, useRef, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Content } from "./card_fetcher.ts";

function AnswerChoice(
    {
        answer,
        isCorrect,
        isEnabled,
        clickHandler,
    }: {
        answer: Content,
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
        backgroundColor: (selected || (!isEnabled && isCorrect))
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
        {(answer.text !== undefined) && <AnswerChoiceText text={answer.text}/>}
        {(answer.img !== undefined) && <AnswerChoiceImage url={answer.img}/>}
    </div>
}

function AnswerChoiceText({ text }: { text: string }) {
    const [isTruncated, setIsTruncated] = useState<boolean>(false)
    const textRef = useRef<HTMLDivElement | null>(null)
    const tooltipId: string = useId()

    useEffect(() => {
        if (textRef.current) {
            const isTruncated = textRef.current.scrollWidth > textRef.current.clientWidth
                || textRef.current.scrollHeight > textRef.current.clientHeight;
            setIsTruncated(isTruncated);
        }
    }, [text]);

    return <>{isTruncated &&
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
    </>
}

function AnswerChoiceImage({ url }: { url: string }) {
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)

    useEffect(() => {
        chrome.runtime.sendMessage(
            { action: "FETCH_URL", url: url },
            (response) => {
                if (response.dataUrl) {
                    setImageUrl(response.dataUrl)
                } else {
                    console.error("Image failed to load:", response.error);
                }
            }
        );
    }, [url]);

    if (imageUrl === undefined) return <></>
    return <img
        className={"unrot-answer-image"}
        src={imageUrl}
        alt={"question image"}
        style={{
            borderRadius: "8px",
            maxWidth: "100%",
            maxHeight: "100%",
        }}
    />
}

export default AnswerChoice