import { useState, useEffect } from "react";
import type { SearchResEntry } from "./SearchResEntry";

interface ScrapeMoboProps {
    moboUrlList: SearchResEntry[];
    apiKey: string;
}

function ScrapeMobo({ moboUrlList, apiKey }: ScrapeMoboProps) {
    const moboScrapeObj = {
        "moboIndex": 0,
        "isThisMoboDone": false,
        "scrapeAllDone": false,
        "scrapeSuccessfulCount": 0
    }

    const [_moboScrapeObj, setMoboScrapeObJ] = useState(moboScrapeObj);  

    useEffect(() => {
        if (moboUrlList.length === 0) return;

        if (!_moboScrapeObj.isThisMoboDone) {
            const moboUrl = moboUrlList[_moboScrapeObj.moboIndex].link;

            const doWorkTimeout = setTimeout(() => {
                setMoboScrapeObJ(prevObj => ({ ...prevObj, 
                    isThisMoboDone: true, scrapeSuccessfulCount: prevObj.scrapeSuccessfulCount + 1,
                }));
            }, 2500);

            return () => clearTimeout(doWorkTimeout);
        }
        else {
            if (_moboScrapeObj.moboIndex >= moboUrlList.length - 1) {
                setMoboScrapeObJ(prevObj => ({ ...prevObj, 
                    scrapeAllDone: true
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
    }, [_moboScrapeObj.isThisMoboDone, _moboScrapeObj.moboIndex, moboUrlList.length]);

    if (moboUrlList.length > 0) {
        const moboTitle = moboUrlList[_moboScrapeObj.moboIndex].title;
        return (
            <>
                <div>
                    <p>{ 
                        _moboScrapeObj.scrapeAllDone ?
                        `All done! Successfully scraped ${_moboScrapeObj.scrapeSuccessfulCount} motherboard URL(s).` :
                        _moboScrapeObj.isThisMoboDone ?
                        `Successfully scraped \"${moboTitle}\". Moving on...` :
                        `Scraping information for motherboard \"${moboTitle}\"...`
                    }</p>
                </div>
            </>
        )
    }
    else { 
        return ( <></> )
    }
    
}

export default ScrapeMobo;