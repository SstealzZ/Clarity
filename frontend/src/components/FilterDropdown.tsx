import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

/**
 * Props for the FilterDropdown component
 */
interface FilterDropdownProps {
  label: string;
  items: string[];
  selectedItem: string | null;
  onSelect: (item: string | null) => void;
}

/**
 * Dropdown menu component for filtering articles by tags or countries
 * 
 * @param label Label for the dropdown button
 * @param items Array of items to display in the dropdown
 * @param selectedItem Currently selected item or null
 * @param onSelect Callback function when an item is selected
 */
const FilterDropdown = ({
  label,
  items,
  selectedItem,
  onSelect,
}: FilterDropdownProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="button-secondary flex items-center">
          <span>{label}: {selectedItem || 'Tous'}</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content 
          className="glass-panel p-2 min-w-[180px] max-h-[300px] overflow-y-auto"
          sideOffset={5}
        >
          <DropdownMenu.Item 
            className={`px-2 py-1.5 text-sm rounded cursor-pointer ${!selectedItem ? 'bg-primary/20 text-white' : 'text-white/80 hover:bg-surface hover:text-white'}`}
            onSelect={() => onSelect(null)}
          >
            Tous
          </DropdownMenu.Item>
          
          <DropdownMenu.Separator className="h-px bg-white/10 my-1" />
          
          {items.map((item) => (
            <DropdownMenu.Item 
              key={item} 
              className={`px-2 py-1.5 text-sm rounded cursor-pointer ${selectedItem === item ? 'bg-primary/20 text-white' : 'text-white/80 hover:bg-surface hover:text-white'}`}
              onSelect={() => onSelect(item)}
            >
              {item}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default FilterDropdown; 