import { Suspense } from "react";
import { MagnifyingGlass } from "@/components/icons/icons";
import SearchBarCore from "./SearchBarCore";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
}

export default function SearchBar(props: SearchBarProps) {
  return (
    <Suspense
      fallback={
        <div className="relative mx-auto max-w-2xl">
          <div className="relative">
            <MagnifyingGlass className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-foreground/40" />
            <div className="w-full rounded-lg border border-foreground/20 bg-background py-4 pl-12 pr-12 text-lg">
              <div className="h-6 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      }
    >
      <SearchBarCore {...props} />
    </Suspense>
  );
}
