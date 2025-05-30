
'use client'
async function GenerateOnboardingLink() {
    const onboardingLink = await fetch('/partnerreferral', {
        method: "POST",
        mode: "same-origin"
    })
    const data = await onboardingLink.json()
    return window.open(data.data.links[1].href);

}

export default function onboarding() {
    return (
        <>
            <button className="button is-black" onClick={GenerateOnboardingLink}>
                Onboard with PayPal
            </button>
        </>
    )
}