import {ModeToggle} from "@/components/mode-toggle"
import {HomeworkCard} from "@/components/homework-card"
import {Button} from "@/components/ui/button"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {AddHomework} from "@/components/addHomework-panel"
import supabase from '@/config/supabaseClient'
import {useEffect, useState} from 'react'
import {motion} from "framer-motion"
import {useNavigate} from "react-router-dom"
import {Bin} from '@/components/bin'
import {LeaderBoard} from '@/components/leader-board'

interface Homework {
    id: number,
    created_at: Date,
    subject: string,
    description: string,
    time: string,
    deadline: Number,
    done: boolean,
    userid: string
  }

function HomePage() {
    const [homeworks, setHomeworks] = useState<Homework[]>([]);
    const [workTimeLeft, setWorkTimeLeft] = useState<number>(0);
    const [showAddHomework, setShowAddHomework] = useState<boolean>(false);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [spe, setSpe] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const navigate = useNavigate();

  async function signOut() {
        const {error} = await supabase.auth.signOut()
        error ? console.log(error) : null
        navigate("/")
  }

  // Fetches the homeworks & subjects data from the database
  const fetchHomeworks = async () => {
    const { data, error } = await supabase.from('homeworks').select();

    if (error) {
      console.error(error);
    }

    if (data) {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      const filteredHomeworks = data.filter(homework => homework.userid === userId);
      let totalTime = 0;
      filteredHomeworks.map(homework => {!homework.done ? totalTime += Number(homework.time) : null});
      setHomeworks(filteredHomeworks);
      setWorkTimeLeft(totalTime);
    }
  };

  const fetchSubjects = async () => {
    const { data, error } = await supabase.from('subjects').select();

    if (error) {
      console.error(error);
    }

    // Map the fetched data to an array of subjects and add a default subject
    if (data) {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      const filteredSubjects = data.filter(subject => subject.userid === userId && subject.spé === false);
      const subjects = [...filteredSubjects.map(({ subject }: { subject: string }) => subject)];
      setSubjects(subjects);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchHomeworks();
  
    supabase
      .channel('homeworks-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'homeworks',
        },
        (_payload) => {
          fetchHomeworks();
        }
      )
      .subscribe();
  
    supabase
      .channel('subjects-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subjects',
        },
        (_payload) => {
          fetchSubjects();
        }
      )
      .subscribe();
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

  const createSpe = async (subject: string) => {
    setSpe(!spe);

    const { data } = await supabase
      .from('subjects')
      .select();

      const hasSpeSubject = data?.some(subjectItem => subjectItem.subject === `Spé ${subject}`);

      if (data && hasSpeSubject === false) {
        let ids: number[] = [];
        ids = data.map((subjectItem: { id: number }) => subjectItem.id);
        const maxId = Math.max(...ids) || 0;
  
        const newSpéSubject = {
          subject: `Spé ${subject}`,
          id: maxId !== -Infinity ? maxId + 1 : 0,
          spé: true,
          userid: (await supabase.auth.getUser()).data.user?.id,
        };
  
        await supabase
          .from('subjects')
          .insert(newSpéSubject)
          .select();
      }

  }

  const renderHomeworkCard = (activeTab: string) => {
    const filteredHomeworks = homeworks.filter(homework => homework.subject === activeTab);

    return (
      <div>
        <div className="flex flex-row flex-wrap max-h-[30rem] overflow-y-auto">
          {activeTab != 'Tout' ? ( 
            filteredHomeworks.map(homework => (
              <motion.div
                initial={{ opacity: 0, y:-20 }}
                animate={{
                  opacity: 1 ,
                  y: 0,
                }}
                transition={{ duration: 0.2 }}
                >
                <HomeworkCard key={homework.id} homework={homework} setIsLoading={setIsLoading} /> 
              </motion.div>
            ))
          ) : (
            homeworks.map(homework => (
              <motion.div
                initial={{ opacity: 0, y:-20  }}
                animate={{
                  opacity: 1 ,
                  y: 0,
                }}
                transition={{ duration: 0.2 }}
                >
                <HomeworkCard key={homework.id} homework={homework} setIsLoading={setIsLoading} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    );
  };
  
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="text-5xl text-white flex flex-row">
            <p>Chargement</p>
            <div className="h-4 w-4 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s] mt-6 mr-1 ml-1"></div>
            <div className="h-4 w-4 bg-foreground rounded-full animate-bounce [animation-delay:-0.2s] mt-6 mr-1"></div>
            <div className="h-4 w-4 bg-foreground rounded-full animate-bounce [animation-delay:-0.1s] mt-6"></div>
          </div>
        </div>
      )}
      <div className={isLoading ? 'blur-lg' : ''}>
        <div className="top-5 left-5 relative">
          <div className="text-4xl font-semibold w-screen">
            <div className="absolute">
              <ModeToggle />
            </div>
            <div className="ml-[6rem] flex flex-col">
              <h1>Bonjour, <span className='text-primary'>Damien</span></h1>
              <h1>On est le <span>{formatDate(new Date())}</span></h1>
            </div>
          </div>
        </div>

        <div className="absolute top-5 right-5 flex flex-row gap-3">
          <LeaderBoard />
          <Button variant="outline" onClick={() => signOut()}>Se déconnecter</Button>
        </div>

        <Bin homeworks={homeworks} setIsLoading={setIsLoading} />

        <div className="relative left-[7rem] top-20">
          <Tabs defaultValue="Tout" className="w-[70rem]">
            {/* Subjects tabs */}
            <TabsList>
              <TabsTrigger value='Tout'>Tout</TabsTrigger>
                {
                  subjects.map((subject) => (
                    <TabsTrigger key={subject} value={subject}>{subject}</TabsTrigger>
                  ))
                }
            </TabsList>

            {/* Tabs content */}
            <TabsContent value="Tout">
              <div className="w-full max-w-[59rem] relative flex flex-col mt-4">
                {renderHomeworkCard('Tout')}
              </div>
            </TabsContent>

            {
              subjects.map(subject => (
                <TabsContent key={subject} value={subject}>
                  <div className="mt-3 text-2xl">
                    { !spe ? (
                      <>
                        <h1>{subject}</h1>
                        {renderHomeworkCard(subject)}
                      </>
                      ) : (
                        <>
                        <h1>{`Spé ${subject}`}</h1>
                        {renderHomeworkCard(`Spé ${subject}`)}
                      </>
                    )}
                  </div>
                  <Button onClick={() => createSpe(subject)} className="text-xl font-normal mb-3 mt-3">{spe ? `Voir ${subject}` : `Voir spé ${subject}`}</Button>
                </TabsContent>
              ))
            }
          </Tabs>

          <div>
            <div className="absolute ml-[45rem]">
              <Button onClick={() => setShowAddHomework(!showAddHomework)} className="text-primary-foreground text-xl font-normal">
                Ajouter un devoir
              </Button>
            </div>
            <p className="text-2xl">
              Il te reste encore <span className="text-primary">{' ' + workTimeLeft.toString()}</span> minutes de travail.
            </p>
          </div>

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{opacity: showAddHomework ? 1 : 0, y: showAddHomework ? 0 : -20}} transition={{ duration: 0.2 }} className='absolute right-[13rem] top-[5.5rem]'>
            <AddHomework setIsLoading={setIsLoading} />
          </motion.div>

        </div>
      </div>
    </>
  );
}

export default HomePage;