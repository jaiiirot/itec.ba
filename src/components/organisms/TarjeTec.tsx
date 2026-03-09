import React from "react";
import { Icons } from "../atoms/Icons";
import logoItec from "../../assets/logo.png";
import type { User } from "../../context/AuthContext";

export const TarjeTec: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="w-[600px] h-[350px] aspect-[1.6/1] max-w-2xl mx-auto bg-gradient-to-br from-[#2a2a2a] via-[#111] to-[#000] rounded-3xl p-8 shadow-[0_30px_60px_rgba(0,0,0,0.9)] border border-[#444] relative overflow-hidden flex flex-col justify-around group cursor-pointer transition-transform hover:-translate-y-2">
      {/* Brillo dinámico estilo Apple Card */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>

      {/* Holograma de fondo */}
      <div className="absolute -right-16 -bottom-16 opacity-[0.03] text-white w-96 h-96 pointer-events-none transform rotate-12">
        <Icons type="hologram" />
      </div>

      {/* Top Card */}
      <div className="flex justify-between items-center relative z-10">
        <div className="w-10 h-10 text-white rotate-90 opacity-80">
          <Icons type="nfc" />
        </div>
        <div className="flex items-center gap-3">
          <img
            src={logoItec}
            alt="Logo"
            className="w-12 h-12 object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]"
          />
          <span className="text-3xl font-bold text-white tracking-widest drop-shadow-lg">
            TARJETEC
          </span>
        </div>
      </div>

      {/* Stickers Decorativos */}
      <div className="flex gap-3">
        <div className="opacity-80 shadow-xl">
          <span className="bg-blue-500 text-white text-[10px] font-bold uppercase py-1 px-3  rounded-4xl border border-white/20 shadow-[0_4px_10px_rgba(0,64,147,0.5)]">
            UTN.BA
          </span>
        </div>
        <div className="opacity-80 shadow-xl ">
          <span className="bg-orange-500 text-white text-[10px] font-bold uppercase py-1 px-3  rounded-4xl border border-white/20 shadow-[0_4px_10px_rgba(0,64,147,0.5)]">
            TECH
          </span>
        </div>
        <div className="opacity-80 shadow-xl">
          <span className="bg-red-500 text-white text-[10px] font-bold uppercase py-1 px-3  rounded-4xl border border-white/20 shadow-[0_4px_10px_rgba(0,64,147,0.5)]">
            {user.specialty}
          </span>
        </div>
      </div>

      {/* Bottom Card */}
      <div className="relative z-10 flex justify-between items-end mt-4">
        <div>
          <p className="font-mono text-3xl text-gray-200 tracking-[0.25em] mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {user.phone.replace(/(.{5})(?!$)/g, "$1 ")}
          </p>
          <div className="flex flex-col">
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-bold mb-0.5">
              Estudiante
            </p>
            <p className="text-[15px] text-white uppercase font-bold drop-shadow-md">
              {user.email}
            </p>
          </div>
        </div>
        <div className="w-25 h-25 bg-white rounded-xl p-1.5 shrink-0 shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-2 border-white/20">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(user.legajo)}`}
            alt="QR"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};
