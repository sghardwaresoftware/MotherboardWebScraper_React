import { useRef, useState } from "react"
import type { SearchResEntry, ScrapeObj } from "./SearchScrapeInterface";

interface SearchMoboProps {
    setSearchResList: (searchResList:ScrapeObj) => void; 
    apiKey: string;
}

function SearchMobo({ setSearchResList, apiKey }: SearchMoboProps) {
    const moboSearchObj = {
        "searchRun": 0,
        "isSearching": false,
        "searchDone": false,
        "searchTerm": "",
        "searchResCount": 0
    };

    const moboSearchRef = useRef<HTMLInputElement>(null);
    const [_moboSearchObj, setMoboSearchObj] = useState(moboSearchObj);

    function handleFindMoboClick() {
        let searchTerm = moboSearchRef.current!.value.toLowerCase();
        if (searchTerm.includes("asus")) searchTerm = `${searchTerm} specifications site:asus.com`
        else if (searchTerm.includes("msi")) searchTerm = `${searchTerm} specifications site:msi.com`
        else if (searchTerm.includes("gigabyte")) searchTerm = `${searchTerm} specifications site:gigabyte.com`
        else if (searchTerm.includes("asrock")) searchTerm = `${searchTerm} specifications site:asrock.com`
        else { alert("Unknown brand or brand is not entered!"); return; }

        setMoboSearchObj(prevObj => ({
            ...prevObj, 
            searchRun: prevObj.searchRun + 1,
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
                ...prevObj, searchDone: true, searchTerm: "", searchResCount: searchResList.length
            }));

            setSearchResList({runNumber: _moboSearchObj.searchRun, moboUrlList: searchResList});

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
                    <button onClick={handleFindMoboClick} className="form-control">Find Motherboard</button>
                </div>
                <div style={{ display: `${_moboSearchObj.isSearching ? 'block' : 'none'}` }}>
                    <p>{
                         _moboSearchObj.searchDone ? 
                        `Found ${_moboSearchObj.searchResCount} result(s)!` : 
                        `Searching for \"${_moboSearchObj.searchTerm}\"...`
                    }</p>
                </div>
            </div>
            
        </>
    )
}

export default SearchMobo;