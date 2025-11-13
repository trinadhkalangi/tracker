
import React from 'react';
import { UserProfile, Measurement, Appointment } from '../types';
import Card from './common/Card';
import MeasurementChart from './MeasurementChart';

interface DashboardProps {
  profile: UserProfile;
  latestMeasurement?: Measurement;
  nextAppointment?: Appointment;
  measurements: Measurement[];
}

const getPregnancyWeek = (lmp: string): number => {
    const lmpDate = new Date(lmp);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lmpDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7);
};

const Dashboard: React.FC<DashboardProps> = ({ profile, latestMeasurement, nextAppointment, measurements }) => {
    const pregnancyWeek = getPregnancyWeek(profile.lastMenstrualPeriod);
    const dueDate = new Date(profile.dueDate);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {profile.name}!</h1>

            <Card>
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <div>
                        <p className="text-lg font-semibold text-pink-600">You are in</p>
                        <p className="text-5xl font-bold text-gray-800">Week {pregnancyWeek}</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <p className="text-lg font-semibold text-gray-500">Your due date is</p>
                        <p className="text-3xl font-bold text-pink-500">{dueDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-xl font-bold mb-4">Next Appointment</h2>
                    {nextAppointment ? (
                        <div className="space-y-2">
                            <p className="text-2xl font-semibold text-pink-600">{new Date(nextAppointment.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                            <p className="text-lg text-gray-600">{new Date(nextAppointment.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                            <p className="text-gray-700 font-medium">with {nextAppointment.doctor}</p>
                            <p className="text-gray-500">{nextAppointment.location}</p>
                            <p className="mt-2 text-sm italic text-gray-500">{nextAppointment.notes}</p>
                        </div>
                    ) : (
                        <p className="text-gray-500">No upcoming appointments scheduled.</p>
                    )}
                </Card>

                <Card>
                    <h2 className="text-xl font-bold mb-4">Latest Measurements</h2>
                    {latestMeasurement ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Circumference</p>
                                <p className="text-2xl font-bold">{latestMeasurement.circumference} cm</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Weight</p>
                                <p className="text-2xl font-bold">{latestMeasurement.weight} kg</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Blood Pressure</p>
                                <p className="text-2xl font-bold">{latestMeasurement.bloodPressureSystolic}/{latestMeasurement.bloodPressureDiastolic}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Blood Sugar</p>
                                <p className="text-2xl font-bold">{latestMeasurement.bloodSugar} mg/dL</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">No measurements recorded yet.</p>
                    )}
                </Card>
            </div>
            
            <Card>
                <h2 className="text-xl font-bold mb-4">Circumference Growth</h2>
                <div className="h-64">
                   <MeasurementChart data={measurements} dataKey="circumference" unit="cm" />
                </div>
            </Card>

        </div>
    );
};

export default Dashboard;
