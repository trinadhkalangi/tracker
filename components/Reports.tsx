
import React, { useState } from 'react';
import { MedicalReport } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Modal from './common/Modal';

interface ReportsProps {
  reports: MedicalReport[];
  addReport: (report: Omit<MedicalReport, 'id'>) => void;
}

const Reports: React.FC<ReportsProps> = ({ reports, addReport }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState<{
    name: string;
    date: string;
    type: 'scan' | 'lab' | 'prescription' | 'bill';
    file: File | null;
  }>({
    name: '',
    date: new Date().toISOString().split('T')[0],
    type: 'scan',
    file: null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormState(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.file) {
      addReport({
        name: formState.name,
        date: new Date(formState.date).toISOString(),
        type: formState.type,
        file: formState.file,
      });
      setIsModalOpen(false);
      setFormState({ name: '', date: new Date().toISOString().split('T')[0], type: 'scan', file: null });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Medical Reports</h1>
        <Button onClick={() => setIsModalOpen(true)}>Upload Report</Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {reports.map(report => (
            <div key={report.id} className="border rounded-lg p-3 text-center flex flex-col items-center justify-center bg-gray-50">
              <DocumentIcon className="w-12 h-12 text-pink-500 mb-2" />
              <p className="font-semibold truncate w-full">{report.name}</p>
              <p className="text-sm text-gray-500">{new Date(report.date).toLocaleDateString()}</p>
              <a href={URL.createObjectURL(report.file)} download={report.file.name} className="mt-2 text-pink-600 hover:underline text-sm">Download</a>
            </div>
          ))}
          {reports.length === 0 && <p className="col-span-full text-center text-gray-500">No reports uploaded yet.</p>}
        </div>
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload New Report">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="file" onChange={handleFileChange} required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"/>
          <input type="text" name="name" placeholder="Report Name (e.g., Anomaly Scan)" value={formState.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" />
          <input type="date" name="date" value={formState.date} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" />
          <select name="type" value={formState.type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500">
            <option value="scan">Scan</option>
            <option value="lab">Lab Report</option>
            <option value="prescription">Prescription</option>
            <option value="bill">Bill</option>
          </select>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={!formState.file}>Upload</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

const DocumentIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

export default Reports;
