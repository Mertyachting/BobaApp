import { POST as accessTokenAPI } from "../api/access_token/route"
import { POST as sdkTokenAPI } from "../api/sdktoken/route";
import { v4 as uuidv4 } from 'uuid';

export async function getAccessToken() {
    const res = await accessTokenAPI()
    const data = await res.json()
    const access_token = data
    return access_token
}

export function generateUUID(): string {
    return uuidv4()
}

export function encodeAuthorization() {
    return btoa(`${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.SECRET_KEY}`);
}

export function encodeAuthorizationUK() {
    return btoa(`${process.env.NEXT_PUBLIC_CLIENT_ID_UK}:${process.env.SECRET_KEY_UK}`);
}

export async function getSDKToken() {
    const res = await sdkTokenAPI();
    const data = await res.json()
    const sdkToken = data;
    console.log('THE SDK TOKEN IS ' + sdkToken)
    return sdkToken
}