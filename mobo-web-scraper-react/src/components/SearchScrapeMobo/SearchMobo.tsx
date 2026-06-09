import { useEffect, useRef, useState } from "react"
import type { SearchResEntry } from "./SearchScrapeInterface";

interface SearchMoboProps {
    apiKey: string;
    beginSearch: () => void;
    searchCompleted: (moboUrlList:SearchResEntry[]) => void;
    isSearchRunning: boolean;
    isScrapeRunning: boolean;
    operationCompleted: boolean;
}

function SearchMobo({ apiKey, beginSearch, searchCompleted, isSearchRunning, isScrapeRunning, operationCompleted }: SearchMoboProps) {
    const moboSearchObj = {
        "searchDone": false,
        "searchTerm": "",
        "searchResList": [] as SearchResEntry[]
    };

    const moboSearchRef = useRef<HTMLInputElement>(null);
    const beginSearchFlagRef = useRef<boolean>(false);
    const operationAlrCompletedFlagRef = useRef<boolean>(false);
    const [_moboSearchObj, setMoboSearchObj] = useState(moboSearchObj);

    const postMoboSearchActionDelay = 1000; // milliseconds

    useEffect(() => {
        if (_moboSearchObj.searchTerm !== "" && !beginSearchFlagRef.current) {
            beginSearchFlagRef.current = true;
            operationAlrCompletedFlagRef.current = false;
            beginSearch();
        }

        if (operationCompleted && !operationAlrCompletedFlagRef.current) {
            console.log("esgtsegt");
            operationAlrCompletedFlagRef.current = true;

            setMoboSearchObj(prevObj => ({
                ...prevObj, 
                searchDone: false, searchResList: []
            }));
        }

        if (isSearchRunning && !_moboSearchObj.searchDone) { searchSomething(); }

        if (_moboSearchObj.searchDone) {
            const postMoboSearchActionTimeout = setTimeout(() => {
                beginSearchFlagRef.current = false;
                searchCompleted(_moboSearchObj.searchResList);
            }, postMoboSearchActionDelay);

            return () => clearTimeout(postMoboSearchActionTimeout);
        }
    }, [isSearchRunning, operationCompleted, _moboSearchObj]);

    function handleFindMoboClick() {
        let searchTerm = moboSearchRef.current!.value.toLowerCase();
        if (searchTerm.includes("asus")) searchTerm = `${searchTerm} specifications site:asus.com`
        else if (searchTerm.includes("msi")) searchTerm = `${searchTerm} specifications site:msi.com`
        else if (searchTerm.includes("gigabyte")) searchTerm = `${searchTerm} specifications site:gigabyte.com`
        else if (searchTerm.includes("asrock")) searchTerm = `${searchTerm} specifications site:asrock.com`
        else { alert("Unknown brand or brand is not entered!"); return; }

        setMoboSearchObj(prevObj => ({
            ...prevObj, 
            searchTerm: searchTerm
        }));
    }

    async function searchSomething() {
        const baseUrl = 'https://google.serper.dev/search';
        const params = new URLSearchParams({
            q: _moboSearchObj.searchTerm,
            gl: 'sg',
            page: '1',
            apiKey: apiKey //ApiKeys.json
        });

        const finalUrl = `${baseUrl}?${params.toString()}`;
        try {
            const response = await fetch(finalUrl);
            const data = await response.json();
            console.log(data);
  
            const searchResList:SearchResEntry[] = data['organic'].filter((entry:SearchResEntry) => isTechSpecPage(entry.link));
            console.log(searchResList);

            setMoboSearchObj(prevObj => ({
                ...prevObj, 
                searchDone: true, 
                searchTerm: "", 
                searchResList: searchResList
            }));
        } catch (error) {
            console.error(error);
        }
    }

    function isTechSpecPage(url:string) {
        const parsed = new URL(url);
        const domain = parsed.hostname.toLowerCase();
        const path = parsed.pathname.replace(/\/$/, "").toLowerCase();
        //const fragment = parsed.hash.toLowerCase(); // e.g. "#specification"

        if (domain.includes("asus.com"))
            return (path.endsWith("techspec") || path.endsWith("spec"));
        if (domain.includes("msi.com"))
            return path.endsWith("specification");
        if (domain.includes("gigabyte.com"))
            return path.endsWith("/sp");
        if (domain.includes("asrock.com"))
            return path.includes("index.asp");

        return false;
    }

    return (
        <>
            <div className="border border-primary">
                <div className="input-group">
                    <label className="input-group-text">Motherboard search: </label>
                    <input type="text" ref={moboSearchRef} className="form-control" />
                    <button 
                        onClick={handleFindMoboClick} 
                        className="form-control"
                        disabled={isSearchRunning || isScrapeRunning ? true : false}
                    >Search Motherboard(s)</button>
                </div>
                <div style={{ display: `${isSearchRunning ? 'block' : 'none'}` }}>
                    <p>{
                         _moboSearchObj.searchDone ? 
                        `Found ${_moboSearchObj.searchResList.length} result(s)!` : 
                        `Searching for \"${_moboSearchObj.searchTerm}\"...`
                    }</p>
                </div>
            </div>
            
        </>
    )
}

export default SearchMobo;