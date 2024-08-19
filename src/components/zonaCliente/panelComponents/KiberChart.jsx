import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

function KiberChart({ clienteLogged }) {
  const [animationChart, setAnimationChart] = useState(false);
  const [totalTickets, setTotalTickets] = useState(0);

  useEffect(() => {
    let totalTickets = 0;
    clienteLogged.datoscliente.ordenes.forEach((orden) => {
      totalTickets += orden.entradas.length;
    });
    setTotalTickets(totalTickets);
  }, [clienteLogged]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationChart(true);
    }, 60);
  
    return () => {
      clearTimeout(timeout);
      setAnimationChart(false); 
    };
  }, []);

  const data = [
    { name: 'Tus tickets kiber', value: totalTickets },  
    { name: 'Spins a la Ruleta', value: clienteLogged.datoscliente.spinsRuleta },
    { name: 'Generos Favoritos', value: clienteLogged.datoscliente.gustosMusicales.length },
    { name: 'Chats desbloqueados', value: clienteLogged.datoscliente.chats.length }, //Despues de la pasarela de pago si da tiempo...
    { name: 'Descuentos usados', value: clienteLogged.datoscliente.descuentosUsados}
  ];

  const COLORS = ['#FF5733', '#FFBD33', '#33FF57', '#336BFF', '#AC33FF', '#FF33B8', '#33EFFF', '#FF3354', '#FFAC33', '#33FFC7'];  

  if (animationChart) {
    return (
      <PieChart width={300} height={285}>
        <Pie
          isAnimationActive={animationChart}
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={35}
          outerRadius={100}
          stroke='#f0f4f8'
          fill="#8884d8"
          label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
            const RADIAN = Math.PI / 180;
            const radius = 25 + innerRadius + (outerRadius - innerRadius);
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            return (
              <text className='silkScreen text-xl font-bold' x={x} y={y} fill={COLORS[index % COLORS.length]} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {value}
              </text>
            );
          }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ fontFamily: 'slkScreen' }} formatter={(value, name) => [name]} />
      </PieChart>
    );
  } else {
    return null; 
  }
}

export default KiberChart;