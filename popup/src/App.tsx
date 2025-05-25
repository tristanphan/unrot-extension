import {ReactNode, useState} from "react";
import '@mantine/core/styles.css';
import { Button, Card, FileButton, MantineProvider, SegmentedControl, Text} from '@mantine/core';
import { ButtonProgress } from './ButtonProgress';
import { sendFile } from './utils.ts';

function App(): ReactNode {
    const [question, setQuestion] = useState('term');
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const [quizletLoaded, setQuizletLoaded] = useState(false);
    const [pdfCardsReturned, setPdfCardsReturned] = useState(false);

    return (
        <MantineProvider>
            <Card withBorder padding="md" radius="md" shadow="sm">
                <Text size="xl" fw={700}>unrot</Text>
                <Text c="dimmed" size="sm">front:</Text>
                <SegmentedControl 
                    value={question}
                    onChange={setQuestion}
                    data={['term', 'def']} 
                />
                <ButtonProgress 
                    quizletLoaded={quizletLoaded}
                    setPdfLoaded={setPdfLoaded}
                    setQuizletLoaded={setQuizletLoaded}
                    setPdfCardsReturned={setPdfCardsReturned}
                    question={question}
                />
                <FileButton onChange={(file) => {sendFile(file, setPdfCardsReturned); setPdfLoaded(true); setPdfCardsReturned(false); setQuizletLoaded(false)}} accept="pdf">
                    {
                    (props) => 
                        <Button mt="sm" radius="md" color={pdfCardsReturned? 'teal' : 'blue'} {...props}>
                            {pdfLoaded ? pdfCardsReturned ? 'cards ready' : 'uploaded pdf...' : 'pdf → cards'}
                        </Button>
                    }
                </FileButton>
            </Card>
        </MantineProvider>

    )
}

export default App
