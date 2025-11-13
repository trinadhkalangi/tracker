
import React, { useState } from 'react';
import { Photo, JournalEntry } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Modal from './common/Modal';
import Input from './common/Input';

interface DiaryProps {
  photos: Photo[];
  journalEntries: JournalEntry[];
  addPhoto: (photo: Omit<Photo, 'id'>) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
};

const Diary: React.FC<DiaryProps> = ({ photos, journalEntries, addPhoto, addJournalEntry }) => {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);

  // Photo form state
  const [photoDate, setPhotoDate] = useState(new Date().toISOString().split('T')[0]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Journal form state
  const [journalDate, setJournalDate] = useState(new Date().toISOString().split('T')[0]);
  const [journalContent, setJournalContent] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (photoFile) {
        const imageUrl = await blobToBase64(photoFile);
        addPhoto({ date: new Date(photoDate).toISOString(), imageUrl });
        setIsPhotoModalOpen(false);
        setPhotoFile(null);
        setPhotoPreview(null);
        setPhotoDate(new Date().toISOString().split('T')[0]);
    }
  };

  const handleJournalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (journalContent.trim()) {
        addJournalEntry({ date: new Date(journalDate).toISOString(), content: journalContent });
        setIsJournalModalOpen(false);
        setJournalContent('');
        setJournalDate(new Date().toISOString().split('T')[0]);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Photo Diary & Journal</h1>
      
      {/* Photo Diary Section */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Bump Photo Diary</h2>
          <Button onClick={() => setIsPhotoModalOpen(true)}>Add Photo</Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className="relative aspect-square group">
              <img src={photo.imageUrl} alt={`Pregnancy photo from ${new Date(photo.date).toLocaleDateString()}`} className="w-full h-full object-cover rounded-lg shadow-sm" />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center p-1 rounded-b-lg">
                {new Date(photo.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
        {photos.length === 0 && <p className="text-center text-gray-500 mt-4">No photos yet. Add your first bump picture!</p>}
      </Card>
      
      {/* Journal Section */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Journal</h2>
          <Button onClick={() => setIsJournalModalOpen(true)}>New Entry</Button>
        </div>
        <div className="space-y-4">
          {journalEntries.map(entry => (
            <div key={entry.id} className="bg-pink-50/50 p-4 rounded-lg">
              <p className="font-semibold text-pink-700">{new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-gray-700 whitespace-pre-wrap mt-1">{entry.content}</p>
            </div>
          ))}
        </div>
        {journalEntries.length === 0 && <p className="text-center text-gray-500 mt-4">No journal entries yet. Write down your thoughts!</p>}
      </Card>

      {/* Add Photo Modal */}
      <Modal isOpen={isPhotoModalOpen} onClose={() => setIsPhotoModalOpen(false)} title="Add a New Photo">
        <form onSubmit={handlePhotoSubmit} className="space-y-4">
          <Input label="Date" type="date" name="date" value={photoDate} onChange={e => setPhotoDate(e.target.value)} required />
          <div>
            <label className="mb-1 font-semibold text-gray-700 block">Photo</label>
            <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"/>
          </div>
          {photoPreview && <img src={photoPreview} alt="Preview" className="mt-2 rounded-lg max-h-60 w-auto mx-auto"/>}
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={!photoFile}>Save Photo</Button>
          </div>
        </form>
      </Modal>

      {/* Add Journal Entry Modal */}
      <Modal isOpen={isJournalModalOpen} onClose={() => setIsJournalModalOpen(false)} title="New Journal Entry">
        <form onSubmit={handleJournalSubmit} className="space-y-4">
            <Input label="Date" type="date" name="date" value={journalDate} onChange={e => setJournalDate(e.target.value)} required />
            <div>
                <label htmlFor="journalContent" className="mb-1 font-semibold text-gray-700">Content</label>
                <textarea 
                    id="journalContent" 
                    value={journalContent} 
                    onChange={e => setJournalContent(e.target.value)} 
                    rows={6}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="How are you feeling today?"
                />
            </div>
            <div className="flex justify-end pt-4">
                <Button type="submit">Save Entry</Button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default Diary;
