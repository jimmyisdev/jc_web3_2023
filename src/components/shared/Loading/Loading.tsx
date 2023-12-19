import React from 'react'

export default function Loading({ loadingMsg = "Loading..." }: { loadingMsg?: string }) {
    return (
        <div>{loadingMsg}</div>
    )
}
