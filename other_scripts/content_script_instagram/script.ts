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

async function handleNewReels(elements: HTMLElement[]): Promise<void> {
    elements
        .filter((element) => element.hasChildNodes())
        .forEach((element, index) => {
            if (index % 4 === 0) insertQuizCardElement(element)
        })
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