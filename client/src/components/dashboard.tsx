"use client"

import { useState, useEffect, useRef } from "react"
import { User, Search } from "lucide-react"
import { Link } from "react-router-dom"
import Map, { NavigationControl } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"

const categories = [
  "Taniec",
  "Malarstwo",
  "Garncarstwo",
  "Gotowanie",
  "Gra na instrumencie",
  "Modelarstwo",
  "Fotografia",
  "Ogrodnictwo",
  "Krawiectwo",
  "Stolarstwo",
  "Zeglarstwo",
  "Nurkowanie",
]

const danceSubcategories = ["Bachata", "Towarzyski", "Pole Dance", "Jazz", "Modern"]

export function Dashboard() {
  const [mode, setMode] = useState<"lekcja" | "warsztaty">("lekcja")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [showSubcategories, setShowSubcategories] = useState(false)
  const subcategoryRef = useRef<HTMLDivElement>(null)

  const categoryBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      // Nie zamykaj jesli kliknieto w pasek kategorii lub podkategorii
      if (
        subcategoryRef.current?.contains(target) ||
        categoryBarRef.current?.contains(target)
      ) {
        return
      }
      setShowSubcategories(false)
    }

    if (showSubcategories) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [showSubcategories])

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    if (category === "Taniec") {
      setShowSubcategories(true)
      setSelectedSubcategory(null)
    } else {
      setShowSubcategories(false)
      setSelectedSubcategory(null)
    }
  }

  const handleSubcategoryClick = (subcategory: string) => {
    setSelectedSubcategory(subcategory)
    setShowSubcategories(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            Platform
          </Link>

          {/* Toggle Switch */}
          <div className="flex items-center rounded-full bg-muted p-1">
            <button
              onClick={() => setMode("lekcja")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                mode === "lekcja"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Lekcja
            </button>
            <button
              onClick={() => setMode("warsztaty")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                mode === "warsztaty"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Warsztaty
            </button>
          </div>

          {/* Search & User Icon */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Szukaj..."
                className="h-10 w-48 rounded-full border border-border bg-muted pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Link
              to="/login"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted transition-colors hover:bg-secondary hover:border-primary/30"
            >
              <User className="h-5 w-5 text-primary" />
            </Link>
          </div>
        </div>
      </header>

      {/* Category Bar */}
      <div ref={categoryBarRef} className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex gap-3 overflow-x-auto py-4 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subcategory Bar (Conditional) */}
      {showSubcategories && selectedCategory === "Taniec" && (
        <div ref={subcategoryRef} className="border-b border-border bg-secondary">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex gap-3 overflow-x-auto py-3 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {danceSubcategories.map((subcategory) => (
                <button
                  key={subcategory}
                  onClick={() => handleSubcategoryClick(subcategory)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    selectedSubcategory === subcategory
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card text-secondary-foreground border border-border hover:bg-muted"
                  }`}
                >
                  {subcategory}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="mx-auto max-w-7xl p-4">
        <div className="h-[600px] w-full overflow-hidden rounded-xl shadow-lg">
          <Map
            initialViewState={{
              longitude: 19.9449,
              latitude: 50.0646,
              zoom: 13,
              pitch: 60,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
          >
            <NavigationControl position="top-right" />
          </Map>
        </div>
      </div>
    </div>
  )
}
