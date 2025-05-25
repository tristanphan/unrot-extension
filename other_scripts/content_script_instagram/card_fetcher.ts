import { Card } from "../../shared/card.ts";
import { confidenceWeighter, sample, sampleWeighted } from "./algorithms.ts";

export interface Content {
    text: string | undefined,
    img: string | undefined,
}

export interface Question {
    question: { text: string | undefined, img: string | undefined },
    answers: { text: string | undefined, img: string | undefined }[],
    correctIndex: number,
    correctCard: Card,
}

export async function getCard(): Promise<Question | undefined> {
    const cards: (Card[] | undefined) = (await chrome.storage.local.get("results"))["results"];
    if (cards === undefined) return undefined

    const correctCard: Card = sampleWeighted(
        cards, confidenceWeighter
    )
    const incorrectCards: Card[] = [sample(cards, [correctCard])]
    incorrectCards.push(sample(cards, [correctCard, ...incorrectCards]))
    incorrectCards.push(sample(cards, [correctCard, ...incorrectCards]))
    incorrectCards.push(sample(cards, [correctCard, ...incorrectCards]))
    const correctIndex: number = sample([0, 1, 2, 3], [])
    const answerChoices: Content[] = incorrectCards.map((card: Card) => ({
        text: card.answer ?? undefined,
        img: card.answer_img ?? undefined,
    }))
    answerChoices.splice(correctIndex, 0, {
        text: correctCard.answer ?? undefined,
        img: correctCard.answer_img ?? undefined,
    })

    return {
        question: {
            text: correctCard.question ?? undefined,
            img: correctCard.question_img ?? undefined
        },
        answers: answerChoices,
        correctIndex: correctIndex,
        correctCard: correctCard,
    }
}

export async function updateConfidence(delta: number, id: string) {
    const cards: (Card[]) = (await chrome.storage.local.get("results"))["results"] ?? []
    for (const index in cards) {
        if (cards[index].id !== id) continue
        cards[index].confidence += delta
        if (cards[index].confidence > 10) cards[index].confidence = 10
        if (cards[index].confidence < -10) cards[index].confidence = -10
        await chrome.storage.local.set({ 'results': cards })
        return
    }
}