import {ReactNode, useState} from "react";
import '@mantine/core/styles.css';
import { Button, Card, FileButton, MantineProvider, SegmentedControl, Text } from '@mantine/core';
import { ButtonProgress } from './ButtonProgress';
import { sendFile } from './utils.ts';

function App(): ReactNode {
    const [question, setQuestion] = useState('term');

    return (
        <MantineProvider>
            <Card withBorder padding="md" radius="md" shadow="sm">
                <Text size="xl" fw={700}>unrot</Text>
                <Text>Question (Front):</Text>
                <SegmentedControl 
                    value={question}
                    onChange={setQuestion}
                    data={['term', 'def']} 
                />
                <ButtonProgress 
                    question={question}
                />
                <FileButton onChange={sendFile} accept="pdf">
                    {(props) => <Button {...props}>Generate cards from PDF</Button>}
                </FileButton>
            </Card>
        </MantineProvider>

    )
}

export default App
