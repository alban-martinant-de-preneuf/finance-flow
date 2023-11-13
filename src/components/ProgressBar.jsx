import { PieChart, Pie, Cell } from 'recharts';

export default function ProgressBar() {



    const data = [
        { name: 'add', value: 80, color: 'green' },
        { name: 'min', value: 20, color: 'red' },
      ];

      return (
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx={200}
            cy={200}
            innerRadius={60}
            outerRadius={80}
            blendStroke
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      );
}