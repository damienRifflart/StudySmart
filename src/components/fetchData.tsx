import supabase from '../../src/config/supabase-client'
import { UUID } from 'crypto'
import { useEffect, useState } from 'react'

interface Homework {
  id: number,
  created_at: Date,
  subject: string,
  description: string,
  time: Number,
  deadline: Number,
  done: boolean,
  user_id: UUID
}

interface Subject {
  id: number,
  subject: string,
  spé: boolean,
  user_id: UUID
}
const fetchData = () => {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const fetchHomeworks = async () => {
    try {
      const { data, error } = await supabase
        .from('homeworks')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      setHomeworks(data as Homework[]);
    } catch (error) {
      console.error('Error fetching homeworks:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('spé', false);

      if (error) throw error;

      setSubjects(data as Subject[]);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  useEffect(() => {
    fetchHomeworks();
    fetchSubjects();

    const homeworksSubscription = supabase
      .channel('homeworks-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'homeworks' },
        fetchHomeworks
      )
      .subscribe();

    const subjectsSubscription = supabase
      .channel('subjects-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'subjects' },
        fetchSubjects
      )
      .subscribe();

    return () => {
      homeworksSubscription.unsubscribe();
      subjectsSubscription.unsubscribe();
    };
  }, []);

  return { homeworks, subjects };
};

export default fetchData