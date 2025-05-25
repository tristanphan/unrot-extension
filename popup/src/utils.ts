import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";
import { Card } from '../../shared/card.ts';

function extractCardsFromString(str: string): Card[] | null {
  const match = str.match(/\[.*\]/s);
  if (match) {
    try {
        const results = JSON.parse(match[0]);
        console.log('results: ', results);
        return results.map((card: Card) => {
            card.question_img = null;
            card.answer_img = null;
            return card;
        });
    } catch (e) {
    }
  }
  return null;
}

export async function sendFile(file : File | null, setPdfCardsReturned: Function): Promise<void> {
    if (file) {
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY});
        console.log("added api key");
        const myfile = await ai.files.upload({
            file: file,
            config: { mimeType: "application/pdf"}
        });
        console.log("Uploaded file:", myfile);
        if (myfile.uri && myfile.mimeType) {
            const result = await ai.models.generateContent({
                model: "gemini-2.0-flash", 
                contents: createUserContent([
                    createPartFromUri(myfile.uri, myfile.mimeType),
                    "\n\n",
                    `
                    You are a detail oriented student assistant, responsible for translating given text into flashcards. Generate 50-100 flashcards about the attached PDF. Do not use any information beside the text itself. Do not cite any sources, including the provided PDF. 

                    Convert the response to stringified JSON of the following format: 

                    [{question:"", answer:""}, {}] 

                    Here are some shorter examples: 
                    Results for biology flashcards: [{question: "Diffusion", answer:"The passive movement of particles from an area of high concentration to low concentration. This happens along a concentration gradient"}, {question: "Osmosis", answer:"A passive movement of water molecules through a semi permeable membrane. Water moves from an area of low solute concentration to high solute concentration"}, {question:"Isotonic Solution", answer:"The same concentration of dissolved substances. Water in = water out."}, {question:"Exocytosis", answer:"Movement out of a cell"}] 

                    Results for AP US History flashcards: 
                    [{question:"Great Columbian / Biological Exchange", answer: "Exchange of plants and animals between the New World and Europe following the discovery of America in 1492."}, {question:"Virgina colony", answer:"This colony was founded in 1607. First settlement was Jamestown. Charter to stock company/royal. Tobacco was vital to its survival."}] 
                    `,
                ]),
            });
            console.log("result.text=", result.text);
            if (result.text) {
                const cards: Card[] | null = extractCardsFromString(result.text);
                if (cards) {
                    console.log('cards: ', cards);
                    chrome.storage.local.set({'results': cards}, () => {
                        chrome.storage.local.get(['results']).then((result) => {console.log(result)})}
                    );
                    setPdfCardsReturned(true);
                    return;
                }
            }
            alert('sorry an error occurred. please try again');
        }
    }
}