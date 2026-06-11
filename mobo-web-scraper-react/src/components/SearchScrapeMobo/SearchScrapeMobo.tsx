import { useEffect, useRef, useState } from "react"
import SearchMobo from "./SearchMobo";
import ScrapeMobo from "./ScrapeMobo";
import type { MoboUrlEntry } from "./SearchScrapeInterface";
import ApiKeys from "./ApiKeys.json"; //manually add in your own copy
import './SearchScrapeMobo.css'

function SearchScrapeMobo() {
    const [progressStage, setProgressStage] = useState<string>("idle");
    const [successItemsCount, setSuccessItemsCount] = useState<number>(0);
    const moboUrlList = useRef<MoboUrlEntry[]>([]);
    const progressText = useRef<string>("");

    const resetOperationDelay = 5000 // milliseconds

    useEffect(() => {
        if (progressStage == "searchScrapeCompleted") {
            setTimeout(() => {
                setProgressStage("idle");
                setSuccessItemsCount(0);
            }, resetOperationDelay);
        }
    }, [ progressStage ]);

    function checkMoboUrlList(_moboUrlList:MoboUrlEntry[]) {
        if (_moboUrlList.length > 0) {
            moboUrlList.current = _moboUrlList;
            setProgressStage("scrapeStarted");
        }
        else setProgressStage("searchScrapeCompleted");
    }

    if (progressStage === "idle") progressText.current = "Doing nothing.";
    else if (progressStage === "searchStarted") progressText.current = "Searching for motherboard(s)...";
    else if (progressStage === "scrapeStarted") progressText.current = "Scraping motherboard(s) specfications...";
    else if (progressStage === "searchScrapeCompleted") 
        progressText.current = `Searching and scraping for ${successItemsCount} motherboard(s) are completed successfully! Refreshing in a while...`;

    return (
        <div className="container-md">
            <SearchMobo 
                apiKey={ApiKeys.serper} 
                returnSearchStarted={() => setProgressStage("searchStarted")}
                returnMoboUrlList={checkMoboUrlList}
            />
            { 
                progressStage == "scrapeStarted" && (
                    <ScrapeMobo
                        apiKey={ApiKeys.firecrawl}
                        moboUrlList={moboUrlList.current}
                        returnScrapeCompleted={ (successItemsCount:number) => {
                                setProgressStage("searchScrapeCompleted");
                                setSuccessItemsCount(successItemsCount);
                            }
                        }
                    />
                )
            }
            <div className="subContainer bg-dark text-white">{progressText.current}</div>
        </div>
    )
}

export default SearchScrapeMobo