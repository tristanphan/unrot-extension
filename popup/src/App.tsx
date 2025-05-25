import {ReactNode, useState} from "react";
import '@mantine/core/styles.css';
import { MantineProvider, SegmentedControl, FileButton, Button, Text } from '@mantine/core';
import { ButtonProgress } from './ButtonProgress';
import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";

function App(): ReactNode {
    const [question, setQuestion] = useState('term');
    const [file, setFile] = useState<File | null>(null);
    
    async function sendFile(file : File | null): Promise<void> {
        if (file) {
            setFile(file);
            const ai = new GoogleGenAI({ apiKey: "AIzaSyDGCVYSlZGcdCuydMe6mUvVouuPaCoCVnM" });
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
            }
        }
    }

    return (
        <MantineProvider>
            <SegmentedControl 
                value={question}
                onChange={setQuestion}
                data={['term', 'def']} 
            />
            <ButtonProgress 
                question={question}
            />
            <FileButton onChange={sendFile} accept="pdf">
                {(props) => <Button {...props}>Upload slides pdf</Button>}
            </FileButton>
            {file && (
                <Text size="sm" ta="center" mt="sm">
                Picked file: {file.name}
                </Text>
            )}
        </MantineProvider>

    )
}

export default App
