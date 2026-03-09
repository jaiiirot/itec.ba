import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Icons } from "../atoms/Icons";
import { COURSE_DATA } from "../../data/courses";
import { RESOURCES_DB } from "../../data/resources";
import { GROUPS_DB } from "../../data/groups";
import { DIRECTORY_DB } from "../../data/directory";

export const UniversalSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();

    return {
      cursos: COURSE_DATA.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)),
      aportes: RESOURCES_DB.filter((r) => r.title.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q)).slice(0, 3),
      grupos: GROUPS_DB.filter((g) => g.materia.toLowerCase().includes(q)).slice(0, 3),
      directorio: DIRECTORY_DB.filter((d) => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)).slice(0, 4),
    };
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center mb-8 relative flex-col gap-4 lg:flex-row z-50">
      <div className="relative w-full max-w-2xl" ref={searchRef}>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5">
          <Icons type="search" />
        </div>
        <input
          type="text"
          placeholder="Buscar universalmente apuntes, materias, foros, grupos..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => setIsSearchOpen(true)}
          className="bg-itec-surface border border-itec-gray text-white pl-12 pr-4 py-3 rounded-2xl w-full focus:outline-none focus:border-itec-blue transition-colors shadow-lg"
        />

        {isSearchOpen && searchResults && (
          <div className="absolute top-full mt-2 w-full bg-itec-surface border border-itec-gray rounded-xl shadow-2xl overflow-hidden max-h-[70vh] flex flex-col z-40">
            <div className="overflow-y-auto p-4 custom-scrollbar flex flex-col gap-6">
              
              {/* Cursos */}
              {searchResults.cursos.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Cursos & Clases</h4>
                  {searchResults.cursos.map((curso) => (
                    <Link to={`/cursos/${curso.id}`} key={curso.id} onClick={() => setIsSearchOpen(false)} className="flex items-center gap-3 p-2 hover:bg-itec-gray rounded-lg transition-colors">
                      <div className="w-10 h-10 rounded bg-blue-500/20 flex items-center justify-center text-blue-400"><div className="w-5 h-5"><Icons type="play" /></div></div>
                      <div><p className="text-sm font-bold text-white">{curso.title}</p><p className="text-xs text-gray-400">videos disponibles</p></div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Aportes */}
              {searchResults.aportes.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Aportes & Resúmenes</h4>
                  {searchResults.aportes.map((aporte) => (
                    <Link to="/explore" key={aporte.id} onClick={() => setIsSearchOpen(false)} className="flex items-center gap-3 p-2 hover:bg-itec-gray rounded-lg transition-colors">
                      <div className="w-10 h-10 rounded bg-orange-500/20 flex items-center justify-center text-orange-400"><div className="w-5 h-5"><Icons type="compass" /></div></div>
                      <div><p className="text-sm font-bold text-white">{aporte.title}</p><p className="text-xs text-gray-400">{aporte.subject} • {aporte.type}</p></div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Grupos */}
              {searchResults.grupos.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Grupos de WhatsApp</h4>
                  {searchResults.grupos.map((grupo) => (
                    <Link to="/grupos" key={grupo.id} onClick={() => setIsSearchOpen(false)} className="flex items-center gap-3 p-2 hover:bg-itec-gray rounded-lg transition-colors">
                      <div className="w-10 h-10 rounded bg-green-500/20 flex items-center justify-center text-green-400"><div className="w-5 h-5"><Icons type="users" /></div></div>
                      <div><p className="text-sm font-bold text-white">{grupo.materia}</p><p className="text-xs text-gray-400">Comisión: {grupo.comision} • {grupo.carrera.toUpperCase()}</p></div>
                    </Link>
                  ))}
                </div>
              )}

              {searchResults.cursos.length === 0 && searchResults.aportes.length === 0 && searchResults.grupos.length === 0 && (
                <p className="text-center text-gray-500 text-sm py-4">No encontramos resultados para "{searchQuery}"</p>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};