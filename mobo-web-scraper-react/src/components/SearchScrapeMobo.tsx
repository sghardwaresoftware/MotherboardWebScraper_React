import { useRef, useState } from "react"

function SearchScrapeMobo() {
    let moboSearchObj = {
        "isSearching": false,
        "isScraping": false,
        "searchTerm": ""
    };

    const moboSearchRef = useRef<HTMLInputElement>(null);
    const [_moboSearchObj, setMoboSearchObj] = useState(moboSearchObj);

    function handleFindMoboClick() {
        moboSearchObj.isSearching = true;
        moboSearchObj.searchTerm = moboSearchRef.current!.value;
        setMoboSearchObj(moboSearchObj);
    }

    return (
        <div className="container-md border border-primary">
            <div className="input-group">
                <label className="input-group-text">Motherboard search: </label>
                <input type="text" ref={moboSearchRef} className="form-control" />
                <button onClick={handleFindMoboClick} className="form-control">Find Motherboard</button>
            </div>
            <div style={{ display: `${_moboSearchObj.isSearching ? 'block' : 'none'}` }}>
                <p>{`Search term is \"${_moboSearchObj.searchTerm}\".`}</p>
            </div>
        </div>
    )
}

export default SearchScrapeMobo