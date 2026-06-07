import { useState } from "react"
import SearchMobo from "./SearchMobo";
import ScrapeMobo from "./ScrapeMobo";
import type { SearchResEntry } from "./SearchResEntry";
import ApiKeys from "./ApiKeys.json"; //manually add in your own copy

function SearchScrapeMobo() {
    const [_moboUrlList, setMoboUrlList] = useState<SearchResEntry[]>([]);

    function copyToMoboUrlList(searchResList:SearchResEntry[]) {
        setMoboUrlList(searchResList);
    }

    return (
        <div className="container-md">
            <SearchMobo setSearchResList={copyToMoboUrlList} apiKey={ApiKeys.serper}/>
            <ScrapeMobo moboUrlList={_moboUrlList} apiKey={ApiKeys.firecrawl}/>
        </div>
    )
}

export default SearchScrapeMobo