import { ReactNode, useCallback, useEffect, useState } from "react";
import AnswerChoice from "./AnswerChoice.tsx";
import { Question } from "./card_fetcher.ts";
import { Card } from "../../shared/card.ts";

function QuestionCard(
    {
        card,
        answerHandler,
    }: {
        card: Question,
        answerHandler: (correct: boolean, card: Card) => void,
    }): ReactNode {
    const [enableAnswerChoices, setEnableAnswerChoices] = useState<boolean>(true)
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)

    const clickHandler = useCallback((correct: boolean) => {
        setEnableAnswerChoices(false)
        answerHandler(correct, card.correctCard)
    }, [answerHandler, card.correctCard])

    useEffect(() => {
        chrome.runtime.sendMessage(
            { action: "FETCH_URL", url: card.question.img },
            (response) => {
                if (response.dataUrl) {
                    setImageUrl(response.dataUrl)
                } else {
                    console.error("Image failed to load:", response.error);
                }
            }
        );
    }, [card.question.img]);

    return <div style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    }}>
        <div
            className={"unrot-question-box"}
            style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: (imageUrl === undefined || card.question.text === undefined)
                    ? "center"
                    : "space-between",
                width: "80%",
                paddingBottom: "20px",
            }}
        >
            {(card.question.text !== undefined) && <div
                className={"unrot-question-text"}
                style={{
                    fontWeight: "bold",
                    fontSize: "14pt",
                    maxWidth: "80%",
                }}
            >{card.question.text}</div>}
            {(imageUrl !== undefined && card.question.text !== undefined) && <div
                style={{ marginLeft: "15px" }}
            />}
            {(imageUrl !== undefined) && <img
                className={"unrot-question-image"}
                src={imageUrl}
                alt={"question image"}
                style={{
                    borderRadius: "15px",
                    maxWidth: (card.question.text === undefined) ? "70%" : "40%",
                    maxHeight: (card.question.text === undefined) ? "200px" : "150px",
                }}
            />}
        </div>
        <div
            className={"unrot-answer-row"}
            style={{
                display: "flex",
                flexDirection: "row",
                width: "90%",
                maxHeight: "150px",
            }}
        >
            <AnswerChoice
                answer={card.answers[0]}
                isCorrect={card.correctIndex === 0}
                clickHandler={clickHandler}
                isEnabled={enableAnswerChoices}
            />
            <AnswerChoice
                answer={card.answers[1]}
                isCorrect={card.correctIndex === 1}
                clickHandler={clickHandler}
                isEnabled={enableAnswerChoices}
            />
        </div>
        <div
            className={"unrot-answer-row"}
            style={{
                display: "flex",
                flexDirection: "row",
                width: "90%",
                maxHeight: "150px",
            }}
        >
            <AnswerChoice
                answer={card.answers[2]}
                isCorrect={card.correctIndex === 2}
                clickHandler={clickHandler}
                isEnabled={enableAnswerChoices}
            />
            <AnswerChoice
                answer={card.answers[3]}
                isCorrect={card.correctIndex === 3}
                clickHandler={clickHandler}
                isEnabled={enableAnswerChoices}
            />
        </div>
    </div>
}

export default QuestionCard
