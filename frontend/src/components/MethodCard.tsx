import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type MethodCardProps = {
  title: string;
  description: string;
  icon: ReactNode | LucideIcon;
};

export function MethodCard({ title, description, icon }: MethodCardProps) {
  const IconComp = icon as LucideIcon;
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass rounded-xl border border-white/5 p-4"
    >
      <div className="flex items-center gap-3">
        {typeof icon === "function" ? (
          <IconComp className="h-5 w-5 text-white/80" />
        ) : (
          icon
        )}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-white/70">{description}</p>
    </motion.div>
  );
}

