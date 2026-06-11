import { useEffect, useRef, useState } from "react"
import type { MoboUrlEntry } from "./SearchScrapeInterface";

interface SearchMoboProps {
    apiKey: string;
    returnSearchStarted: () => void;
    returnMoboUrlList: (moboUrlList:MoboUrlEntry[]) => void;
}

function SearchMobo({ apiKey, returnSearchStarted, returnMoboUrlList }: SearchMoboProps) {
    const moboSearchTextboxRef = useRef<HTMLInputElement>(null);
    const searchStatus = useRef<string>("idle");
    const searchTerm = useRef<string>("");
    const moboUrlList = useRef<MoboUrlEntry[]>([])


    const postMoboSearchActionDelay = 1000; // milliseconds

    useEffect(() => {
        if (searchStatus.current === "searchStarted") searchSomething();
    });

    function handleFindMoboClick() {
        searchTerm.current = moboSearchTextboxRef.current!.value.toLowerCase();
        if (searchTerm.current.includes("asus")) searchTerm.current += " specifications site:asus.com"
        else if (searchTerm.current.includes("msi")) searchTerm.current += " specifications site:msi.com"
        else if (searchTerm.current.includes("gigabyte")) searchTerm.current += " specifications site:gigabyte.com"
        else if (searchTerm.current.includes("asrock")) searchTerm.current += " specifications site:asrock.com"
        else { alert("Unknown brand or brand is not entered!"); return; }

        searchStatus.current = "searchStarted";
        returnSearchStarted();
    }

    async function searchSomething() {
        const baseUrl = 'https://google.serper.dev/search';
        const params = new URLSearchParams({
            q: searchTerm.current,
            gl: 'sg',
            page: '1',
            apiKey: apiKey //ApiKeys.json
        });

        const finalUrl = `${baseUrl}?${params.toString()}`;
        try {
            const response = await fetch(finalUrl);
            const data = await response.json();
            console.log(data);
  
            moboUrlList.current = data['organic'].filter((entry:MoboUrlEntry) => isTechSpecPage(entry.link));
            console.log(moboUrlList.current);

            searchStatus.current = "searchCompleted";
            returnMoboUrlList(moboUrlList.current);
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
            return path.includes("index.asp") && path.includes("/mb/");

        return false;
    }

    let searchStatusText = "";
    if (searchStatus.current === "searchStarted") searchStatusText = `Searching for \"${moboSearchTextboxRef.current!.value}\"...`;
    else if (searchStatus.current === "searchCompleted") searchStatusText = `Found ${moboUrlList.current.length} result(s)!`

    return (
        <>
            <div className="border border-primary subContainer">
                <div className="input-group">
                    <label className="input-group-text col-2 text-wrap">Motherboard search: </label>
                    <input type="text" ref={moboSearchTextboxRef} className="form-control" />
                    <button 
                        onClick={handleFindMoboClick} 
                        className="btn btn-primary col-3"
                        disabled={false}
                    >Search Motherboard(s)</button>
                </div>
                {
                    searchStatus.current !== "idle" && (
                        <div className="mt-2">{searchStatusText}</div>
                    )
                }
                
            </div>
            
        </>
    )
}

export default SearchMobo;