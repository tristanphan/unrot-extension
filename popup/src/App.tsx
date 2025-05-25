import {ReactNode, useState} from "react";
import '@mantine/core/styles.css';
import { Button, Card, FileButton, MantineProvider, SegmentedControl, Text} from '@mantine/core';
import { ButtonProgress } from './ButtonProgress';
import { sendFile } from './utils.ts';

function App(): ReactNode {
    const [question, setQuestion] = useState('term');
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const [quizletLoaded, setQuizletLoaded] = useState(false);

    return (
        <MantineProvider>
            <Card withBorder padding="md" radius="md" shadow="sm">
                <Text size="xl" fw={700}>unrot</Text>
                <Text c="dimmed" size="sm">Front:</Text>
                <SegmentedControl 
                    value={question}
                    onChange={setQuestion}
                    data={['term', 'def']} 
                />
                <ButtonProgress 
                    quizletLoaded={quizletLoaded}
                    setPdfLoaded={setPdfLoaded}
                    setQuizletLoaded={setQuizletLoaded}
                    question={question}
                />
                <FileButton onChange={(file) => {sendFile(file); setPdfLoaded(true); setQuizletLoaded(false)}} accept="pdf">
                    {
                    (props) => 
                        <Button mt="sm" radius="md" color={pdfLoaded ? 'teal' : 'blue'} {...props}>
                            {pdfLoaded ? 'Uploaded PDF' : 'PDF → Cards'}
                        </Button>
                    }
                </FileButton>
            </Card>
        </MantineProvider>

    )
}

export default App
