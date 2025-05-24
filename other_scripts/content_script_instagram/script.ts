import { Card } from "../../shared/card.ts";
import { EXTENSION_NAME } from "../../shared/constants.ts";
import { createRoot, Root } from "react-dom/client";
import CardElement from "./CardElement.tsx";
import { createElement } from "react";

async function getRandomCard(): Promise<Card | undefined> {
    const cards: (Card[] | undefined) = (await chrome.storage.local.get("results"))["results"];
    if (cards === undefined) return undefined
    const index: number = Math.floor(Math.random() * cards.length)
    return cards[index]
}

function createQuizCardElement(card: Card, sibling: HTMLElement) {

    // Create quiz card
    const boundingBox: HTMLElement = sibling.querySelector(":scope > div > div")!
    const quizCardElement: HTMLDivElement = document.createElement("div")
    quizCardElement.id = "my-react-root"
    quizCardElement.classList.add(EXTENSION_NAME)
    const quizCardReactElement = createElement(CardElement, {
        card: card,
        width: boundingBox.style.width,
        height: boundingBox.style.height,
    })

    const parent: HTMLElement = sibling.parentElement!
    parent.insertBefore(quizCardElement, sibling.nextElementSibling)
    const root: Root = createRoot(quizCardElement)
    root.render(quizCardReactElement)
}

async function handleNewReels(elements: HTMLElement[]): Promise<void> {
    for (const element of elements) {
        if (!element.hasChildNodes()) continue

        const card: Card | undefined = await getRandomCard()
        if (card === undefined) {
            console.warn("No cards found, skipping for now")
            return
        }

        createQuizCardElement(card, element)
    }
}

function setupReelListener() {
    const reelContainer: HTMLDivElement = document.querySelector("section > main > div")!

    const observer = new MutationObserver((mutationList: MutationRecord[], _observer: MutationObserver) => {
        const elements: HTMLElement[] = mutationList
            .filter((mutation) => mutation.type === "childList")
            .flatMap((mutation) => mutation.addedNodes)
            .flatMap((addedNodes) => Array.from(addedNodes))
            .map((node) => node as HTMLElement)
            .filter((node) => !node.classList.contains(EXTENSION_NAME))

        if (elements.length > 0) {
            console.log(`Observed ${elements.length} newly-added nodes: `, elements)
        }
        void handleNewReels(elements)
    })

    observer.observe(reelContainer, {
        childList: true,
        subtree: false,
        attributes: false,
        attributeOldValue: false,
        characterData: false,
        characterDataOldValue: false,
    })
}

if (document.readyState === 'complete') {
    setupReelListener()
} else {
    window.onload = setupReelListener
}