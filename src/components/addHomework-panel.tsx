import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Input} from "@/components/ui/input"
import supabase from '@/config/supabaseClient'
import {format} from "date-fns"
import {Calendar as CalendarIcon} from "lucide-react"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {useEffect, useState} from 'react'

export function AddHomework() {
    const [subject, setSubject] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [time, setTime] = useState<string>('');
    const [deadline, setDeadline] = useState<string>('');
    const [subjects, setSubjects] = useState<string[]>([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            const { data, error } = await supabase.from('subjects').select();
    
            if (error) {
                console.error(error);
            }
    
            // Map the fetched data to an array of subjects and add a default subject
            if (data) {
                const userId = (await supabase.auth.getUser()).data.user?.id;
                const filteredSubjects = data.filter(subject => subject.userid === userId);
                const subjects = [...filteredSubjects.map(({ subject }: { subject: string }) => subject)];
                setSubjects(subjects);
            }
        };
    
        fetchSubjects();
    }, [subjects]);

    async function addNewHomework() {
        const currentDate = new Date();
        const deadlineDate = deadline ? new Date(deadline) : null;
        const deadlineDifferenceInDays = deadlineDate ? Math.ceil((deadlineDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)) : null;

        const newHomework = {
            created_at: currentDate,
            subject: subject,
            description: description.toString(),
            time: time,
            deadline: deadlineDifferenceInDays,
            userid: (await supabase.auth.getUser()).data.user?.id,
        };

        const { error } = await supabase
            .from('homeworks')
            .insert(newHomework)
            .select();

        if (error) {
            console.error(`Error while inserting homework: ${error}`);
        }
    }

    async function addNewSubject() {
        const { data } = await supabase.from('subjects').select();
        let ids: number[] = [];
        if (data) {
            ids = data?.map((subject) => subject.id);
        }

        const maxId = Math.max(...ids) 

        const newSubject = {
            id: maxId+1,
            subject: subject,
            userid: (await supabase.auth.getUser()).data.user?.id
        };

        const { error } = await supabase
            .from('subjects')
            .insert(newSubject)
            .select();

        if (error) {
            console.error(`Error while inserting subject: ${error}`);
        }
    }

    return(
        <Card className="bg-secondary">
            <CardHeader>
            <CardTitle>Ajouter un devoir</CardTitle>
            </CardHeader>
            <CardContent>
            <Select onValueChange={setSubject}>
                <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Choisis une matière" />
                </SelectTrigger>
                <SelectContent>
                <SelectGroup>
                    <div className="text-mg relative flex flex-row mb-2">
                        <Input 
                            className="h-[2rem]"
                            placeholder="Nouvelle matière" 
                            value={subject} 
                            onChange={(e) => setSubject(e.target.value)}
                        />
                        <Button onClick={addNewSubject} className="w-[4rem] ml-2 h-[2rem] text-accent-foreground">Ajouter</Button>
                    </div>
                    {
                        subjects.length !== 0 && subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))
                    }

                </SelectGroup>
                </SelectContent>
            </Select>
            <Input className="mt-4" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={`w-[280px] justify-start text-left font-normal mt-4 ${!deadline && "text-muted-foreground"}`}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : <span>Choisis la date limite</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={deadline ? new Date(deadline) : undefined}
                    onSelect={(date: Date | undefined) => setDeadline(date ? format(date, "yyyy-MM-dd") : "")}
                    initialFocus
                />
                </PopoverContent>
            </Popover>
            <Input className="mt-4" placeholder="Temps requis (minutes)" type="number" value={time} onChange={(e) => setTime(e.target.value)} />
            </CardContent>
            <CardFooter>
            <Button className="text-primary-foreground text-xl" disabled={!subject || !deadline || !time || !description} onClick={addNewHomework}>Ajouter</Button>
            </CardFooter>
        </Card>
    )
}