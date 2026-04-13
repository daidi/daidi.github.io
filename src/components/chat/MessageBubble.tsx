import { motion } from 'framer-motion';
import React from 'react';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  children?: React.ReactNode;
}

export function MessageBubble({ role, content, isStreaming, children }: MessageBubbleProps) {
  if (role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="flex justify-end"
      >
        <div className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-sm">
          {content}
        </div>
      </motion.div>
    );
  }

  // Assistant: plain text, no bubble background — like the reference
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-0"
    >
      {content && (
        <div className={`text-[15px] leading-relaxed text-foreground whitespace-pre-wrap ${isStreaming ? 'streaming-cursor' : ''}`}>
          {content}
        </div>
      )}
      {children}
    </motion.div>
  );
}
