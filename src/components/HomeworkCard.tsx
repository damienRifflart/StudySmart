import React from 'react'

export function HomeworkCard({ homework }) {
    return (
        <div>
            <h3>{homework.subject}</h3>
            <p>{homework.description}</p>
        </div>
    )
}