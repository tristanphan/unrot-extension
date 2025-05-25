import { EXTENSION_NAME } from "../../shared/constants.ts";
import { createRoot, Root } from "react-dom/client";
import QuestionPage from "./QuestionPage.tsx";
import { createElement } from "react";

function injectNunitoCss() {
    const googleapisLink = document.createElement("link")
    googleapisLink.href = "https://fonts.googleapis.com"
    googleapisLink.rel = "preconnect"
    document.head.append(googleapisLink)

    const gstaticLink = document.createElement("link")
    gstaticLink.href = "https://fonts.gstatic.com"
    gstaticLink.rel = "preconnect"
    document.head.append(gstaticLink)

    const nunitoLink = document.createElement("link")
    nunitoLink.href = "https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
    nunitoLink.rel = "stylesheet"
    document.head.append(nunitoLink)
}

function insertQuizCardElement(sibling: HTMLElement) {

    // Create quiz card
    const boundingBox: HTMLElement = sibling.querySelector(":scope > div > div")!
    const quizCardElement: HTMLDivElement = document.createElement("div")
    quizCardElement.id = "my-react-root"
    quizCardElement.classList.add(EXTENSION_NAME)
    const quizCardReactElement = createElement(QuestionPage, {
        width: boundingBox.style.width,
        height: boundingBox.style.height,
    })

    const parent: HTMLElement = sibling.parentElement!
    parent.insertBefore(quizCardElement, sibling.nextElementSibling)
    const root: Root = createRoot(quizCardElement)
    root.render(quizCardReactElement)
}

let pity: number = 0
const MAX_PITY: number = 10

async function handleNewReels(elements: HTMLElement[]): Promise<void> {
    /**
     * ==== Heuristics for adding a quiz ====
     * 1. do not append to the last element of a batch
     * 2. do not append to consecutive batches
     * 3. each eligible element has a 20% chance of appending
     */
    const videoElements = elements
        .filter((element) => element.hasChildNodes())
    let index: number = 0
    while (index < videoElements.length - 1) {
        // Gambling
        let shouldAppend: boolean = (Math.random() < 0.25)
        if (pity === MAX_PITY) shouldAppend = true
        if (shouldAppend) {
            pity = 1 // because we skip 1
            insertQuizCardElement(videoElements[index])
            index += 2
        } else {
            pity += 1
            index += 1
        }
    }
}

function setupReelListener() {
    injectNunitoCss()
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