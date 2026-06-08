export interface SearchResEntry {
    title: string;
    link: string;
    snippet: string;
}

export interface ScrapeObj {
    runNumber: number,
    moboUrlList: SearchResEntry[]
}