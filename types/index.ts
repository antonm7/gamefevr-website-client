export type Genre = {
    id: number;
    name: string;
}

export type Platform = {
    id: number;
    name: string;
}

export type Tag = {
    id:number;
    name:string;
}

export type ScreenShot = {
    id:number;
    image:string;
}

export type Store = {
    id:number;
    store: {
        domain:string,
        id:number,
        name:string,
    }
}

export type ShortGame = {
    id: number;
    name: string;
    genres: Genre[];
    platforms: Platform[];
    released:string;
    slug:string;
    tags:Tag[];
    short_screenshots:ScreenShot[];
    stores:Store[];
    background_image:string;
}