
import React, { useState } from 'react';
import { Appointment } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import Modal from './common/Modal';

interface AppointmentsProps {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
}

const Appointments: React.FC<AppointmentsProps> = ({ appointments, addAppointment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    date: '',
    doctor: '',
    location: '',
    notes: '',
  });
  
  const upcomingAppointments = appointments.filter(a => new Date(a.date) >= new Date());
  const pastAppointments = appointments.filter(a => new Date(a.date) < new Date()).reverse();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({
      date: new Date(formState.date).toISOString(),
      doctor: formState.doctor,
      location: formState.location,
      notes: formState.notes,
    });
    setIsModalOpen(false);
    setFormState({ date: '', doctor: '', location: '', notes: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Appointment</Button>
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
        {upcomingAppointments.length > 0 ? (
          <ul className="space-y-4">
            {upcomingAppointments.map(app => (
              <li key={app.id} className="p-4 bg-pink-50 rounded-lg">
                <p className="font-bold text-lg text-pink-700">{new Date(app.date).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}</p>
                <p className="font-semibold text-gray-800">{app.doctor}</p>
                <p className="text-gray-600">{app.location}</p>
                <p className="text-sm italic text-gray-500 mt-1">{app.notes}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No upcoming appointments.</p>
        )}
      </Card>
      
      <Card>
        <h2 className="text-xl font-bold mb-4">Past Appointments</h2>
         {pastAppointments.length > 0 ? (
          <ul className="space-y-4">
            {pastAppointments.map(app => (
              <li key={app.id} className="p-4 bg-gray-50 rounded-lg opacity-70">
                <p className="font-bold text-lg text-gray-600">{new Date(app.date).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}</p>
                <p className="font-semibold text-gray-700">{app.doctor}</p>
                <p className="text-gray-500">{app.location}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No past appointments.</p>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Appointment">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Date and Time" type="datetime-local" name="date" value={formState.date} onChange={handleChange} required />
          <Input label="Doctor's Name" type="text" name="doctor" value={formState.doctor} onChange={handleChange} required />
          <Input label="Location" type="text" name="location" value={formState.location} onChange={handleChange} required />
          <div className="flex flex-col">
            <label htmlFor="notes" className="mb-1 font-semibold text-gray-700">Notes</label>
            <textarea id="notes" name="notes" value={formState.notes} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit">Save Appointment</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Appointments;
