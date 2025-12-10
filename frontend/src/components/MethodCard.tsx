import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

type MethodCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  isActive?: boolean;
  onClick?: () => void;
  delay?: number;
};

export function MethodCard({
  title,
  description,
  icon: Icon,
  color,
  isActive = false,
  onClick,
  delay = 0,
}: MethodCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-xl p-4 transition-all duration-300
        ${isActive 
          ? "glass-strong border-white/20 shadow-lg" 
          : "glass border-white/5 hover:border-white/10"
        }
      `}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeMethod"
          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${color} opacity-10`}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center transition-all
            ${isActive 
              ? `bg-gradient-to-br ${color}` 
              : "bg-white/5"
            }
          `}>
            <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-white/60"}`} />
          </div>
          {isActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50"
            />
          )}
        </div>
        
        <h3 className={`text-sm font-semibold mb-1 ${isActive ? "text-white" : "text-white/80"}`}>
          {title}
        </h3>
        <p className={`text-xs leading-relaxed ${isActive ? "text-white/70" : "text-white/50"}`}>
          {description}
        </p>
      </div>
    </motion.div>
  );
}
