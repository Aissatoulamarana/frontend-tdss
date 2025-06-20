
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts'


export function MultiLineChart({ data, type }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Évolution {type !== 'all' ? `des ${type}` : "globale"}</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mois" />
          <YAxis />
          <Tooltip />
          <Legend />
          {(type === "all" || type === "declarations") && (
            <Line type="monotone" dataKey="declarations" stroke="#3B82F6" />
          )}
          {(type === "all" || type === "factures") && (
            <Line type="monotone" dataKey="factures" stroke="#10B981" />
          )}
          {(type === "all"   || type === "paiements") && (
            <Line type="monotone" dataKey="paiements" stroke="#F59E0B" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}