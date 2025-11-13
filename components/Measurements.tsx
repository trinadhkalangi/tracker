
import React, { useState } from 'react';
import { Measurement } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import Modal from './common/Modal';
import MeasurementChart from './MeasurementChart';

interface MeasurementsProps {
  measurements: Measurement[];
  addMeasurement: (measurement: Omit<Measurement, 'id'>) => void;
}

const Measurements: React.FC<MeasurementsProps> = ({ measurements, addMeasurement }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    date: new Date().toISOString().split('T')[0],
    circumference: '',
    weight: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    bloodSugar: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMeasurement({
      date: new Date(formState.date).toISOString(),
      circumference: parseFloat(formState.circumference),
      weight: parseFloat(formState.weight),
      bloodPressureSystolic: parseInt(formState.bloodPressureSystolic, 10),
      bloodPressureDiastolic: parseInt(formState.bloodPressureDiastolic, 10),
      bloodSugar: parseInt(formState.bloodSugar, 10),
    });
    setIsModalOpen(false);
    setFormState({
        date: new Date().toISOString().split('T')[0],
        circumference: '', weight: '', bloodPressureSystolic: '', bloodPressureDiastolic: '', bloodSugar: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Measurements</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Measurement</Button>
      </div>

      <Card>
          <h2 className="text-xl font-bold mb-4">Circumference Growth (cm)</h2>
          <div className="h-80">
            <MeasurementChart data={measurements} dataKey="circumference" unit="cm" />
          </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold mb-4">Measurement History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b-2 border-gray-200">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Circum. (cm)</th>
                <th className="p-3">Weight (kg)</th>
                <th className="p-3">BP</th>
                <th className="p-3">Sugar (mg/dL)</th>
              </tr>
            </thead>
            <tbody>
              {measurements.slice().reverse().map(m => (
                <tr key={m.id} className="border-b border-gray-100 hover:bg-pink-50">
                  <td className="p-3">{new Date(m.date).toLocaleDateString()}</td>
                  <td className="p-3">{m.circumference}</td>
                  <td className="p-3">{m.weight}</td>
                  <td className="p-3">{m.bloodPressureSystolic}/{m.bloodPressureDiastolic}</td>
                  <td className="p-3">{m.bloodSugar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Measurement">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Date" type="date" name="date" value={formState.date} onChange={handleChange} required />
          <Input label="Circumference (cm)" type="number" name="circumference" value={formState.circumference} onChange={handleChange} required step="0.1" />
          <Input label="Weight (kg)" type="number" name="weight" value={formState.weight} onChange={handleChange} required step="0.1" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Systolic BP" type="number" name="bloodPressureSystolic" value={formState.bloodPressureSystolic} onChange={handleChange} required />
            <Input label="Diastolic BP" type="number" name="bloodPressureDiastolic" value={formState.bloodPressureDiastolic} onChange={handleChange} required />
          </div>
          <Input label="Blood Sugar (mg/dL)" type="number" name="bloodSugar" value={formState.bloodSugar} onChange={handleChange} required />
          <div className="flex justify-end pt-4">
            <Button type="submit">Save Measurement</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Measurements;
