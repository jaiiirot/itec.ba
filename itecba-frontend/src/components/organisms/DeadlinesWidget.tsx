import React from 'react';
import { WidgetHeader } from '../molecules/WidgetHeader';
import { TimelineItem } from '../molecules/TimelineItem';

export const DeadlinesWidget: React.FC = () => {
  const deadlines = [
    { id: 1, title: 'Parcial de Análisis II -', date: '15/10', isActive: true },
    { id: 2, title: 'Parcial de Ingeniería II -', date: '15/10', isActive: false },
    { id: 3, title: 'Parcial de Ingeniería III -', date: '17/10', isActive: false },
    { id: 4, title: 'Parcial de Análisis II -', date: '15/10', isActive: false },
  ];

  return (
    <div className="bg-itec-surface border border-itec-gray rounded-xl p-6 shadow-lg">
      <WidgetHeader title="Próximos Vencimientos" />
      <div className="mt-2">
        {deadlines.map((item, index) => (
          <TimelineItem 
            key={item.id}
            title={item.title}
            date={item.date}
            isActive={item.isActive}
            isLast={index === deadlines.length - 1}
          />
        ))}
      </div>
    </div>
  );
};