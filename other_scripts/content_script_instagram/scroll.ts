const KEYS_TO_PREVENT: string[] = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];

function preventScroll(e: Event) {
    if (e instanceof KeyboardEvent) {
        if (KEYS_TO_PREVENT.includes(e.key)) e.preventDefault()
    } else e.preventDefault()
}

export function setScrollLock(lock: boolean) {
    if (lock) {
        window.addEventListener('wheel', preventScroll, { passive: false })
        window.addEventListener('touchmove', preventScroll, { passive: false })
        window.addEventListener('keydown', preventScroll, false)
    } else {
        window.removeEventListener('wheel', preventScroll, { passive: false } as EventListenerOptions)
        window.removeEventListener('touchmove', preventScroll, { passive: false } as EventListenerOptions)
        window.removeEventListener('keydown', preventScroll, false)
    }
}

