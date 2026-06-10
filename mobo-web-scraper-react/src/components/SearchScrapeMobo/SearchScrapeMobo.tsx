import { useState, useEffect } from "react"
import SearchMobo from "./SearchMobo";
import ScrapeMobo from "./ScrapeMobo";
import type { SearchResEntry } from "./SearchScrapeInterface";
import ApiKeys from "./ApiKeys.json"; //manually add in your own copy
import './SearchScrapeMobo.css'

function SearchScrapeMobo() {
    const [moboUrlList, setMoboUrlList] = useState<SearchResEntry[]>([]);
    const [isSearchRunning, setSearchRunning] = useState<boolean>(false);
    const [isScrapeRunning, setScrapeRunning] = useState<boolean>(false);
    const [operationCompleted, setOperationCompleted] = useState<boolean>(false);

    const resetOperationDelay = 5000 // milliseconds

    useEffect(() => {
        const restartOperationTimeout = setTimeout(() => {
            setOperationCompleted(false);
        }, resetOperationDelay);

        return () => clearTimeout(restartOperationTimeout);
    }, [ operationCompleted ]);

    return (
        <div className="container-md">
            <SearchMobo 
                apiKey={ApiKeys.serper} 
                beginSearch={ () => {
                    setSearchRunning(true);
                    setOperationCompleted(false);
                }}
                searchCompleted={ (moboUrlList) => {
                    setMoboUrlList(moboUrlList);
                    setSearchRunning(false);
                    moboUrlList.length != 0 ? setScrapeRunning(true) : setOperationCompleted(true);
                }}
                isSearchRunning={isSearchRunning}
                isScrapeRunning={isScrapeRunning}
                operationCompleted={operationCompleted}
            />
            {
                isScrapeRunning && !operationCompleted && (
                    <ScrapeMobo
                        apiKey={ApiKeys.firecrawl} 
                        moboUrlList={moboUrlList}
                        scrapeCompleted={ () => {
                            setScrapeRunning(false);
                            setOperationCompleted(true);
                        }}
                    />
                )
            }
            {
                operationCompleted && (
                    <div className="subContainer bg-success text-white">Search and scrape completed! Refreshing in a while...</div>
                )
            }
        </div>
    )
}

export default SearchScrapeMobo