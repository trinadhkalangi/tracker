import React, { useState, useCallback, useMemo } from 'react';
import { View, UserProfile, Measurement, Appointment, MedicalReport, Photo, JournalEntry, ForumPost, ForumComment, ExpertQA } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Measurements from './components/Measurements';
import Appointments from './components/Appointments';
import Reports from './components/Reports';
import Profile from './components/Profile';
import Diary from './components/Diary';
import Community from './components/Community';
import ARMeasure from './components/ARMeasure';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Jane Doe',
    dueDate: new Date(new Date().setMonth(new Date().getMonth() + 7)).toISOString().split('T')[0],
    lastMenstrualPeriod: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0],
  });

  const [measurements, setMeasurements] = useState<Measurement[]>([
    { id: '1', date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(), circumference: 85, weight: 60, bloodPressureSystolic: 110, bloodPressureDiastolic: 70, bloodSugar: 90 },
    { id: '2', date: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(), circumference: 88, weight: 61.5, bloodPressureSystolic: 112, bloodPressureDiastolic: 72, bloodSugar: 92 },
    { id: '3', date: new Date().toISOString(), circumference: 92, weight: 63, bloodPressureSystolic: 115, bloodPressureDiastolic: 75, bloodSugar: 95 },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(), doctor: 'Dr. Emily Carter', location: 'City General Hospital', notes: 'Ultrasound scan' },
    { id: '2', date: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(), doctor: 'Dr. Emily Carter', location: 'City General Hospital', notes: 'First trimester check-up' },
  ]);

  const [reports, setReports] = useState<MedicalReport[]>([]);
  
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const [expertQAs, setExpertQAs] = useState<ExpertQA[]>([
      { id: 'qa1', question: "Is it normal to feel tired all the time in the first trimester?", answer: "Yes, extreme fatigue is very common in early pregnancy. It's caused by a sharp rise in progesterone. Listen to your body and get as much rest as you can.", expertName: "Dr. Annabelle Lee", expertTitle: "OB/GYN" },
      { id: 'qa2', question: "What are some safe exercises during pregnancy?", answer: "Walking, swimming, prenatal yoga, and stationary cycling are all excellent and safe choices for most pregnancies. Always consult your doctor before starting a new exercise routine.", expertName: "Dr. Emily Carter", expertTitle: "M.D., OB/GYN" },
      { id: 'qa3', question: "How can I manage morning sickness?", answer: "Eating small, frequent meals throughout the day can help. Try bland foods like crackers or toast. Ginger tea or candies can also provide relief. If sickness is severe, contact your healthcare provider.", expertName: "Dr. Annabelle Lee", expertTitle: "OB/GYN" },
  ]);

  const [forumPosts, setForumPosts] = useState<ForumPost[]>([
      { 
          id: 'post1', 
          author: 'ExpectingMom23', 
          date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), 
          title: "Cravings are getting weird!", 
          content: "Anyone else craving pickles and ice cream? I thought it was just a stereotype, but here I am! What are some of the strangest cravings you've had?",
          comments: [
              { id: 'c1', author: 'Jenna_B', date: new Date().toISOString(), content: "I've been wanting spicy food on everything! Never liked it before pregnancy." },
              { id: 'c2', author: 'SoonToBeMama', date: new Date().toISOString(), content: "For me it's lemons! I could eat them like oranges." },
          ]
      },
      { 
          id: 'post2', 
          author: 'FirstTimer', 
          date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), 
          title: "Feeling the first kicks!", 
          content: "I think I just felt the baby move for the first time! It was like little flutters. Such an amazing feeling. When did everyone else feel their first kicks?",
          comments: []
      },
  ]);

  const addMeasurement = useCallback((measurement: Omit<Measurement, 'id'>) => {
    const latest = measurements[measurements.length - 1] || {};
    const newMeasurement = { ...latest, ...measurement, id: new Date().toISOString() };
    setMeasurements(prev => [...prev, newMeasurement].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  }, [measurements]);

  const addAppointment = useCallback((appointment: Omit<Appointment, 'id'>) => {
    setAppointments(prev => [...prev, { ...appointment, id: new Date().toISOString() }].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  }, []);

  const addReport = useCallback((report: Omit<MedicalReport, 'id'>) => {
    setReports(prev => [...prev, { ...report, id: new Date().toISOString() }]);
  }, []);
  
  const addPhoto = useCallback((photo: Omit<Photo, 'id'>) => {
    setPhotos(prev => [...prev, { ...photo, id: new Date().toISOString() }].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const addJournalEntry = useCallback((entry: Omit<JournalEntry, 'id'>) => {
    setJournalEntries(prev => [...prev, { ...entry, id: new Date().toISOString() }].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const addForumPost = useCallback((post: Omit<ForumPost, 'id' | 'comments'>) => {
    setForumPosts(prev => [{ ...post, id: new Date().toISOString(), comments: [] }, ...prev]);
  }, []);

  const addForumComment = useCallback((postId: string, comment: Omit<ForumComment, 'id'>) => {
    setForumPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, { ...comment, id: new Date().toISOString() }]
        };
      }
      return post;
    }));
  }, []);


  const sortedAppointments = useMemo(() => 
    [...appointments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), 
    [appointments]
  );
  
  const upcomingAppointments = useMemo(() => 
    sortedAppointments.filter(a => new Date(a.date) >= new Date()),
    [sortedAppointments]
  );

  const renderView = () => {
    switch (currentView) {
      case View.Measurements:
        return <Measurements measurements={measurements} addMeasurement={addMeasurement} />;
      case View.Appointments:
        return <Appointments appointments={sortedAppointments} addAppointment={addAppointment} />;
      case View.Reports:
        return <Reports reports={reports} addReport={addReport} />;
      case View.Diary:
        return <Diary photos={photos} journalEntries={journalEntries} addPhoto={addPhoto} addJournalEntry={addJournalEntry} />;
      case View.Community:
        return <Community expertQAs={expertQAs} forumPosts={forumPosts} addForumPost={addForumPost} addForumComment={addForumComment} currentUser={profile.name} />;
      case View.Profile:
        return <Profile profile={profile} setProfile={setProfile} />;
      case View.ARMeasure:
        return <ARMeasure addMeasurement={addMeasurement} setCurrentView={setCurrentView} />;
      case View.Dashboard:
      default:
        return <Dashboard 
                  profile={profile} 
                  latestMeasurement={measurements.length > 0 ? measurements[measurements.length - 1] : undefined} 
                  nextAppointment={upcomingAppointments.length > 0 ? upcomingAppointments[0] : undefined}
                  measurements={measurements}
                  />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;