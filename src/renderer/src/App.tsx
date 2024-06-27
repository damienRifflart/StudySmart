import {ModeToggle} from "@/components/mode-toggle"
import {HomeworkCard} from "@/components/HomeworkCard"
import {Button} from "@/components/ui/button"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {AddHomework} from "@/components/add-homework"
import supabase from '@/config/supabaseClient'
import {useEffect, useState} from 'react'

function App(): JSX.Element {
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [homeworks, setHomeworks] = useState<any[] | null>(null)
  const [workTimeLeft, setWorkTimeLeft] = useState<Number>(Number)
  const [addHomeworkCard, setAddHomeworkCard] = useState<Boolean>(Boolean)

  useEffect(() => {
    const fetchHomeworks = async () => {
      const { data, error } = await supabase
        .from('homeworks')
        .select()
      
        if (error) {
          setFetchError('Could not fetch the homeworks')
          setHomeworks(null)
          setFetchError(error.toString())
          console.log(error)
        }

        if (data) {
          setHomeworks(data);
          const workTimeLeft = data.reduce((total, homework) => {
            return total + parseInt(homework.time, 10);
          }, 0);
          setWorkTimeLeft(workTimeLeft)
          setFetchError(null);
        }
    }
    fetchHomeworks()
  }, [])

  const showHomeworkCard = (aimedSubject: string) => {
    return (
      <>
        {fetchError && (<p>{fetchError}</p>)}
        {homeworks && (
          <>
            {homeworks.filter(homework => homework.subject === aimedSubject).length === 0 && (
              <p className="text-2xl">Il n'y a pas de devoirs pour la matière {aimedSubject}.</p>
            )}
            <div className="flex flex-row flex-wrap">
              {homeworks.map(homework => (
                homework.subject === aimedSubject ? (
                  <HomeworkCard key={homework.id} homework={homework}></HomeworkCard>
                ) : null
              ))}
            </div>
          </>
        )}
      </>
    );
  };
  
  const date = new Date();
  const listMonth = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ];
  const day = date.getDate();
  const month = listMonth[date.getMonth()];
  const year = date.getFullYear();
  const formattedDate  = `${day} ${month} ${year}`;

  function addHomework() {
    setAddHomeworkCard(!addHomeworkCard)
  }

  return (
    <>
    <div className="flex flex-col">
      <div className="top-5 left-5 relative">
          <div className="text-4xl font-semibold w-screen">
            <div className="absolute">
              <ModeToggle></ModeToggle>
            </div>
            <div className="ml-[6rem] flex flex-col">
              <h1>Bonjour, <span className='bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text'>Damien</span></h1>
              <h1>On est le <span>{formattedDate}</span></h1>
            </div>
          </div>
        </div>

        <div className="relative left-[7rem] top-20">
          <Tabs defaultValue="Tout" className="w-[70rem]">
            <TabsList>
              <TabsTrigger value="Tout">Tout</TabsTrigger>
              <TabsTrigger value="Maths">Maths</TabsTrigger>
              <TabsTrigger value="Français">Français</TabsTrigger>
              <TabsTrigger value="Physique">Physique</TabsTrigger>
              <TabsTrigger value="Histoire">Histoire</TabsTrigger>
            </TabsList>
            <TabsContent value="Tout">
              <div className="w-full max-w-[59rem] relative flex flex-col">
                <p className="text-2xl mb-3 mt-2">Tous les devoirs:</p>
                  {fetchError && <p>{fetchError}</p>}
                  {homeworks && (
                    <div className="flex flex-row flex-wrap">
                      {homeworks.map(homework => (
                        <HomeworkCard key={homework.id} homework={homework}></HomeworkCard>
                      ))}
                    </div>
                  )}
                  <div className="absolute right-4 bottom-0">
                    <Button onClick={addHomework} className="text-accent-foreground text-xl font-normal">
                      Ajouter un devoir
                    </Button>
                  </div>
                  <p className="text-2xl">
                    Il te reste encore <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">{workTimeLeft.toString()}</span> minutes de travail.
                  </p>
              </div>
              <div className={`${addHomeworkCard ? 'hidden' : 'absolute right-[13rem] top-[5.5rem]'}`}>
                  <AddHomework></AddHomework>
              </div>
            </TabsContent>


            <TabsContent value="Maths">
              <div className="mt-3">
                {showHomeworkCard('maths')}
              </div>
            </TabsContent>

            <TabsContent value="Français">
              <div className="mt-3">
                {showHomeworkCard('français')}
              </div>
            </TabsContent>

            <TabsContent value="Physique">
              <div className="mt-3">
                {showHomeworkCard('physique')}
              </div>
            </TabsContent>

            <TabsContent value="Histoire">
              <div className="mt-3">
                {showHomeworkCard('histoire')}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default App
