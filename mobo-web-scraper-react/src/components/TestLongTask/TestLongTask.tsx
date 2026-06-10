import { useState, useEffect, useRef } from 'react';

function TestLongTask() {
    const [progress, setProgress] = useState<number>(-1);
    const [status, setStatus] = useState<string>('Idle');
    const [data, setData] = useState<string>("");

    const taskAlreadyRunning = useRef<boolean>(false);
    const progressInterval = useRef<number | null>(null);

    const startProgress = () => {
        setProgress(0);

        console.log("im running here");

        // increase progress by 1% every 200ms, to acheive 20s timeout
        progressInterval.current = setInterval(() => {
            setProgress((prev) => (prev < 90 ? prev + 1 : prev));
        }, 200);
    };

    const stopProgress = () => {
        setProgress(0);

        if (progressInterval.current) {
            clearInterval(progressInterval.current);
        }
    };

    const fetchData = async () => {
        startProgress();
        setStatus('Starting...');
        setData("");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort('Timeout reached'), 20000); // 20s timeout

        try {
            const response = await fetch('https://0e5b84ad-faf7-4fa3-9d6d-141325be66ab.mock.pstmn.io/delay20secs', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'x-mock-response-delay': '15000' 
                },
                signal: controller.signal
            });

            if (!response.ok) throw new Error('Fetch failed');
            
            const result = await response.json();
            setData(JSON.stringify(result));
            if (taskAlreadyRunning.current) taskAlreadyRunning.current = false; 
            setStatus('Success!');
            setProgress(100);
            
        } catch (error: any) {
            if (error.name === 'AbortError' || error === 'Timeout reached') {
                setStatus('Request Timed Out');
            } 
            else {
                setStatus(`Error: ${error.message}`);
            }
        } finally {
            clearTimeout(timeoutId);
            stopProgress();
        }
    };

    function beginFetchData() {
        if (!taskAlreadyRunning.current) {
            taskAlreadyRunning.current = true;
            fetchData();
        }
    }

    useEffect(() => {
        beginFetchData();
        return () => stopProgress(); // Cleanup interval on unmount
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <button onClick={beginFetchData} style={{ padding: '10px 20px', marginBottom: '20px' }} disabled={taskAlreadyRunning.current}>
                Fetch Data
            </button>

            {/* Progress Bar UI */}
            <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
            <div 
                style={{
                width: `${progress}%`,
                height: '10px',
                backgroundColor: '#3b82f6',
                borderRadius: '5px',
                transition: 'width 0.3s ease-in-out'
                }}
            />
            </div>
            
            <p><strong>Status:</strong> {status}</p>
            {data && <p style={{ background: '#f4f4f4', padding: '10px' }}>{data}</p>}
        </div>
    );
}

export default TestLongTask;