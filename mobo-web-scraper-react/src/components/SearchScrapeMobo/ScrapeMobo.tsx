import { useState, useEffect, useRef } from "react";
import type { ScrapeObj } from "./SearchScrapeInterface";

interface ScrapeMoboProps {
    scrapeObj: ScrapeObj;
    apiKey: string;
}

function ScrapeMobo({ scrapeObj, apiKey }: ScrapeMoboProps) {
    const moboScrapeObj = {
        "runNumber": 0,
        "moboIndex": 0,
        "moboScrapeTime": 0,
        "isThisMoboDone": false,
        "scrapeAborted": false,
        "scrapeAllDone": false,
        "scrapeSuccessfulCount": 0
    }

    const [_moboScrapeObj, setMoboScrapeObJ] = useState(moboScrapeObj);  
    const maxMoboScrapeTime = 10;

    if (_moboScrapeObj.runNumber !== scrapeObj.runNumber) {
        setMoboScrapeObJ(prevObj => ({ ...prevObj, 
            runNumber: scrapeObj.runNumber, scrapeAborted: false, scrapeAllDone: false, scrapeSuccessfulCount: 0
        }));
    }

    useEffect(() => {
        if (scrapeObj.moboUrlList.length === 0 || _moboScrapeObj.scrapeAborted || _moboScrapeObj.scrapeAllDone) return;

        if (!_moboScrapeObj.isThisMoboDone) {
            const moboUrl = scrapeObj.moboUrlList[_moboScrapeObj.moboIndex].link;

            if (_moboScrapeObj.moboScrapeTime == maxMoboScrapeTime) {
                setMoboScrapeObJ(prevObj => ({ ...prevObj, 
                    isThisMoboDone: true, scrapeSuccessfulCount: prevObj.scrapeSuccessfulCount + 1, moboScrapeTime: 0
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
            if (_moboScrapeObj.moboIndex >= scrapeObj.moboUrlList.length - 1) {
                setMoboScrapeObJ(prevObj => ({ ...prevObj, 
                    scrapeAllDone: true, moboIndex: 0, isThisMoboDone: false
                }));

                return;
            }

            const proceedNxtMoboTimeout = setTimeout(() => {
                setMoboScrapeObJ(prevObj => ({ ...prevObj, 
                    moboIndex: prevObj.moboIndex + 1, isThisMoboDone: false
                }));
            }, 1500);

            return () => clearTimeout(proceedNxtMoboTimeout);
        }
    }, [ scrapeObj.moboUrlList, _moboScrapeObj ]);

    function abortScraping() {
        setMoboScrapeObJ(prevObj => ({ ...prevObj, 
            scrapeAborted: true, moboScrapeTime: 0
        }));
    }

    if (scrapeObj.moboUrlList.length > 0) {
        const moboTitle = scrapeObj.moboUrlList[_moboScrapeObj.moboIndex].title;
        return (
            <>
                <div>
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
    else { 
        return ( <> </> )
    }
    
}

export default ScrapeMobo;