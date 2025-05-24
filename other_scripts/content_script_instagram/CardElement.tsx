import { ReactNode } from "react";
import { Card } from "../../shared/card.ts";

function CardElement(
    {
        card,
        width,
        height,
    }: {
        card: Card,
        width: string,
        height: string,
    }): ReactNode {
    return <div style={{
        display: "flex",
        justifyContent: "center",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
    }}
    >
        <div style={{
            width: width,
            height: height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "70px",
            flexDirection: "column",
        }}
        >
            <div>time to unrot!</div>
            <div>{card.question}</div>
            <div>{card.answer}</div>
        </div>
    </div>
}

export default CardElement
