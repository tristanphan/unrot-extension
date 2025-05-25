import { useState } from 'react';
import { Button, Progress, rgba, useMantineTheme } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import classes from './ButtonProgress.module.css';


async function send(question : string) {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const tabId = tab.id;
    if (tabId !== undefined) {
        await chrome.tabs.sendMessage(tabId, "parse-cards-"+question).then(
            () => {console.log('successful response')}, 
            () => {console.log('failure')});
    }
}

interface ButtonProgressProps {
  question: string
  quizletLoaded: boolean
  setPdfLoaded: Function
  setPdfCardsReturned: Function
  setQuizletLoaded: Function
}

export function ButtonProgress({quizletLoaded, setPdfLoaded, setPdfCardsReturned, setQuizletLoaded, question} : ButtonProgressProps) {
  const theme = useMantineTheme();
  const [progress, setProgress] = useState(0);

  const interval = useInterval(
    () =>
      setProgress((current) => {
        if (current < 100) {
          return current + 10;
        }

        interval.stop();
        setQuizletLoaded(true);
        setPdfLoaded(false);
        setPdfCardsReturned(false);
        return 0;
      }),
    20
  );

  return (
    <Button
      fullWidth
      className={classes.button}
      onClick={() => {
        send(question);
        return quizletLoaded ? setQuizletLoaded(false) : !interval.active && interval.start();
      }}
      color={quizletLoaded ? 'teal' : 'blue'}
      fw={"bold"}
      radius="md"
      mt="sm"
    >
      <div className={classes.label}>
        {progress !== 0 ? 'loading cards' : quizletLoaded ? 'cards uploaded' : 'load cards from quizlet'}
      </div>
      {progress !== 0 && (
        <Progress
          value={progress}
          className={classes.progress}
          color={rgba(theme.colors.blue[2], 0.35)}
          radius="sm"
        />
      )}
    </Button>
  );
}