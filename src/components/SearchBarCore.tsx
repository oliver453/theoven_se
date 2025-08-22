"use client";

import { MagnifyingGlass } from "@/components/icons/icons";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { client } from "@/lib/sanity";
import { queries } from "@/lib/sanity/queries";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
}

interface SearchSuggestion {
  articles: Array<{
    title: string;
    slug: { current: string };
    category?: { title: string; slug: { current: string } };
  }>;
  categories: Array<{ title: string; slug: { current: string } }>;
}

export default function SearchBarCore({
  onSearch,
  placeholder = "Sök efter artiklar...",
  showSuggestions = true,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [suggestions, setSuggestions] = useState<SearchSuggestion>({
    articles: [],
    categories: [],
  });
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestionsList(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(
    async (searchTerm: string) => {
      if (!showSuggestions || searchTerm.length < 1) {
        setSuggestions({ articles: [], categories: [] });
        setShowSuggestionsList(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await client.fetch(queries.searchSuggestions, {
          searchTerm,
        });
        setSuggestions(results || { articles: [], categories: [] });
        setShowSuggestionsList(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions({ articles: [], categories: [] });
      }
      setIsLoading(false);
    },
    [showSuggestions],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    if (selectedIndex >= 0) {
      const allSuggestions = [
        ...suggestions.articles.map((a) => ({ type: "article", ...a })),
        ...suggestions.categories.map((c) => ({ type: "category", ...c })),
      ];
      const selectedItem = allSuggestions[selectedIndex];

      if (selectedItem) {
        if (selectedItem.type === "article") {
          router.push(`/article/${selectedItem.slug.current}`);
        } else {
          router.push(`/category/${selectedItem.slug.current}`);
        }
        setShowSuggestionsList(false);
        return;
      }
    }

    if (trimmedQuery) {
      setShowSuggestionsList(false);
      if (onSearch) {
        onSearch(trimmedQuery);
      } else {
        router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(newQuery);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestionsList) {
      if (e.key === "Enter") {
        handleSubmit(e as any);
      }
      return;
    }

    const allSuggestions = [
      ...suggestions.articles.map((a) => ({ type: "article", ...a })),
      ...suggestions.categories.map((c) => ({ type: "category", ...c })),
    ];

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < allSuggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        handleSubmit(e as any);
        break;
      case "Escape":
        setShowSuggestionsList(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (type: string, slug: string) => {
    setShowSuggestionsList(false);
    if (type === "article") {
      router.push(`/article/${slug}`);
    } else {
      router.push(`/category/${slug}`);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions({ articles: [], categories: [] });
    setShowSuggestionsList(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;

    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi",
    );
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="font-semibold text-accent">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const allSuggestions = [
    ...suggestions.articles.map((a) => ({ type: "article", ...a })),
    ...suggestions.categories.map((c) => ({ type: "category", ...c })),
  ];

  return (
    <div className="relative mx-auto max-w-2xl" ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <MagnifyingGlass className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-foreground/60" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 1 && setShowSuggestionsList(true)}
            placeholder={placeholder}
            className="search-input w-full rounded-lg border border-sage/30 bg-sage/20 py-4 pl-12 pr-12 text-lg text-foreground placeholder:text-foreground/60 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 flex h-5 w-5 -translate-y-1/2 transform items-center justify-center text-foreground/60 hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions &&
        showSuggestionsList &&
        (suggestions.articles.length > 0 ||
          suggestions.categories.length > 0) && (
          <div className="absolute z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-lg border border-foreground/20 bg-background text-left shadow-lg">
            {isLoading && (
              <div className="px-4 py-3 text-foreground/60">Söker...</div>
            )}

            {!isLoading && (
              <>
                {suggestions.categories.length > 0 && (
                  <div>
                    <div className="border-b border-foreground/10 bg-foreground/5 px-4 py-2 text-sm font-semibold text-foreground/60">
                      Kategorier
                    </div>
                    {suggestions.categories.map((category, index) => {
                      const globalIndex = index;
                      return (
                        <div
                          key={category.slug.current}
                          className={`cursor-pointer border-b border-foreground/5 px-4 py-3 last:border-b-0 hover:bg-foreground/5 ${
                            selectedIndex === globalIndex ? "bg-accent/10" : ""
                          }`}
                          onClick={() =>
                            handleSuggestionClick(
                              "category",
                              category.slug.current,
                            )
                          }
                        >
                          <div className="font-medium text-foreground">
                            {highlightMatch(category.title, query)}
                          </div>
                          <div className="text-sm text-foreground/60">
                            Kategori
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {suggestions.articles.length > 0 && (
                  <div>
                    <div className="border-b border-foreground/10 bg-foreground/5 px-4 py-2 text-sm font-semibold text-foreground/60">
                      Artiklar
                    </div>
                    {suggestions.articles.map((article, index) => {
                      const globalIndex = suggestions.categories.length + index;
                      return (
                        <div
                          key={article.slug.current}
                          className={`cursor-pointer border-b border-foreground/5 px-4 py-3 last:border-b-0 hover:bg-foreground/5 ${
                            selectedIndex === globalIndex ? "bg-accent/10" : ""
                          }`}
                          onClick={() =>
                            handleSuggestionClick(
                              "article",
                              article.slug.current,
                            )
                          }
                        >
                          <div className="line-clamp-1 font-medium text-foreground">
                            {highlightMatch(article.title, query)}
                          </div>
                          {article.category && (
                            <div className="text-sm text-foreground/60">
                              {article.category.title}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div
                  className={`cursor-pointer border-t border-foreground/10 px-4 py-3 hover:bg-foreground/5 ${
                    selectedIndex === allSuggestions.length
                      ? "bg-accent/10"
                      : ""
                  }`}
                  onClick={() => {
                    setShowSuggestionsList(false);
                    if (onSearch) {
                      onSearch(query.trim());
                    } else {
                      router.push(
                        `/search?q=${encodeURIComponent(query.trim())}`,
                      );
                    }
                  }}
                >
                  <div className="flex items-center text-accent">
                    <MagnifyingGlass className="mr-2 h-4 w-4" />
                    Sök efter "{query}" i alla artiklar
                  </div>
                </div>
              </>
            )}
          </div>
        )}

      {showSuggestions &&
        showSuggestionsList &&
        !isLoading &&
        suggestions.articles.length === 0 &&
        suggestions.categories.length === 0 &&
        query.length >= 1 && (
          <div className="absolute z-50 mt-2 w-full rounded-lg border border-foreground/20 bg-background shadow-lg">
            <div className="px-4 py-3 text-foreground/60">
              Inga förslag hittades för "{query}"
            </div>
            <div
              className="cursor-pointer border-t border-foreground/10 px-4 py-3 text-accent hover:bg-foreground/5"
              onClick={() => {
                setShowSuggestionsList(false);
                if (onSearch) {
                  onSearch(query.trim());
                } else {
                  router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                }
              }}
            >
              <div className="flex items-center">
                <MagnifyingGlass className="mr-2 h-4 w-4" />
                Sök ändå efter "{query}"
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
