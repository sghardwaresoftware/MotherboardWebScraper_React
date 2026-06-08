import { useState } from "react"
import SearchMobo from "./SearchMobo";
import ScrapeMobo from "./ScrapeMobo";
import type { SearchResEntry, SearchScrapeObj } from "./SearchScrapeInterface";
import ApiKeys from "./ApiKeys.json"; //manually add in your own copy

function SearchScrapeMobo() {
    const [_SearchScrapeObj, setSearchScrapeObj] = useState<SearchScrapeObj>({moboUrlList: [], prevScrapeJobDone: false, newScrapeJob: false});

    function setMoboUrlList(searchResUrls:SearchResEntry[]) {
       setSearchScrapeObj(prevObj => ({
            ...prevObj, moboUrlList: searchResUrls, prevScrapeJobDone:false, newScrapeJob: true
       }));
    }

    function noNewScrapeJob() {
        setSearchScrapeObj(prevObj => ({
            ...prevObj, moboUrlList: [], prevScrapeJobDone: true, newScrapeJob: false
       }));
    }

    return (
        <div className="container-md">
            <SearchMobo 
                apiKey={ApiKeys.serper} 
                returnMoboUrlList={setMoboUrlList} 
                disableSearchBtn={_SearchScrapeObj.newScrapeJob}
                resetSearch={_SearchScrapeObj.prevScrapeJobDone && !_SearchScrapeObj.newScrapeJob}
            />
            <ScrapeMobo 
                apiKey={ApiKeys.firecrawl} 
                moboUrlList={_SearchScrapeObj.moboUrlList} 
                newScrapeJob={_SearchScrapeObj.newScrapeJob} 
                scrapeJobIsDone={noNewScrapeJob} 
            />
        </div>
    )
}

export default SearchScrapeMobo