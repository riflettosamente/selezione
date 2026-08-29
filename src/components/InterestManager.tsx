import React, { useState } from "react";
import { InterestItem } from "../types";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  Star,
  FileSpreadsheet,
  Filter,
  Sparkles,
  Search,
  RefreshCw,
  Sliders,
  ExternalLink,
  ChevronDown
} from "lucide-react";

interface InterestManagerProps {
  interests: InterestItem[];
  onUpdateInterests: (interests: InterestItem[]) => void;
  onOpenSheetsModal: () => void;
  onGenerateDigest: () => void;
}

export const InterestManager: React.FC<InterestManagerProps> = ({
  interests,
  onUpdateInterests,
  onOpenSheetsModal,
  onGenerateDigest,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formCategory, setFormCategory] = useState("");
  const [formTopic, setFormTopic] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPriority, setFormPriority] = useState<number>(5);
  const [formSources, setFormSources] = useState("");

  const categories = Array.from(new Set(interests.map((i) => i.category))).filter(Boolean);

  const filteredInterests = interests.filter((item) => {
    const matchesSearch =
      item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesPriority =
      priorityFilter === "ALL"
        ? true
        : priorityFilter === "HIGH"
        ? item.priority >= 4
        : item.priority === Number(priorityFilter);

    return matchesSearch && matchesCategory && matchesPriority;
  });

  const highPriorityCount = interests.filter((i) => i.priority >= 4 && i.enabled).length;

  const handleToggleEnable = (id: string) => {
    onUpdateInterests(
      interests.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Rimuovere questo argomento dalla lista dei tuoi interessi?")) {
      onUpdateInterests(interests.filter((item) => item.id !== id));
    }
  };

  const handleStartEdit = (item: InterestItem) => {
    setEditingId(item.id);
    setFormCategory(item.category);
    setFormTopic(item.topic);
    setFormDesc(item.description);
    setFormPriority(item.priority);
    setFormSources(item.sources || "");
    setIsAdding(false);
  };

  const handleSaveEdit = () => {
    if (!formTopic.trim()) return;
    onUpdateInterests(
      interests.map((item) =>
        item.id === editingId
          ? {
              ...item,
              category: formCategory.trim() || "Generale",
              topic: formTopic.trim(),
              description: formDesc.trim(),
              priority: formPriority,
              sources: formSources.trim(),
            }
          : item
      )
    );
    setEditingId(null);
  };

  const handleAddNew = () => {
    if (!formTopic.trim()) return;
    const newItem: InterestItem = {
      id: `custom-${Date.now()}`,
      category: formCategory.trim() || "Nuova Categoria",
      topic: formTopic.trim(),
      description: formDesc.trim(),
      priority: formPriority,
      sources: formSources.trim(),
      enabled: true,
    };
    onUpdateInterests([newItem, ...interests]);
    setIsAdding(false);
    // Reset form
    setFormTopic("");
    setFormCategory("");
    setFormDesc("");
    setFormSources("");
    setFormPriority(5);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Banner Overview */}
      <div className="bg-white border border-stone-200 rounded-sm p-6 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8b1e1e] mb-1 font-sans">
              <FileSpreadsheet className="w-4 h-4" />
              I Miei Interessi &bull; Foglio di Riferimento
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-stone-900">
              Gestione Argomenti & Priorità
            </h1>
            <p className="text-sm text-stone-600 font-sans mt-1">
              L'Editor Capo della rivista analizza i tuoi temi e seleziona le migliori notizie per ciascun argomento con <strong>Priorità 4 e 5</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenSheetsModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-semibold transition-colors border border-stone-200"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Sincronizza Foglio</span>
            </button>
            <button
              onClick={onGenerateDigest}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8b1e1e] hover:bg-[#741919] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Genera Digest da questi temi</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-stone-50 p-4 rounded border border-stone-200/80">
            <div className="text-2xl font-bold font-serif-title text-stone-900">
              {interests.length}
            </div>
            <div className="text-xs text-stone-500 font-sans font-medium">
              Argomenti Totali
            </div>
          </div>

          <div className="bg-amber-50/80 p-4 rounded border border-amber-200">
            <div className="text-2xl font-bold font-serif-title text-amber-900 flex items-center gap-1.5">
              {highPriorityCount}
              <Star className="w-4 h-4 fill-amber-500 text-amber-500 inline" />
            </div>
            <div className="text-xs text-amber-900 font-sans font-medium">
              Priorità 4 & 5 (Focus Rivista)
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded border border-stone-200/80">
            <div className="text-2xl font-bold font-serif-title text-stone-900">
              {categories.length}
            </div>
            <div className="text-xs text-stone-500 font-sans font-medium">
              Categorie Tematiche
            </div>
          </div>

          <div className="bg-emerald-50/80 p-4 rounded border border-emerald-200">
            <div className="text-2xl font-bold font-serif-title text-emerald-900">
              {interests.filter((i) => i.enabled).length}
            </div>
            <div className="text-xs text-emerald-800 font-sans font-medium">
              Attivi per la Redazione
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cerca argomento o parola chiave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-700"
          >
            <option value="ALL">Tutte le Categorie ({interests.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat} ({interests.filter((i) => i.category === cat).length})
              </option>
            ))}
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-700 font-medium"
          >
            <option value="ALL">Tutte le Priorità</option>
            <option value="HIGH">★ Priorità 4 e 5 (Solo Alta)</option>
            <option value="5">Priorità 5 (Massima)</option>
            <option value="4">Priorità 4 (Alta)</option>
            <option value="3">Priorità 3 (Media)</option>
            <option value="2">Priorità 2 (Bassa)</option>
            <option value="1">Priorità 1 (Minima)</option>
          </select>
        </div>

        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormTopic("");
            setFormCategory("");
            setFormDesc("");
            setFormSources("");
            setFormPriority(5);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Aggiungi Argomento</span>
        </button>
      </div>

      {/* Add / Edit Form Modal/Card */}
      {(isAdding || editingId) && (
        <div className="bg-amber-50/70 border-2 border-amber-300 rounded-sm p-6 mb-8 shadow-xs animate-in fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif-title font-bold text-lg text-stone-900">
              {isAdding ? "Aggiungi Nuovo Argomento d'Interesse" : "Modifica Argomento"}
            </h3>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="text-stone-400 hover:text-stone-700 text-sm font-bold"
            >
              ✕ Chiudi
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Categoria
              </label>
              <input
                type="text"
                placeholder="es. Archeologia Misteriosa, Fisica Quantistica, Cultura..."
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Priorità ({formPriority} di 5) {formPriority >= 4 ? "★ Alta (Inclusa nel Digest)" : ""}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formPriority}
                  onChange={(e) => setFormPriority(Number(e.target.value))}
                  className="w-full accent-[#8b1e1e]"
                />
                <span className="font-serif-title font-bold text-lg text-[#8b1e1e] w-6 text-center">
                  {formPriority}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Argomento / Titolo Tema *
            </label>
            <input
              type="text"
              placeholder="es. Megaliti sommersi e civiltà antidiluviane..."
              value={formTopic}
              onChange={(e) => setFormTopic(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Descrizione, Note & Direzione di Ricerca
            </label>
            <textarea
              rows={3}
              placeholder="Dettagli specifici su cosa vorresti leggere (es. Gunung Padang, datazioni LiDAR, teorie sull'agricoltura arcaica)..."
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Fonti Preferite di Riferimento
            </label>
            <input
              type="text"
              placeholder="es. Nature, Antiquity, Le Scienze, Archivi storici..."
              value={formSources}
              onChange={(e) => setFormSources(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="px-4 py-2 rounded bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs sm:text-sm font-semibold transition-colors"
            >
              Annulla
            </button>
            <button
              onClick={isAdding ? handleAddNew : handleSaveEdit}
              className="px-5 py-2 rounded bg-[#8b1e1e] hover:bg-[#721818] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
            >
              {isAdding ? "Aggiungi alla Lista" : "Salva Modifiche"}
            </button>
          </div>
        </div>
      )}

      {/* List of Interests */}
      <div className="space-y-3">
        {filteredInterests.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded p-12 text-center text-stone-500">
            <p className="text-base font-serif-body italic">
              Nessun argomento corrisponde ai filtri di ricerca impostati.
            </p>
          </div>
        ) : (
          filteredInterests.map((item) => {
            const isHighPriority = item.priority >= 4;

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-sm p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                  !item.enabled
                    ? "opacity-50 border-stone-200 bg-stone-50/50"
                    : isHighPriority
                    ? "border-amber-200 hover:border-amber-400 shadow-2xs"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {item.category}
                    </span>

                    {/* Priority badge */}
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${
                        isHighPriority
                          ? "bg-amber-100 text-amber-900 font-bold border border-amber-300"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      <Star
                        className={`w-3 h-3 ${
                          isHighPriority ? "fill-amber-500 text-amber-500" : "text-stone-400"
                        }`}
                      />
                      Priorità {item.priority}/5 {isHighPriority ? "(Alta - Focus Digest)" : ""}
                    </span>

                    {!item.enabled && (
                      <span className="text-[10px] uppercase font-bold text-stone-400">
                        Disattivato
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-serif-title font-bold text-stone-900 mb-1">
                    {item.topic}
                  </h3>

                  {item.description && (
                    <p className="text-sm font-sans text-stone-600 leading-relaxed mb-2">
                      {item.description}
                    </p>
                  )}

                  {item.sources && (
                    <div className="text-xs text-stone-500 italic">
                      Fonti: {item.sources}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleToggleEnable(item.id)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                      item.enabled
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                        : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                    }`}
                    title={item.enabled ? "Disattiva per il digest" : "Attiva per il digest"}
                  >
                    {item.enabled ? "Attivo" : "Inattivo"}
                  </button>

                  <button
                    onClick={() => handleStartEdit(item)}
                    className="p-1.5 rounded hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors"
                    title="Modifica argomento"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-stone-400 hover:text-red-700 transition-colors"
                    title="Elimina"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
