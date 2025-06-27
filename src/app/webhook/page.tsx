'use client'
import React from "react"
import { useQuery } from "@tanstack/react-query"
import { Circle } from "lucide-react"


export default function Webhooks() {
    const webhook_simulation = async () => {
        const req = await fetch("api/webhook", {
            method: 'POST',
            body: JSON.stringify({
                'Greeting': 'Hello',
                'name': 'Mert'
            })
        })
        const data = await req.json();
        return data;
    }


    const {
        data,
        isPending,
        error,
    } = useQuery({
        queryKey: ["webhook"],
        queryFn: async () => webhook_simulation()
    });

    if (isPending) return (
        <div className="container">
            <div className="notification is-primary">
                <Circle />
                <h4 className='title is-4'>Loading ...</h4>
            </div>
        </div>)

    if (error) return 'An error has occurred: ' + error.message

    return (
        <h1>{data.g}</h1>
    )
}