import {ReactNode} from "react";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { ButtonProgress } from './ButtonProgress';

function App(): ReactNode {
    return <MantineProvider>
                <ButtonProgress />
            </MantineProvider>
}

export default App
