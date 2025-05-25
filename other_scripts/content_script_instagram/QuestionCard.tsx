import { ReactNode, useCallback, useState } from "react";
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

    const clickHandler = useCallback((correct: boolean) => {
        setEnableAnswerChoices(false)
        answerHandler(correct, card.correctCard)
    }, [answerHandler, card.correctCard])

    return <div style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    }}>
        <div
            className={"unrot-question-text"}
            style={{
                fontWeight: "bold",
                fontSize: "14pt",
                maxWidth: "80%",
                paddingBottom: "20px",
            }}
        >{card.question.text}</div>
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
                text={card.answers[0].text ?? "placeholder"}
                isCorrect={card.correctIndex === 0}
                clickHandler={clickHandler}
                isEnabled={enableAnswerChoices}
            />
            <AnswerChoice
                text={card.answers[1].text ?? "placeholder"}
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
                text={card.answers[2].text ?? "placeholder"}
                isCorrect={card.correctIndex === 2}
                clickHandler={clickHandler}
                isEnabled={enableAnswerChoices}
            />
            <AnswerChoice
                text={card.answers[3].text ?? "placeholder"}
                isCorrect={card.correctIndex === 3}
                clickHandler={clickHandler}
                isEnabled={enableAnswerChoices}
            />
        </div>
    </div>
}

export default QuestionCard
