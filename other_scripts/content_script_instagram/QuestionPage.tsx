import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { setScrollLock } from "./scroll.ts";
import { getCard, Question } from "./card_fetcher.ts";
import QuestionCard from "./QuestionCard.tsx";

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
    const [isWrong, setIsWrong] = useState<boolean>(false)
    const { ref, inView } = useInView({
        threshold: 0.8,
    });

    const printingRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        getCard().then((card) => {
            console.log("got card", card)
            questionElementId.current++
            setCard(card)
        })
    }, []);

    useEffect(() => {
        if (inView && !solved) {
            console.log("SCROLL LOCK")
            setScrollLock(true)
            setTimeout(() => {
                printingRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 500)
        }
    }, [inView, solved])

    const answerHandler = useCallback(async (correct: boolean) => {
        console.log("answer handler", correct)
        if (correct) {
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
            setIsWrong(true)
        }
    }, [numberCompleted, numberTotal])

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
        : undefined

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
            <UpperBar numberCompleted={numberCompleted} numberTotal={numberTotal}/>
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
            <LowerBar
                onContinue={() => {
                    getCard().then((card) => {
                        console.log("got card", card)
                        questionElementId.current++
                        setCard(card)
                        setIsWrong(false)
                    })
                }}
                show={isWrong}
            />
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
        >it's time to unrot!
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

function LowerBar({ onContinue, show }: { onContinue: () => void, show: boolean }) {
    if (!show) return undefined
    return <div
        style={{
            position: "relative",
            width: "100%",
        }}>
        <div
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
    </div>
}

export default QuestionPage
