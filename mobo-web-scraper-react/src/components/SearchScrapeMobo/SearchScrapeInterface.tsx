export interface SearchResEntry {
    title: string;
    link: string;
    snippet: string;
}

export interface SearchScrapeObj {
    moboUrlList: SearchResEntry[],
    newScrapeJob: boolean
}