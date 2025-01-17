import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DescriptionAutosuggestProps {
  value: string;
  onChange: (value: string) => void;
}

export function DescriptionAutosuggest({ value, onChange }: DescriptionAutosuggestProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchSuggestions() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !value.trim()) {
        setSuggestions([]);
        return;
      }

      const { data } = await supabase
        .from('transactions')
        .select('description')
        .eq('user_id', user.id)
        .ilike('description', `%${value}%`)
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) {
        const uniqueDescriptions = Array.from(new Set(data.map(t => t.description)));
        setSuggestions(uniqueDescriptions);
        setSelectedIndex(-1);
      }
    }

    fetchSuggestions();
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          onChange(suggestions[selectedIndex]);
          setShowSuggestions(false);
          setSelectedIndex(-1);
          textareaRef.current?.blur();
        }
        break;

      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        textareaRef.current?.blur();
        break;

      default:
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="form-field">
      <label className="input-label">Descrição</label>
      <div className="mt-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-neon-blue" />
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          rows={2}
          className="form-textarea pl-10"
          placeholder="Digite a descrição da transação..."
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="cyber-dropdown">
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => {
                  onChange(suggestion);
                  setShowSuggestions(false);
                  setSelectedIndex(-1);
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`cyber-dropdown-item ${
                  index === selectedIndex ? 'active' : ''
                }`}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}