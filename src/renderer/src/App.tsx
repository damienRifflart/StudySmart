import {ModeToggle} from "@/components/mode-toggle"
import {HomeworkCard} from "@/components/homework-card"
import {Button} from "@/components/ui/button"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {AddHomework} from "@/components/add-homework"
import supabase from '@/config/supabaseClient'
import {useEffect, useState} from 'react'

interface Homework {
  created_at: Date,
  subject: string,
  description: string,
  time: string,
  deadline: Number,
  done: boolean
}

function App(): JSX.Element {
  const [error, setError] = useState<string | null>(null);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [workTimeLeft, setWorkTimeLeft] = useState<number>(0);
  const [showAddHomework, setShowAddHomework] = useState<boolean>(false);

  useEffect(() => {
    const fetchHomeworks = async () => {
      const { data, error } = await supabase.from('homeworks').select();

      if (error) {
        setError('Could not fetch the homeworks');
        console.error(error);
      }

      if (data) {
        let totalTime = 0;
        data.map(homework => {!homework.done ? totalTime += Number(homework.time) : null});
        setHomeworks(data);
        setWorkTimeLeft(totalTime);
      }
    };

    fetchHomeworks();
  }, []);


  const formatDate = (date: Date): string => {
    const monthNames = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const renderHomeworkCard = (activeTab: string) => {
    const filteredHomeworks = homeworks.filter(homework => homework.subject === activeTab);

    return (
      <div>
        <div className="flex flex-row flex-wrap">
          {filteredHomeworks.length === 0 ? (
            <p className="text-2xl">
              {activeTab != 'Tout' ? `Il n\'y a pas de devoirs pour la matière ${activeTab}.` : null}
            </p>
          ) : (
            filteredHomeworks.map(homework => (
              <HomeworkCard key={homework.created_at} homework={homework} />
            ))
          )}
        </div>

        <div className="flex flex-row flex-wrap">
          {activeTab === 'Tout' ? (
            homeworks.length === 0 ? (
              <p className="text-2xl">Il n'y a pas de devoirs.</p>
            ) : (
              homeworks.map(homework => (
                <HomeworkCard key={homework.created_at} homework={homework} />
              ))
            )
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="top-5 left-5 relative">
          <div className="text-4xl font-semibold w-screen">
            <div className="absolute">
              <ModeToggle />
            </div>
            <div className="ml-[6rem] flex flex-col">
              <h1>Bonjour, <span className='bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text'>Damien</span></h1>
              <h1>On est le <span>{formatDate(new Date())}</span></h1>
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
              <div className="w-full max-w-[59rem] relative flex flex-col mt-4">
                {error && <p>{error}</p>}
                {renderHomeworkCard('Tout')}
                <div className="flex flex-row mt-4">
                  <div className="absolute right-5 bottom-0">
                    <Button onClick={() => setShowAddHomework(!showAddHomework)} className="text-accent-foreground text-xl font-normal">
                      Ajouter un devoir
                    </Button>
                  </div>
                  <p className="text-2xl">
                    Il te reste encore
                    <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">{' ' + workTimeLeft.toString()}</span> minutes de travail.
                  </p>
                </div>
              </div>
              <div className={`${showAddHomework ? 'hidden' : 'absolute right-[13rem] top-[5.5rem]'}`}>
                <AddHomework />
              </div>
            </TabsContent>

            {['Maths', 'Français', 'Physique', 'Histoire'].map(subject => (
              <TabsContent key={subject} value={subject}>
                <div className="mt-3">
                  {renderHomeworkCard(subject)}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default App