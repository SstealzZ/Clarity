import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Props for the DatePicker component
 */
interface DatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  label?: string;
}

/**
 * Simple minimalist DatePicker component
 * 
 * @param date Currently selected date
 * @param onDateChange Callback when date changes
 * @param label Label to display when no date is selected
 */
export function DatePicker({ date, onDateChange, label = 'Filtrer par date' }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(date || new Date());
  
  // Fonction pour avancer au mois suivant
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Fonction pour reculer au mois précédent
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Fonction pour sélectionner une date
  const selectDate = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateChange(newDate);
    setOpen(false);
  };
  
  // Fonction pour réinitialiser la date
  const resetDate = () => {
    onDateChange(undefined);
    setOpen(false);
  };
  
  // Générer les jours du mois actuel
  const generateCalendarDays = () => {
    // Obtenez le premier jour du mois et le nombre de jours dans le mois
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Obtenez l'index du jour de la semaine (0 = dimanche, 6 = samedi)
    // Ajustez pour que lundi soit le premier jour (1 devient 0, 2 devient 1, etc.)
    let firstDayIndex = firstDayOfMonth.getDay();
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    
    const days = [];
    
    // Jours vides du mois précédent
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="py-1"></div>);
    }
    
    // Jours du mois actuel
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth.getMonth() && 
                           today.getFullYear() === currentMonth.getFullYear();
    const todayDate = today.getDate();
    
    const isSelectedMonth = date && date.getMonth() === currentMonth.getMonth() &&
                           date.getFullYear() === currentMonth.getFullYear();
    const selectedDate = date ? date.getDate() : null;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === todayDate;
      const isSelected = isSelectedMonth && day === selectedDate;
      
      days.push(
        <div key={day} className="py-1">
          <button
            onClick={() => selectDate(day)}
            className={`
              w-6 h-6 rounded-full flex items-center justify-center text-xs
              ${isToday ? 'font-bold text-[#FF6B7A]' : 'text-white/80'} 
              ${isSelected ? 'bg-white text-[#181620] hover:bg-white/90' : 'hover:bg-[#232133]'}
              focus:outline-none
            `}
          >
            {day}
          </button>
        </div>
      );
    }
    
    return days;
  };
  
  const days = generateCalendarDays();
  
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="flex items-center justify-between h-10 gap-2 bg-[#232133] hover:bg-[#2f2b42] px-4 py-2 text-white rounded-lg border border-white/10 backdrop-blur-sm transition-colors focus:outline-none w-full">
          <span className="text-sm font-normal truncate">
            {date ? format(date, 'dd MMMM yyyy', { locale: fr }) : label}
          </span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </Popover.Trigger>
      
      <Popover.Content className="bg-[#181620] rounded-lg shadow-xl z-50 w-[180px] overflow-hidden">
        <div className="flex flex-col">
          {/* Entête avec le mois et les flèches de navigation */}
          <div className="p-3 flex items-center justify-between border-b border-white/10">
            <button 
              onClick={prevMonth} 
              className="text-white hover:text-white/70 focus:outline-none"
            >
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 1L1 6L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="text-sm font-medium text-white">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </span>
            <button 
              onClick={nextMonth}
              className="text-white hover:text-white/70 focus:outline-none"
            >
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 text-center text-xs text-white/60 pt-2 px-2">
            <div>lu</div>
            <div>ma</div>
            <div>me</div>
            <div>je</div>
            <div>ve</div>
            <div>sa</div>
            <div>di</div>
          </div>
          
          {/* Jours du mois */}
          <div className="p-2">
            <div className="grid grid-cols-7 gap-y-1 text-center">
              {days}
            </div>
          </div>
          
          {/* Bouton réinitialiser */}
          {date && (
            <button
              onClick={resetDate}
              className="p-2 w-full text-sm text-center text-white/80 hover:text-white bg-transparent hover:bg-[#232133] transition-colors border-t border-white/10"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
} 