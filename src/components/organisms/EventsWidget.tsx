import React from 'react';
import { WidgetHeader } from '../molecules/WidgetHeader';
import { TimelineItem } from '../molecules/TimelineItem';

export const EventsWidget: React.FC = () => {
  const events = [
    { id: 1, title: 'Inscripción a Mesas de Finales', date: 'Hasta 48hs antes del examen', isActive: true },
    { id: 2, title: 'Inicio del Primer Cuatrimestre', date: 'Lunes 16 de Marzo', isActive: false },
    { id: 3, title: 'Feriado: Día de la Memoria', date: 'Martes 24 de Marzo', isActive: false },
    { id: 4, title: 'Taller de Armado de CV', date: 'Jueves 09 de Abril - 18:00hs', isActive: false },
  ];

  return (
    <div className="bg-itec-bg rounded-xl p-6 shadow-lg">
      <WidgetHeader title="Próximos Eventos" />
      <div className="mt-4">
        {events.map((item, index) => (
          <TimelineItem 
            key={item.id}
            title={item.title}
            date={item.date}
            isActive={item.isActive}
            isLast={index === events.length - 1}
          />
        ))}
      </div>
    </div>
  );
};