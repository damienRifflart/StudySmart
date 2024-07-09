import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {useState, useEffect} from "react"
import {Button} from "@/components/ui/button"
import {Trophy} from 'lucide-react';
import supabase from '@/config/supabaseClient'


export function LeaderBoard() {
    const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false)
    const [leaderboardData, setLeaderboardData] = useState<any[]>([])

    function f(x) {
        return 0.001 * x * x + 0.85 * x;
    }

    async function fetchLeaderboard() {
        const { data, error } = await supabase.from('homeworks').select('*')

        if (error) {
            console.error(error);
            return;
        }

        const doneHomeworks = data?.filter((homework) => homework.done)
        const userId = (await supabase.auth.getUser()).data.user?.id;
        const leaderboardTable = doneHomeworks.reduce((leaderboard, homework) => {
            const existingUser = leaderboard.find(user => user.userId === homework.userid);
            const pointsToAdd = Math.round(f(homework.time))
            
            if (existingUser) {
                existingUser.points += pointsToAdd;
            } else {
                leaderboard.push({ userId: homework.userid, points: pointsToAdd, user: userId === homework.userid ? true : false });
            }

            return leaderboard
        }, []);
        setLeaderboardData(leaderboardTable);
    }

    useEffect(() => {
        fetchLeaderboard();

        supabase
        .channel('homeworks2-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'homeworks',
          },
          (_payload) => {
            fetchLeaderboard();
          }
        )
        .subscribe();
    }, [])

    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setShowLeaderboard(!showLeaderboard)}><Trophy /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xlv text-xl">
                <DialogHeader>
                        <DialogTitle className="text-xl">Classement</DialogTitle>
                        <DialogDescription  className="text-lg">
                            Voici le classement des utilisateurs ayant travaillé le plus.
                        </DialogDescription>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Place</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/*
                                    sort method: sort the array in the descending order
                                    a: (id, points)
                                    b: (id, points)
                                    if b.points - a.points < 0 , a > b, so a comes before b
                                    if b.points - a.points > 0, b > a, so b comes before a
                                */}
                                {leaderboardData.sort((a, b) => b.points - a.points).map((entry, index) => (
                                    <>
                                        <tr key={entry.id}>
                                            <td>{index + 1}</td>
                                            <td>{entry.points}</td>
                                            <td>{entry.user ? 'vous' : null}</td>
                                        </tr>
                                    </>
                                ))}
                            </tbody>
                        </table>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}