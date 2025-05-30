export const dynamic = 'force-static'



var auth = '';

function EncodeAuthorization(a: String, b: String) {
    auth = btoa(`${a}:${b}`);
}


export async function POST() {
    let url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token'

    // @ts-ignore
    EncodeAuthorization(process.env.NEXT_PUBLIC_CLIENT_ID, process.env.SECRET_KEY);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${auth}`,
                //'PayPal-Auth-Assertion': 'eyJhbGciOiJub25lIn0.eyJpc3MiOiJBWTN6Vkdndkl6eWtJVkR3X0c5WkROb0htaURiTVlZQzVtMXFkclRfNV84WnRBVkZOdE5OYnY0WEtmWFJHVkVtU1BTcGEzMHVHTTFBbmZrTyIsInBheWVyX2lkIjoiNEVVUFVVV0JVTFpLUyJ9.'
            },
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
                //'response_type': 'client_token',
                //'intent': 'sdk_init'
            })
        })
        const data = await res.json();
        const access_token = data.access_token;

        // Push the access_token into the database.
        // Inserts into the "credentials" table and the "access_token" column.
        /* const connection = await pool.getConnection();
        const [result] = await connection.query(
            'INSERT INTO credentials (accesstoken) VALUES (?)',
            [access_token] 
        );
        */

        // console.log("Access token inserted successfully, insert ID:", result);

        return Response.json(access_token);
    }
    catch (e) {
        return Response.json({ e });
    }
};