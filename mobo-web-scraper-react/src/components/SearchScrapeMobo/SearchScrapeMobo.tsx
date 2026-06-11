import { useRef, useState, useEffect } from "react"
import SearchMobo from "./SearchMobo";
import ScrapeMobo from "./ScrapeMobo";
import type { MoboUrlEntry } from "./SearchScrapeInterface";
import ApiKeys from "./ApiKeys.json"; //manually add in your own copy
import './SearchScrapeMobo.css'

function SearchScrapeMobo() {
    const [progressStage, setProgressStage] = useState<string>("idle");
    const moboUrlList = useRef<MoboUrlEntry[]>([]);
    const progressText = useRef<string>("");

    const resetOperationDelay = 5000 // milliseconds

    function checkMoboUrlList(_moboUrlList:MoboUrlEntry[]) {
        if (_moboUrlList.length == 0) setProgressStage("operationCompleted");
        else {
            moboUrlList.current = _moboUrlList;
            setProgressStage("scrapeStarted");
        }
    }

    if (progressStage === "idle") progressText.current = "Doing nothing.";
    else if (progressStage === "searchStarted") progressText.current = "Searching for motherboard(s)...";
    else if (progressStage === "scrapeStarted") progressText.current = "Scraping motherboard(s) specfications...";
    else if (progressStage === "operationCompleted") progressText.current = "Operation completed! Refreshing in a while...";

    return (
        <div className="container-md">
            <SearchMobo 
                apiKey={ApiKeys.serper} 
                returnSearchStarted={() => setProgressStage("searchStarted")}
                returnMoboUrlList={checkMoboUrlList}
            />
            { /*
                progressStage == "scrapeStarted" && (
                    <ScrapeMobo
                        apiKey={ApiKeys.firecrawl} 
                        
                    />
                )
                */
            }
            <div className="subContainer bg-dark text-white">{progressText.current}</div>
        </div>
    )
}

export default SearchScrapeMobo