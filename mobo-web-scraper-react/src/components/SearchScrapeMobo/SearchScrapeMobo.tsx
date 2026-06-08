import { useState } from "react"
import SearchMobo from "./SearchMobo";
import ScrapeMobo from "./ScrapeMobo";
import type { ScrapeObj } from "./SearchScrapeInterface";
import ApiKeys from "./ApiKeys.json"; //manually add in your own copy

function SearchScrapeMobo() {
    const [_scrapeObj, setScrapeObj] = useState<ScrapeObj>({runNumber: 0, moboUrlList: []});

    function copyToScrapeObj(scrapeObj:ScrapeObj) {
       setScrapeObj(scrapeObj)
    }

    return (
        <div className="container-md">
            <SearchMobo setSearchResList={copyToScrapeObj} apiKey={ApiKeys.serper}/>
            <ScrapeMobo scrapeObj={_scrapeObj} apiKey={ApiKeys.firecrawl}/>
        </div>
    )
}

export default SearchScrapeMobo