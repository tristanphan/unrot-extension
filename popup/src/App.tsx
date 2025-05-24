import {ReactNode, useState} from "react";
import '@mantine/core/styles.css';
import { MantineProvider, SegmentedControl } from '@mantine/core';
import { ButtonProgress } from './ButtonProgress';

function App(): ReactNode {
    const [question, setQuestion] = useState('term');

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
        </MantineProvider>

    )
}

export default App
