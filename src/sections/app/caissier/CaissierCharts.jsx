// eslint-disable-next-line import/no-extraneous-dependencies
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';

export function MultiLineChart({ data }) {
  return (
    <div style={{ padding: 16, borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mois" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="transactions" stroke="#3B82F6" name="Transactions" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}