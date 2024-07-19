import {Trash2} from "lucide-react"
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {DeletedHomework} from "@/components/deletedHomework-card"
import {Button} from "@/components/ui/button"


export function Bin({homeworks, setIsLoading}) {
    return(
        <>
            <div className="absolute top-[9rem] right-[10rem]">
                <Dialog>
                <DialogTrigger asChild>
                    <Button variant="trash"><Trash2 size={18}/></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                    <DialogTitle>Poubelle</DialogTitle>
                    <DialogDescription>
                        Vous trouverez tous les devoirs finis. Ils expirent après 15 jours.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-row flex-wrap max-h-[12rem] overflow-y-auto ">
                        {
                        homeworks.map((homework) => (
                            <div className="flex flex-row">
                            {
                                homework.done ? <DeletedHomework homework={homework} setIsLoading={setIsLoading}></DeletedHomework> : null
                            }
                            </div>
                        ))
                        }
                    </div>
                </DialogContent>
                </Dialog>
            </div>
        </>
    )
}