import { POST } from "../api/access_token/route"
import { v4 as uuidv4 } from 'uuid';

export async function getAccessToken() {
    const res = await POST()
    const data = await res.json()
    const access_token = data
    return access_token
}

export function generateUUID(): string {
    return uuidv4()
}