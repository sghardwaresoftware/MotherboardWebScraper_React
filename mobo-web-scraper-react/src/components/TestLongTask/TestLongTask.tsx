import { useState, useEffect, useRef } from 'react'

function TestLongTask() {
    const [progress, setProgress] = useState(0);

    const progressTaskRef = useRef<number | null>(null);
    const statusRef = useRef<string>("idle");
    const dataRef = useRef<string>("");
    const itemIndexRef = useRef<number>(0);

    const longTaskTimeoutWait = 20000; // in milliseconds
    const progressBarInterval = (longTaskTimeoutWait + 1000) / 100; // add 1 second to ensure progress bar is not 100% if timeout
    const items = ["item1", "item2", "item3"];

    async function runLongTask() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort('Timeout reached'), longTaskTimeoutWait); 
        statusRef.current = "running";

        try {
            const response = await fetch('https://0e5b84ad-faf7-4fa3-9d6d-141325be66ab.mock.pstmn.io/delay20secs', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'x-mock-response-delay': '18000' // make sure actual task finishes max 2 seconds before timeout wait
                },
                signal: controller.signal
            });

            if (!response.ok) throw new Error('Fetch failed');
            
            const result = await response.json();
            dataRef.current = JSON.stringify(result);
            statusRef.current = "success";
            
        } catch (error: any) {
            if (error.name === 'AbortError' || error === 'Timeout reached') {
                statusRef.current = "timedOut";
            } 
            else {
                statusRef.current = "fetchFailed";
            }
        } finally {
            clearTimeout(timeoutId);
            setProgress(0);
        }
    }

    function abortScraping() {
        statusRef.current = "aborted";
    }

    useEffect(() => {
        if (!progressTaskRef.current) {
            progressTaskRef.current = setInterval(() => {
                setProgress((prev) => (prev < 99 ? prev + 1 : prev));
            }, progressBarInterval);

            runLongTask();
        }
        if (progressTaskRef.current && !(statusRef.current == "idle" || statusRef.current == "running")) {
            clearInterval(progressTaskRef.current);
            progressTaskRef.current = null;
            statusRef.current = "idle";


        }
        if (progressTaskRef.current && progress < 99) return;

        return () => {
            if (progressTaskRef.current) {
                clearInterval(progressTaskRef.current);
                progressTaskRef.current = null;
            }
        }
    }, [ progress ]);

    let statusText = ""
    if (statusRef.current == "idle") statusText = "Idle";
    else if (statusRef.current == "running") statusText = `(${items[itemIndexRef.current]}) Long task in progress...`;
    else if (statusRef.current == "success") statusText = `Long task finished successfully! Response data: {${dataRef.current}}`;
    else if (statusRef.current == "timedOut") statusText = "Long task timed out after 20 seconds";
    else if (statusRef.current == "aborted") statusText = "Long task is aborted";
    else if (statusRef.current == "fetchFailed") statusText = "Long task failed with error(s)";

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

export default TestLongTask
