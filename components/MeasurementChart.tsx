
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Measurement } from '../types';

interface MeasurementChartProps {
  data: Measurement[];
  dataKey: keyof Pick<Measurement, 'circumference' | 'weight' | 'bloodSugar'>;
  unit: string;
}

const MeasurementChart: React.FC<MeasurementChartProps> = ({ data, dataKey, unit }) => {
  const formattedData = data.map(item => ({
    ...item,
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={formattedData}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="name" stroke="#6b7280" />
        <YAxis stroke="#6b7280" unit={unit} />
        <Tooltip
            contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
            }}
        />
        <Legend />
        <Line type="monotone" dataKey={dataKey} stroke="#ec4899" strokeWidth={2} activeDot={{ r: 8 }} dot={{r: 5}} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MeasurementChart;
