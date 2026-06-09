import { useState, useEffect, useRef } from "react";
import type { SearchResEntry } from "./SearchScrapeInterface";

interface ScrapeMoboProps {
    apiKey: string;
    moboUrlList: SearchResEntry[];
    scrapeCompleted: () => void;
    isScrapeRunning: boolean;
    operationCompleted: boolean;
}

function ScrapeMobo({ apiKey, moboUrlList, scrapeCompleted, isScrapeRunning, operationCompleted }: ScrapeMoboProps) {
    const moboScrapeObj = {
        "moboIndex": 0,
        "moboScrapeTime": 0,
        "isThisMoboDone": false,
        "scrapeAborted": false,
        "scrapeAllDone": false,
        "scrapeSuccessfulCount": 0
    }

    const [_moboScrapeObj, setMoboScrapeObJ] = useState(moboScrapeObj);  

    const maxMoboScrapeTime = 10; // seconds
    const posttMoboActionTimeoutDelay = 1500 // milliseconds

    const moboTitle = isScrapeRunning ? moboUrlList[_moboScrapeObj.moboIndex].title : "";

    useEffect(() => {

        if (!_moboScrapeObj.isThisMoboDone) {
            const moboUrl = moboUrlList[_moboScrapeObj.moboIndex].link;

            if (_moboScrapeObj.moboScrapeTime == maxMoboScrapeTime) {
                setMoboScrapeObJ(prevObj => ({ ...prevObj, 
                    isThisMoboDone: true, 
                    scrapeSuccessfulCount: prevObj.scrapeSuccessfulCount + 1, 
                    moboScrapeTime: 0,
                    scrapeAllDone: _moboScrapeObj.moboIndex >= moboUrlList.length -1 ? true : false
                }));
            }

            const doWorkTimeProgressTimeout = setTimeout(() => {
                setMoboScrapeObJ(prevObj => ({ ...prevObj, 
                    moboScrapeTime: prevObj.moboScrapeTime + 1
                }));
            }, 1000);

            return () => clearTimeout(doWorkTimeProgressTimeout);
        }
        else {
            console.log("Post mobo action");

            const posttMoboActionTimeout = setTimeout(() => {
                if (_moboScrapeObj.scrapeAborted || _moboScrapeObj.scrapeAllDone) {
                    scrapeCompleted();
                }
                else if (_moboScrapeObj.isThisMoboDone) {
                    setMoboScrapeObJ(prevObj => ({ ...prevObj, 
                        moboIndex: prevObj.moboIndex + 1, isThisMoboDone: false
                    }));
                }
            }, posttMoboActionTimeoutDelay);

            return () => clearTimeout(posttMoboActionTimeout);
        }

    }, [ isScrapeRunning, operationCompleted, moboUrlList, _moboScrapeObj ]);

    function abortScraping() {
        setMoboScrapeObJ(prevObj => ({ ...prevObj, 
            isThisMoboDone: true, scrapeAborted: true, moboScrapeTime: 0
        }));
    }

    return (
        <>
            <div style={{ display: isScrapeRunning || !operationCompleted ? "block" : "none" }}>
                <div className="input-group">
                    <p className="input-group-text">{ 
                        _moboScrapeObj.scrapeAborted ?
                        "Scraping motherboard information is aborted!" :
                        _moboScrapeObj.scrapeAllDone ?
                        `All done! Successfully scraped ${_moboScrapeObj.scrapeSuccessfulCount} motherboard URL(s).` :
                        _moboScrapeObj.isThisMoboDone ?
                        `Successfully scraped \"${moboTitle}\". Moving on...` :
                        `Scraping information for motherboard \"${moboTitle}\"...`
                    }</p>
                    <button onClick={abortScraping} className="form-control">Stop Scraping</button>
                </div>
                
                <div className="progress">
                    <div className="progress-bar" role="progressbar" style={{ width: `${_moboScrapeObj.moboScrapeTime / maxMoboScrapeTime * 100}%`, height: '35px' }} aria-valuenow={_moboScrapeObj.moboScrapeTime} aria-valuemin={0} aria-valuemax={maxMoboScrapeTime}></div>
                </div>
            </div>
        </>
    )
}

export default ScrapeMobo;