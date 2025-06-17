import { LoaderCircle } from "lucide-react"

export default function Loading() {
    return (
        <>
            <div className="container">
                <div className="box">
                    <div className="column is-narrow">
                        <LoaderCircle />
                    </div>
                </div>
            </div>
        </>
    )
}