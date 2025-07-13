// Updated React Application with SVGL-style layout
const { useState, useEffect, useMemo, useRef } = React;

// Sample data - fallback if GitHub fails
const sampleAssets = [
    {
        id: "ebee-main-1",
        name: "eBee Main Logo",
        category: "ebees",
        tags: ["mascot", "bee", "main"],
        url: "https://raw.githubusercontent.com/vadim-ux/team-graphics-library-official/main/png/ebees/ebee-main.png",
        svgUrl: "https://raw.githubusercontent.com/vadim-ux/team-graphics-library-official/main/svg/ebees/ebee-main.svg",
        size: "512x512"
    }
];

// Category information - simplified without emojis and descriptions
const categoryInfo = {
    "diagrams": { title: "Diagrams", color: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300" },
    "ebees": { title: "eBees", color: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300" },
    "icons": { title: "Icons", color: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300" },
    "logos": { title: "Logos", color: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300" },
    "stickers": { title: "Stickers", color: "bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300" },
    "templates": { title: "Templates", color: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300" }
};

// Toast component
function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' 
        ? 'bg-green-500 dark:bg-green-600' 
        : type === 'error' 
        ? 'bg-red-500 dark:bg-red-600'
        : 'bg-blue-500 dark:bg-blue-600';

    return (
        <div className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in max-w-sm`}>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{message}</span>
                <button 
                    onClick={onClose}
                    className="ml-3 text-white/80 hover:text-white"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

// Loading skeleton component
function LoadingSkeleton() {
    return (
        <div className="graphics-grid">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden">
                    <div className="aspect-square bg-gray-200 dark:bg-neutral-700 shimmer"></div>
                    <div className="p-4 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded shimmer"></div>
                        <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-2/3 shimmer"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Sidebar component - simplified
function Sidebar({ categories, selectedCategory, onCategorySelect, totalAssets, isOpen, onClose }) {
    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}
            
            {/* Sidebar - fixed width 224px */}
            <div className={`
                fixed top-0 md:top-[53px] md:left-0 h-screen md:h-[calc(100vh-63px)] w-full md:w-56 bg-white dark:bg-neutral-900 text-sm opacity-95 backdrop-blur-md 
                border-b border-neutral-200 dark:border-neutral-700 md:border-r 
                z-50 transform lg:transform-none 
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-1.5 pt-4 pl-2 pr-3 overflow-y-auto h-full">
                    {/* All categories */}
                    <button
                        onClick={() => onCategorySelect('all')}
                        className={`text-sm 
                            w-full text-left px-3 py-1 rounded-lg 
                            flex items-center justify-between mb-2
                            ${selectedCategory === 'all' 
                                ? 'bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-white font-medium' 
                                : 'text-sm text-neutral-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800/50'
                            }
                        `}
                    >
                        <span>All</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {totalAssets}
                        </span>
                    </button>

                    {/* Individual categories */}
                    <div className="space-y-1">
                        {Object.entries(categories).map(([category, count]) => {
                            const info = categoryInfo[category] || { title: category };
                            const isSelected = selectedCategory === category;
                            
                            return (
                                <button
                                    key={category}
                                    onClick={() => onCategorySelect(category)}
                                    className={`
                                        w-full text-left px-3 py-1 rounded-lg 
                                        flex items-center justify-between
                                        ${isSelected 
                                            ? 'bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-white font-medium'
                                            : 'text-sm text-neutral-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800/50'
                                        }
                                    `}
                                >
                                    <span>{info.title}</span>
                                    <span className="px-2.5 py-0.5 rounded-full font-medium bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hidden font-mono text-xs md:inline">
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
                {/* Footer note */}
                <div className="absolute bottom-4 left-0 w-full text-center text-xs text-neutral-400 dark:text-neutral-500 select-none">
                    <a href="https://svgl.app/" target="_blank" rel="noopener noreferrer">♥︎ Inspired by SVGL project</a>
                </div>
            </div>
        </>
    );
}

// Main App Component
function TeamGraphicsLibrary() {
    const [assets, setAssets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("a-z"); // "a-z", "latest", or "isovalent"
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('darkMode') === 'true' || 
                   (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const searchInputRef = useRef(null);

    // Load GitHub metadata
    useEffect(() => {
        const loadAssets = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    'https://raw.githubusercontent.com/vadim-ux/team-graphics-library-official/main/metadata.json'
                );
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                const transformedAssets = data.assets.map(asset => ({
                    id: asset.id,
                    name: asset.name,
                    category: asset.category,
                    tags: asset.tags || [],
                    url: asset.url,
                    svgUrl: asset.svgUrl || asset.url.replace('/png/', '/svg/').replace('.png', '.svg'),
                    size: asset.size || 'Unknown'
                }));
                
                setAssets(transformedAssets);
            } catch (error) {
                console.error("Error loading assets:", error);
                setAssets(sampleAssets);
                showToast("⚠️ Loading from GitHub failed, showing sample data", 'warning');
            } finally {
                setLoading(false);
            }
        };
        
        loadAssets();
    }, []);

    // Dark mode effect
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            if (e.key === 'Escape') {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Filter and sort assets
    const filteredAndSortedAssets = useMemo(() => {
        let filtered = assets.filter(asset => {
            const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        // Sort assets
        if (sortBy === "a-z") {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "latest") {
            // For now, reverse order as "latest" - you can implement proper date sorting
            filtered.reverse();
        } else if (sortBy === "isovalent") {
            filtered.sort((a, b) => {
                const aIso = a.tags.includes("isovalent");
                const bIso = b.tags.includes("isovalent");
                if (aIso && !bIso) return -1; // a comes first
                if (!aIso && bIso) return 1;  // b comes first
                return a.name.localeCompare(b.name); // otherwise alphabetical
            });
        }

        return filtered;
    }, [assets, searchTerm, selectedCategory, sortBy]);

    // Get categories with counts
    const categories = useMemo(() => {
        const cats = {};
        assets.forEach(asset => {
            cats[asset.category] = (cats[asset.category] || 0) + 1;
        });
        return cats;
    }, [assets]);

    // Toast functions
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const hideToast = () => {
        setToast(null);
    };

    // Copy functions
    const copySvg = async (asset) => {
        try {
            if (!asset.svgUrl || asset.svgUrl === '#') {
                showToast("⚠️ SVG not available", 'warning');
                return;
            }

            const response = await fetch(asset.svgUrl);
            if (!response.ok) {
                throw new Error(`SVG not found: ${response.status}`);
            }
            
            const svgContent = await response.text();
            if (!svgContent.trim().startsWith('<svg')) {
                throw new Error('Invalid SVG content');
            }
            
            await navigator.clipboard.writeText(svgContent);
            showToast(`✅ ${asset.name} SVG copied!`);
        } catch (error) {
            console.error("Error copying SVG:", error);
            showToast(`❌ Failed to copy SVG: ${error.message}`, 'error');
        }
    };

    const copyUrl = async (asset) => {
        try {
            await navigator.clipboard.writeText(asset.svgUrl);
            showToast(`🔗 ${asset.name} URL copied!`);
        } catch (error) {
            showToast("❌ Failed to copy URL", 'error');
        }
    };

    return (
                    <div className="app-wrapper">
                        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
                        <div className="min-h-screen dark:bg-neutral-900 bg-white">
                            {/* Header - full width */}
                            <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700">
                                <div className="p-1.5">
                                    <div className="flex items-center justify-between">
                                        {/* Left side - Logo */}
                                        <div className="flex items-center space-x-4">
                                            <button
                                                onClick={() => setSidebarOpen(prev => !prev)}
                                                className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                                </svg>
                                            </button>
                                            <img
                                                src="https://raw.githubusercontent.com/vadim-ux/team-graphics-library-official/refs/heads/main/icons/library-logo-ebeejedi.png"
                                                alt="Team Graphics Library"
                                                className="w-8 h-8 object-contain"
                                            />
                                        </div>
                                        {/* Center - Links */}
                                        <div className="hidden md:flex items-center space-x-6">
                                            <div className="flex items-center divide-x divide-dashed divide-neutral-300 dark:divide-neutral-700">
                                            <a
                                                href="https://github.com/vadim-ux/team-graphics-library-official"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center font-normal dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white md:pr-3"
                                            >
                                                <svg
                                                className="w-4 h-4 mr-2 text-gray-800 dark:text-white"
                                                viewBox="0 0 14 14"
                                                fill="currentColor"
                                                aria-hidden="true"
                                                >
                                                {/* из файла github.svg скопируйте только <path …/> */}
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.00578 0C3.13177 0 0 3.20834 0 7.17747C0 10.3502 2.00663 13.0359 4.79036 13.9864C5.1384 14.0578 5.26587 13.832 5.26587 13.642C5.26587 13.4755 5.2544 12.9053 5.2544 12.3109C3.30557 12.7388 2.89974 11.4554 2.89974 11.4554C2.58655 10.6235 2.1225 10.4097 2.1225 10.4097C1.48465 9.97004 2.16896 9.97004 2.16896 9.97004C2.87651 10.0176 3.24778 10.7068 3.24778 10.7068C3.87401 11.7999 4.88314 11.4911 5.28911 11.3009C5.34705 10.8375 5.53275 10.5166 5.72993 10.3384C4.17559 10.172 2.54023 9.55412 2.54023 6.79714C2.54023 6.01285 2.81842 5.37119 3.25924 4.87214C3.1897 4.69393 2.94605 3.95704 3.32894 2.97077C3.32894 2.97077 3.92047 2.78061 5.25426 3.70752C5.8253 3.55041 6.4142 3.47048 7.00578 3.46981C7.59731 3.46981 8.20032 3.55308 8.75715 3.70752C10.0911 2.78061 10.6826 2.97077 10.6826 2.97077C11.0655 3.95704 10.8217 4.69393 10.7522 4.87214C11.2046 5.37119 11.4713 6.01285 11.4713 6.79714C11.4713 9.55412 9.83597 10.1601 8.27001 10.3384C8.52527 10.5642 8.74554 10.9919 8.74554 11.6693C8.74554 12.6318 8.73406 13.4042 8.73406 13.6419C8.73406 13.832 8.86169 14.0578 9.20959 13.9865C11.9933 13.0357 14 10.3502 14 7.17747C14.0114 3.20834 10.8682 0 7.00578 0Z"/>
                                                </svg>
                                                <span>Github Library</span>
                                            </a>
                                            <a
                                                href="https://github.com/vadim-ux/team-graphics-raycast-extension"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center font-normal dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white md:pl-3"
                                            >
                                                <img src="https://raw.githubusercontent.com/vadim-ux/team-graphics-library-official/e3a86ec88c39f6ea46d5badb46cf3edef658887e/logos/raycast.svg" alt="Raycast" className="w-4 h-4 mr-2" />
                                                <span>Raycast Extension</span>
                                            </a>
                                            </div>
                                            <div className="flex items-center space-x-4 md:pr-3">
                                            <button
                                            onClick={() => setDarkMode(!darkMode)}
                                            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                        >
                                            {darkMode ? "🔅" : "🌙"}
                                            </button>
                                            </div>
                                           
                                        </div>
                                        {/* Right side - Theme toggle */}
                                    </div>
                                </div>
                            </header>
                            {/* Mobile horizontal categories */}
                            <nav className="md:hidden flex items-center space-x-2 overflow-x-auto px-4 py-2 border-b border-neutral-200 dark:border-neutral-700 backdrop-blur-md bg-white/90 dark:bg-neutral-900/90">
                                {/* All */}
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`flex-shrink-0 px-3 py-1 rounded-lg text-sm whitespace-nowrap ${selectedCategory === 'all' ? 'bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800/50'}`}
                                >
                                    All
                                </button>
                                {Object.entries(categories).map(([cat, count]) => {
                                    const info = categoryInfo[cat] || { title: cat };
                                    const isSel = selectedCategory === cat;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`flex-shrink-0 px-3 py-1 rounded-lg text-sm whitespace-nowrap ${isSel ? 'bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800/50'}`}
                                        >
                                            {info.title}
                                        </button>
                                    );
                                })}
                            </nav>

                            {/* Main layout - 2 columns */}
                            <div className="flex">
                                {/* Sidebar */}
                                <Sidebar
                                    className="hidden md:block"
                                    categories={categories}
                                    selectedCategory={selectedCategory}
                                    onCategorySelect={setSelectedCategory}
                                    totalAssets={assets.length}
                                    isOpen={sidebarOpen}
                                    onClose={() => setSidebarOpen(false)}
                                />
                                {/* Main Content - right column */}
                                <div className="flex-1 ml-0 pb-6 lg:ml-56">
                                    {/* Search (sticky) */}
                                    <div className="relative w-full sticky top-[53px] z-20 bg-white/90 backdrop-blur-md dark:bg-neutral-900/90">
                                        <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                placeholder="Search graphics..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full px-4 py-3 pl-10 bg-white dark:bg-neutral-800 border-b border-neutral-300 dark:border-neutral-600 text-gray-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400  focus:border-transparent"
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-6 text-neutral-500">
                                                <div className="flex h-full items-center pointer-events-none gap-x-1 font-mono">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon lucide lucide-command"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path></svg>
                                                <span>K</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        {/* Sort bar */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div></div> {/* Empty right side */}
                                            <button
                                                onClick={() => setSortBy(sortBy === "a-z" ? "latest" : sortBy === "latest" ? "isovalent" : "a-z")}
                                                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 pr-2"
                                            >
                                                {sortBy === "a-z" ? "Sort A-Z" : sortBy === "latest" ? "Sort by latest" : "Isovalent first"}
                                            </button>
                        
                                        </div>
                                        {/* Loading State */}
                                        {loading ? (
                                            <LoadingSkeleton />
                                        ) : filteredAndSortedAssets.length === 0 ? (
                                            /* Empty State */
                                            <div className="text-center py-20">
                                                <div className="text-6xl mb-4">🔍</div>
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                    No graphics found
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                                    {searchTerm
                                                        ? `Try adjusting your search term or browse different categories`
                                                        : `No graphics available in this category yet`
                                                    }
                                                </p>
                                                {searchTerm && (
                                                    <button
                                                        onClick={() => setSearchTerm('')}
                                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                                    >
                                                        Clear search
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            /* Graphics Grid */
                                            <div className="graphics-grid animate-fade-in">
                                                {filteredAndSortedAssets.map((asset, index) => (
                                                    <div
                                                        key={asset.id}
                                                        className="group bg-white dark:bg-neutral-800 rounded-md border border-gray-200 dark:border-neutral-700 overflow-hidden"
                                                        style={{ animationDelay: `${index * 50}ms` }}
                                                    >
                                                        {/* Image Container */}
                                                        <div className="relative aspect-square bg-checkerboard p-6 flex items-center justify-center">
                                                            <img
                                                                src={asset.url}
                                                                alt={asset.name}
                                                                className="max-w-full max-h-full object-contain"
                                                                loading="lazy"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextElementSibling.style.display = 'flex';
                                                                }}
                                                            />
                                                            {/* Fallback when image fails */}
                                                            <div className="hidden w-full h-full items-center justify-center text-gray-400 dark:text-gray-500">
                                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                        
                                                        {/* Content */}
                                                        <div className="p-4 relative" style={{minHeight: '68px'}}>
                                                             {/* Text content - fades out on hover */}
                                                             <div className="group-hover:opacity-0">
                                                                 <h2 className="font-semibold text-gray-900 text-sm dark:text-white truncate mb-1">
                                                                     {asset.name}
                                                                 </h2>
                                                                 <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
                                                                     <span className="text-xs text-neutral-400 dark:text-neutral-500">
                                                                         {categoryInfo[asset.category]?.title || asset.category}
                                                                     </span>
                                                                 </div>
                                                             </div>

                                                             {/* Action icons - fade in on hover */}
                                                             <div className="absolute inset-0 p-4 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                                                                 <div className="flex space-x-2">
                                                                     <button
                                                                         onClick={() => copySvg(asset)}
                                                                         className="hover:bg-neutral-100/80 dark:hover:bg-neutral-300/10 text-neutral-500 dark:text-neutral-400 p-3 rounded-[0.4vw]"
                                                                         title="Copy SVG Code"
                                                                     >
                                                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                         </svg>
                                                                     </button>
                                                                     <button
                                                                         onClick={() => copyUrl(asset)}
                                                                         className="hover:bg-neutral-100/80 dark:hover:bg-neutral-300/10 text-neutral-500 dark:text-neutral-400 p-3 rounded-[0.4vw]"
                                                                         title="Copy URL"
                                                                     >
                                                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                                         </svg>
                                                                     </button>
                                                                     <a
                                                                         href={asset.svgUrl}
                                                                         target="_blank"
                                                                         rel="noopener noreferrer"
                                                                         className="hover:bg-neutral-100/80 dark:hover:bg-neutral-300/10 text-neutral-500 dark:text-neutral-400 p-3 rounded-[0.4vw]"
                                                                         title="Open SVG"
                                                                     >
                                                                         <svg className="w-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                         </svg>
                                                                     </a>
                                                                 </div>
                                                             </div>
                                                         </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Toast */}
                            {toast && (
                                <Toast
                                    message={toast.message}
                                    type={toast.type}
                                    onClose={hideToast}
                                />
                            )}
                        </div>
                        </div>
                    </div>
    );
}

// Render the app
ReactDOM.render(<TeamGraphicsLibrary />, document.getElementById('root'));