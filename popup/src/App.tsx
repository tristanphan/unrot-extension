import {ReactNode, useState} from "react";
import '@mantine/core/styles.css';
import { Button, Card, createTheme, FileButton, MantineProvider, SegmentedControl, Text } from '@mantine/core';
import { ButtonProgress } from './ButtonProgress';
import { sendFile } from './utils.ts';

function App(): ReactNode {
    const [question, setQuestion] = useState('term');
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const [quizletLoaded, setQuizletLoaded] = useState(false);
    const [pdfCardsReturned, setPdfCardsReturned] = useState(false);

    const theme = createTheme({
        fontFamily: "Nunito, sans-serif",
    })

    return (
        <MantineProvider theme={theme} defaultColorScheme={"dark"}>
            <Card withBorder padding="md" radius="md" shadow="sm">
                <Text size="xl" fw={700}>unrot</Text>
                <Text size="sm" opacity={0.8}>question field</Text>
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
                <Text ta={"center"} mt={"xs"}>or</Text>
                <FileButton onChange={(file) => {
                    sendFile(file, setPdfCardsReturned);
                    setPdfLoaded(true);
                    setPdfCardsReturned(false);
                    setQuizletLoaded(false)
                }} accept="pdf">
                    {
                        (props) =>
                            <Button mt="xs" radius="md" color={pdfCardsReturned ? 'teal' : 'blue'} {...props} fw={"bold"}>
                                {pdfLoaded ? pdfCardsReturned ? 'cards ready' : 'uploaded pdf...' : 'pdf → cards'}
                            </Button>
                    }
                </FileButton>
            </Card>
        </MantineProvider>

    )
}

export default App
