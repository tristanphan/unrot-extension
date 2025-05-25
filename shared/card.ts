export interface Card {
    id: string,
    question: string | null,
    question_img: string | null,
    answer: string | null,
    answer_img: string | null,
    confidence: number,  // [-10, 10]
}