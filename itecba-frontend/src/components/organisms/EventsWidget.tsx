import React from "react";
import { EVENTS } from "../../features/home/types/dashboardData";
import { Icons } from "../atoms/Icons";

export const EventsWidget: React.FC = () => {
  // Regla: Mostrar solo los 2 eventos más próximos
  const topEvents = EVENTS.slice(0, 2);

  return (
    <div className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-4 h-full flex flex-col relative overflow-hidden group">
      <div className="relative border-[#333] flex px-6 flex-col md:flex-row md:gap-8">
        {topEvents.map((ev) => (
          <div key={ev.id} className="relative">
            <div
              className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-[#0a0a0a] ${ev.isUrgent ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "bg-gray-500"}`}
            ></div>
            <h4 className="text-sm font-bold text-white leading-tight">
              {ev.title}
            </h4>
            <p className="text-xs text-gray-400 mt-1">{ev.description}</p>
          </div>
        ))}
      </div>
      <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-gray-300 hover:text-white transition-colors relative flex items-center justify-center gap-2 hover:cursor-pointer">
        <Icons type="calendar"/>
      </button>
    </div>
  );
};
