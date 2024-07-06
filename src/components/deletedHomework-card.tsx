import { useEffect } from "react";
import {Button} from "@/components/ui/button";
import supabase from '@/config/supabaseClient'

export function DeletedHomework({homework}) {
    useEffect(() => {
        const fifteenDaysAgo = new Date()
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15)

        if (homework.created_at < fifteenDaysAgo.toISOString()) {
            supabase
                .from('homeworks')
                .delete()
                .eq('created_at', homework.created_at)
                .then(() => {
                    console.log('Devoir supprimé');
                })
        }
    }, [])

    async function undoToggle() {
        const { error } = await supabase
            .from('homeworks')
            .update({ done: false })
            .eq('created_at', homework.created_at)
        error ? console.log(error) : null
    }

    return (
        <div className='w-[100px] bg-secondary rounded-lg mr-2 relative mb-2' >
            <div className="flex flex-col ml-3 font-medium text-foreground mb-2">
                <p className='whitespace-pre-wrap break-words mt-2 text-mg'>{homework.subject}</p>
            </div>
            <div className="flex justify-center items-center">
                <Button onClick={undoToggle} className="mb-3 p-[5px] pr-[20px] text-mg text-center font-normal text-primary-foreground">
                        <p className="pl-3">
                            Annuler
                        </p>
                </Button>
            </div>
        </div>
    )
}
