import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { setScrollLock } from "./scroll.ts";
import { getCard, Question, updateConfidence } from "./card_fetcher.ts";
import QuestionCard from "./QuestionCard.tsx";
import { useChromeStorageLocal } from "use-chrome-storage";
import { Card } from "../../shared/card.ts";
import { confidenceScoreDiffer } from "./algorithms.ts";
import NoCards from "./NoCards.tsx";

function QuestionPage(
    {
        width,
        height,
    }: {
        width: string,
        height: string,
    }): ReactNode {
    const [card, setCard] = useState<Question | undefined>(undefined)
    const questionElementId = useRef<number>(0)
    const [numberCompleted, setNumberCompleted] = useState<number>(0)
    const [numberTotal, _setNumberTotal] = useState<number>(5)
    const [solved, setSolved] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [isWrong, setIsWrong] = useState<boolean>(false)
    const [score, setScore] = useChromeStorageLocal("score", 0);

    const { ref, inView } = useInView({
        threshold: 0.8,
    });

    const printingRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        getCard().then((card) => {
            console.log("got card", card)
            questionElementId.current++
            setCard(card)
            if (card === undefined) {
                setError(true)
                setScrollLock(false)
            }
        })
    }, []);

    useEffect(() => {
        if (inView && !solved && !error) {
            console.log("SCROLL LOCK")
            setScrollLock(true)
            setTimeout(() => {
                printingRef.current?.scrollIntoView({
                    behavior: "smooth",
                    inline: "center",
                    block: "center",
                });
            }, 500)
        }
    }, [error, inView, solved])

    const answerHandler = useCallback(async (correct: boolean, card: Card) => {
        console.log("answer handler", correct)
        if (correct) {
            await updateConfidence(1, card.id)
            setNumberCompleted(numberCompleted + 1)
            setTimeout(() => {
                if (numberCompleted + 1 === numberTotal) {
                    // Done
                    console.log("SCROLL UNLOCK")
                    setCard(undefined);
                    setSolved(true)
                    setScrollLock(false)
                } else {
                    // Not done yet
                    getCard().then((card) => {
                        console.log("got card", card)
                        questionElementId.current++
                        setCard(card)
                    })
                }
            }, 1000)
        } else {
            await updateConfidence(-1, card.id)
            setIsWrong(true)
        }

        let scoreDiff = confidenceScoreDiffer(correct, card.confidence)
        if (score + scoreDiff < 0) scoreDiff = -score
        setScore(score + scoreDiff)
    }, [numberCompleted, numberTotal, score, setScore])

    const congratulationsText: ReactNode = solved
        ? <div style={{
            fontWeight: 600,
            fontSize: "14pt",
        }}>
            good work! time to rot your brain again
        </div>
        : undefined

    const questionCard: ReactNode = (card !== undefined)
        ? <QuestionCard
            card={card}
            answerHandler={answerHandler}
            key={questionElementId.current}
        />
        : <NoCards></NoCards>

    return <div
        className={"unrot-outer-container"}
        style={{
            display: "flex",
            justifyContent: "center",
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
            fontFamily: "Nunito, sans-serif"
        }}
        ref={ref}
    >
        <div
            className={"unrot-card-container"}
            style={{
                width: width,
                height: height,
                display: "flex",
                alignItems: "center",
                marginRight: "70px",
                marginTop: "30px",
                marginBottom: "30px",
                flexDirection: "column",
                backgroundColor: "#161616",
                borderRadius: "36px",
                border: "1px solid #2e2e2e",
            }}
            ref={printingRef}
        >
            {!error && <UpperBar numberCompleted={numberCompleted} numberTotal={numberTotal}/>}
            <div
                className={"unrot-question-container"}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    padding: "15px",
                    textAlign: "center",
                    width: "100%",
                }}
            >
                {questionCard}
                {congratulationsText}
            </div>
            {!error && <LowerBar
                onContinue={() => {
                    getCard().then((card) => {
                        console.log("got card", card)
                        questionElementId.current++
                        setCard(card)
                        setIsWrong(false)
                    })
                }}
                showContinue={isWrong}
                score={score}
            />}
        </div>
    </div>
}

function UpperBar(
    {
        numberCompleted,
        numberTotal,
    }:
    {
        numberCompleted: number,
        numberTotal: number,
    }) {
    return <div
        style={{
            position: "relative",
            width: "100%",
        }}
    >
        <div
            className={"unrot-slogan-text"}
            style={{
                fontWeight: 600,
                fontSize: "14pt",
                position: "absolute",
                left: 0,
                right: 0,
                top: "15px",
                textAlign: "center",
            }}
        >undoom your scroll!
        </div>
        <div
            className={"unrot-progress-text"}
            style={{
                position: "absolute",
                right: "20px",
                top: "15px",
                fontWeight: 800,
                fontSize: "14pt",
                opacity: 0.7,
            }}
        >{numberCompleted} / {numberTotal}</div>
    </div>
}

function LowerBar(
    { onContinue, showContinue, score }:
    { onContinue: () => void, showContinue: boolean, score: number }
) {
    return <div
        style={{
            position: "relative",
            width: "100%",
        }}>
        <div
            className={"unrot-score-text"}
            style={{
                position: "absolute",
                left: "20px",
                bottom: "15px",
                fontWeight: 800,
                fontSize: "14pt",
                opacity: 0.7,
                textAlign: "left"
            }}
        >
        <span style={{
            fontSize: "12pt",
            fontWeight: "normal",
        }}>score</span>
            <br/>
            {score}
        </div>
        {showContinue && <div
            className={"unrot-continue-button"}
            style={{
                backgroundColor: "#4255ff",
                border: "1px solid #424242",
                borderRadius: "15px",
                cursor: "pointer",
                position: "absolute",
                bottom: "60px",
                right: "30px",
                padding: "10px 15px",
            }}
            onClick={onContinue}
        >
            try another
        </div>
        }
    </div>
}

export default QuestionPage
