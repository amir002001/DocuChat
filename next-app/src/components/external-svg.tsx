import React from 'react'

export const ExternalSvg = ({ className }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
            className={className ?? ''}
        >
            <path
                fill="#000"
                fillRule="evenodd"
                d="M13.125 1.875H17.5a.625.625 0 01.625.625v4.375a.625.625 0 11-1.25 0V4.008L6.692 14.192a.625.625 0 01-.884-.884L15.992 3.125h-2.867a.625.625 0 110-1.25zm-8.75 3.75a1.25 1.25 0 00-1.25 1.25v8.75a1.25 1.25 0 001.25 1.25h8.75a1.25 1.25 0 001.25-1.25V8.75a.625.625 0 111.25 0v6.875a2.5 2.5 0 01-2.5 2.5h-8.75a2.5 2.5 0 01-2.5-2.5v-8.75a2.5 2.5 0 012.5-2.5h6.875a.625.625 0 110 1.25H4.375z"
                clipRule="evenodd"
            ></path>
        </svg>
    )
}
