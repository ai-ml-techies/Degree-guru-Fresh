import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const AppBreadcrumb: React.FC<AppBreadcrumbProps> = ({
  items,
  className = "",
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs text-muted-foreground overflow-x-auto py-2.5 mb-4 select-none ${className}`}
    >
      <ol className="flex items-center gap-1.5 whitespace-nowrap">
        {/* Home Root */}
        <li className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-foreground transition-colors font-medium text-muted-foreground"
          >
            <Home size={13} className="shrink-0" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight size={12} className="text-muted-foreground/60 shrink-0" />
              {isLast || !item.href ? (
                <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="hover:text-foreground transition-colors font-medium text-muted-foreground truncate max-w-[160px] sm:max-w-[200px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default AppBreadcrumb;
