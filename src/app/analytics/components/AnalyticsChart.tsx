
import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AnalyticsData } from '../../../../types';

interface AnalyticsChartProps {
  data: AnalyticsData;
  chartType?: 'clickTrend' | 'referrers' | 'devices' | 'locations';
}

const COLORS_PIE = ['#0ea5e9', '#6366f1', '#ec4899', '#f97316', '#10b981', '#eab308']; // sky, indigo, pink, orange, emerald, yellow

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data, chartType = 'clickTrend' }) => {
  if (!data) return <p>No data available for chart.</p>;

  const renderChart = () => {
    switch (chartType) {
      case 'clickTrend':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.clickTrend} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis stroke="#9ca3af" allowDecimals={false}/>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.375rem' }} itemStyle={{ color: '#e5e7eb' }} />
              <Legend />
              <Line type="monotone" dataKey="clicks" stroke="#38bdf8" strokeWidth={2} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'referrers':
      case 'devices':
      case 'locations':
        let pieData;
        if (chartType === 'referrers') pieData = data.referrers.map(r => ({ name: r.source, value: r.count }));
        else if (chartType === 'devices') pieData = data.devices.map(d => ({ name: d.type, value: d.count }));
        else pieData = data.locations.map(l => ({ name: l.country, value: l.count }));
        
        // Filter out zero values for pie chart
        pieData = pieData.filter(item => item.value > 0);

        if(pieData.length === 0) return <p className="text-slate-400 text-center py-4">No data for this category.</p>;

        return (
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.375rem' }} itemStyle={{ color: '#e5e7eb' }}/>
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        );
      default:
        return <p>Invalid chart type selected.</p>;
    }
  };

  const getTitle = () => {
    switch (chartType) {
      case 'clickTrend': return 'Click Trend Over Time';
      case 'referrers': return 'Top Referrers';
      case 'devices': return 'Device Types';
      case 'locations': return 'Top Locations';
      default: return 'Analytics Chart';
    }
  }

  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">{getTitle()}</h3>
      {renderChart()}
    </div>
  );
};
