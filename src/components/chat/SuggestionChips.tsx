import { motion } from 'framer-motion';

export interface Suggestion {
  id: string;
  label: string;
}

export function SuggestionChips({
  suggestions,
  onSelect
}: {
  suggestions: Suggestion[];
  onSelect: (item: Suggestion) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex flex-wrap gap-2 justify-end"
    >
      {suggestions.map((suggestion, i) => (
        <motion.button
          key={suggestion.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 400, damping: 25 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onSelect(suggestion)}
          className="px-4 py-2 text-xs font-medium rounded-full bg-card border border-border text-foreground shadow-sm hover:bg-input transition-colors select-none"
        >
          {suggestion.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
