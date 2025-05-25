import { Card } from "../../shared/card.ts";

export function confidenceScoreDiffer(correctness: boolean, questionConfidence: number) {
    return Math.floor((correctness)
        ? (-questionConfidence + 20) * 7  // [210, 70]
        : -(questionConfidence + 20) * 4)  // [-40, -120]
}

export function confidenceWeighter(card: Card) {
    return ((-card.confidence + 10) / 20 + 0.5)  // [0.5, 1.5]
}

export function sampleWeighted<T>(
    bag: T[],
    weightFunction: (obj: T) => number, // higher weight -> higher chance to get picked
): T {
    let totalWeights: number = 0;
    bag.forEach((obj: T) => totalWeights += weightFunction(obj))
    let distanceRemaining: number = Math.random() * totalWeights
    for (const obj of bag) {
        const weight: number = weightFunction(obj)
        distanceRemaining -= weight
        if (distanceRemaining < 0) return obj
    }
    // This should never happen
    return bag[bag.length - 1]
}

export function sample<T>(bag: T[], avoid: T[]) {
    if (bag.length <= avoid.length) throw new Error("sample cannot be collected")
    let candidate: T = bag[Math.floor(Math.random() * bag.length)]
    while (avoid.includes(candidate)) {
        candidate = bag[Math.floor(Math.random() * bag.length)]
    }
    return candidate
}

