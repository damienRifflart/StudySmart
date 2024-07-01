import React from 'react'
import { Button } from '@/components/ui/button'
import supabase from '@/config/supabaseClient'
export function HomeworkCard({ homework }) {

    async function doneToggleBtn() {
        const { error } = await supabase
            .from('homeworks')
            .update({ done: true })
            .eq('created_at', homework.created_at)
        error ? console.log(error) : null
    }

    return (
        <>
        {!homework.done ? (
            <div className='w-[280px] bg-secondary rounded-lg mr-3 mb-3 relative' >
                <div className="flex flex-col m-3 text-xl font-medium text-foreground">
                    <p className='whitespace-pre-wrap break-words mt-2'>{homework.subject}</p>
                    <p className='whitespace-pre-wrap break-words font-light'>{homework.description}</p>
                    <div className="flex flex-row items-center mt-4 mb-2 font-light">
                        <svg width="23" height="23" className="fill-foreground" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.50009 0.877014C3.84241 0.877014 0.877258 3.84216 0.877258 7.49984C0.877258 11.1575 3.8424 14.1227 7.50009 14.1227C11.1578 14.1227 14.1229 11.1575 14.1229 7.49984C14.1229 3.84216 11.1577 0.877014 7.50009 0.877014ZM1.82726 7.49984C1.82726 4.36683 4.36708 1.82701 7.50009 1.82701C10.6331 1.82701 13.1729 4.36683 13.1729 7.49984C13.1729 10.6328 10.6331 13.1727 7.50009 13.1727C4.36708 13.1727 1.82726 10.6328 1.82726 7.49984ZM8 4.50001C8 4.22387 7.77614 4.00001 7.5 4.00001C7.22386 4.00001 7 4.22387 7 4.50001V7.50001C7 7.63262 7.05268 7.7598 7.14645 7.85357L9.14645 9.85357C9.34171 10.0488 9.65829 10.0488 9.85355 9.85357C10.0488 9.65831 10.0488 9.34172 9.85355 9.14646L8 7.29291V4.50001Z"></path></svg>
                        <p className='ml-2'>{homework.time}mins</p>
                        <p className='absolute bottom-22 right-3'>{homework.deadline}j</p>
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <Button onClick={doneToggleBtn} className="mb-3 pr-[2rem] text-xl font-normal text-primary-foreground">
                        <p className='pl-4'>Déclarer comme fait</p>
                    </Button>
                </div>
            </div>
        ) : (
            null
        )}
        </>
    )
}