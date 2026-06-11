import { useState, useEffect, useRef } from 'react'
import type { MoboUrlEntry } from './SearchScrapeInterface';

interface ScrapeMoboProps {
    apiKey: string;
    moboUrlList: MoboUrlEntry[];
    returnScrapeCompleted: (successItemsCount:number) => void;
}

function ScrapeMobo({ apiKey, moboUrlList, returnScrapeCompleted } : ScrapeMoboProps) {
    const [progress, setProgress] = useState<number>(0);
    const [itemIndex, setItemIndex] = useState<number>(0);

    const progressBarRef = useRef<number | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const statusRef = useRef<string>("idle");
    const dataRef = useRef<string>("");
    const successItems = useRef<number>(0);

    const longTaskTimeoutWait = 8000; // in milliseconds
    const progressBarInterval = (longTaskTimeoutWait + 1000) / 100; // add 1 second to ensure progress bar is not 100% if timeout
    const postItemWait = 2500; // in milliseconds

    async function runLongTask() {
        abortControllerRef.current = new AbortController();
        const timeoutId = setTimeout(() => abortControllerRef.current!.abort('timeoutReached'), longTaskTimeoutWait); 
        statusRef.current = "itemRunning";

        console.log(moboUrlList[itemIndex].link);

        try {
            const response = await fetch('https://0e5b84ad-faf7-4fa3-9d6d-141325be66ab.mock.pstmn.io/delay20secs', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'x-mock-response-delay': '5000' // make sure actual task finishes max 2 seconds before timeout wait
                },
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) throw new Error('Fetch failed');
            
            const result = await response.json();
            dataRef.current = JSON.stringify(result);
            statusRef.current = "itemSuccess";
            
        } catch (error: any) {
            if (error === 'timeoutReached') statusRef.current = "itemTimedOut";
            else if (error === 'taskAbortedReached') statusRef.current = "taskAborted";
            else statusRef.current = "itemFetchFailed";

        } finally {
            clearTimeout(timeoutId);
            setProgress(0);
        }
    }

    function abortScraping() {
        if (abortControllerRef.current) abortControllerRef.current.abort('taskAbortedReached');
    }

    useEffect(() => {
        if (!progressBarRef.current) {
            progressBarRef.current = setInterval(() => {
                setProgress((prev) => (prev < 99 ? prev + 1 : prev));
            }, progressBarInterval);

            runLongTask();
        }
        if (progressBarRef.current && !(statusRef.current === "idle" || statusRef.current === "itemRunning")) {
            clearInterval(progressBarRef.current);
            progressBarRef.current = null;
            abortControllerRef.current = null;

            if (statusRef.current === "itemSuccess") { console.log(dataRef.current); successItems.current ++; } 

            setTimeout(() => {
                if (statusRef.current !== "taskAborted" && itemIndex < moboUrlList.length - 1) setItemIndex(prevIndex => prevIndex + 1);
                else if (statusRef.current === "taskAborted" || itemIndex === moboUrlList.length - 1) returnScrapeCompleted(successItems.current);
            }, postItemWait);
            
        }
        if (progressBarRef.current && progress < 99) return;

        return () => {
            if (progressBarRef.current) {
                clearInterval(progressBarRef.current);
                progressBarRef.current = null;
                abortControllerRef.current = null;
            }
        }
    }, [ progress, itemIndex ]);

    const moboTitle = moboUrlList[itemIndex].title;
    let statusText = "";

    if (statusRef.current === "idle") statusText = "Idle";
    else if (statusRef.current === "itemRunning") statusText = `Scraping ${moboTitle} specifications...`;
    else if (statusRef.current === "itemSuccess") statusText = `Scraped ${moboTitle} successfully!`;
    else if (statusRef.current === "itemTimedOut") statusText = `Scraping ${moboTitle} specifications timed out after ${longTaskTimeoutWait/1000} seconds.`;
    else if (statusRef.current === "taskAborted") statusText = "Scraping is aborted!";
    else if (statusRef.current === "itemFetchFailed") statusText = `Scraping ${moboTitle} failed with error(s)`;

    return (
        <>
            <div className="subContainer">
                <div className="input-group">
                    <label className="input-group-text col-10">{statusText}</label>
                    <button onClick={abortScraping} className="btn btn-secondary col-2">Stop Scraping</button>
                </div>
                
                <div className="progress mt-2">
                    <div className="progress-bar" role="progressbar" style={{ width: `${progress}%`, height: '35px' }} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}></div>
                </div>
            </div>
        </>
    )
}

export default ScrapeMobo