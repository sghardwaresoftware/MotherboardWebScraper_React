import { useEffect, useRef, useState } from "react"
import type { SearchResEntry } from "./SearchScrapeInterface";

interface SearchMoboProps {
    apiKey: string;
    returnMoboUrlList: (searchResUrls:SearchResEntry[]) => void,
    disableSearchBtn: boolean
}

function SearchMobo({ apiKey, returnMoboUrlList, disableSearchBtn }: SearchMoboProps) {
    const moboSearchObj = {
        "isSearching": false,
        "searchDone": false,
        "searchTerm": "",
        "searchResList": [] as SearchResEntry[]
    };

    const moboSearchRef = useRef<HTMLInputElement>(null);
    const [_moboSearchObj, setMoboSearchObj] = useState(moboSearchObj);

    useEffect(() => {
        if (_moboSearchObj.searchDone) { returnMoboUrlList(_moboSearchObj.searchResList); }
    }, [_moboSearchObj ]);

    function handleFindMoboClick() {
        let searchTerm = moboSearchRef.current!.value.toLowerCase();
        if (searchTerm.includes("asus")) searchTerm = `${searchTerm} specifications site:asus.com`
        else if (searchTerm.includes("msi")) searchTerm = `${searchTerm} specifications site:msi.com`
        else if (searchTerm.includes("gigabyte")) searchTerm = `${searchTerm} specifications site:gigabyte.com`
        else if (searchTerm.includes("asrock")) searchTerm = `${searchTerm} specifications site:asrock.com`
        else { alert("Unknown brand or brand is not entered!"); return; }

        setMoboSearchObj(prevObj => ({
            ...prevObj, 
            isSearching: true, 
            searchDone: false, 
            searchResCount: 0, 
            searchTerm: moboSearchRef.current!.value
        }));
        searchSomething(searchTerm);
    }

    async function searchSomething(searchTerm:string) {
        const baseUrl = 'https://google.serper.dev/search';
        const params = new URLSearchParams({
            q: searchTerm,
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
                ...prevObj, searchDone: true, searchTerm: "", searchResList: searchResList
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
                    <button onClick={handleFindMoboClick} className="form-control" disabled={disableSearchBtn}>Search Motherboard(s)</button>
                </div>
                <div style={{ display: `${_moboSearchObj.isSearching ? 'block' : 'none'}` }}>
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