import { ObjectId } from "bson";

export type games_data = {
    gameId:string,
    waste_of_time:number,
    nuh:number,
    good:number,
    must:number,
    visited:number,
    reviews:number,
    favorite:number,
    twitter_share:number,
    facebook_share:number
}

export type Review_Type = {
    _id?:ObjectId;
    gameId:string;
    userId:string;
    created_at:string;
    game_name:string;
    game_image:string;
    text:string;
    rank:string;
    likes:ObjectId[];
    dislikes:ObjectId[];
}

export type Favorite_Type = {
    _id?:ObjectId;
    userId:string;
    created_at:string;
    gameId:string;
    game_name:string;
    game_image:string;
}

export type Rank = {
    _id?:ObjectId;
    userId:string;
    gameId:string;
    created_at:string;
    value:string;
}

export type full_user = {
    _id:ObjectId;
    username:string;
    email:string;
    password:string
    created_at:string;
    favorite:ObjectId[];
    reviews:ObjectId[];
    ranks:ObjectId[];
    visited_games:ObjectId[];
}

export type Client_User = {
    _id:ObjectId;
    username:string;
    email:string;
}