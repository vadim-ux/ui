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

// Константы категорий - единое место для управления названиями
const CATEGORY_TITLES = {
    "diagrams": "Diagrams",
    "ebees": "eBees", 
    "icons": "Icons",
    "illustrations": "Illustrations",
    "logos": "Logos",
    "stickers": "Stickers",
    "templates": "Templates"
};

const CATEGORY_COLORS = {
    "diagrams": "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
    "ebees": "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
    "icons": "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300",
    "illustrations": "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
    "logos": "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300",
    "stickers": "bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300",
    "templates": "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
};

// Функция для получения названия категории
const getCategoryTitle = (category) => {
    return CATEGORY_TITLES[category] || category.charAt(0).toUpperCase() + category.slice(1);
};

// Функция для получения цвета категории  
const getCategoryColor = (category) => {
    return CATEGORY_COLORS[category] || "bg-gray-50 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300";
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
                    className="ml-3 text-white/80 hover:text-white transition-colors"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

// Loading skeleton component - SVGL style
function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center justify-center rounded-md border border-gray-200 dark:border-gray-800 p-4 w-[180px] h-[200px]">
                    {/* Image skeleton */}
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4 mt-2 shimmer"></div>
                    
                    {/* Content skeleton */}
                    <div className="flex flex-col items-center space-y-2 mb-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 shimmer"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16 shimmer"></div>
                    </div>
                    
                    {/* Buttons skeleton */}
                    <div className="flex items-center space-x-1">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded shimmer"></div>
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded shimmer"></div>
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded shimmer"></div>
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
                fixed lg:sticky top-16 left-0 h-screen w-56 bg-white dark:bg-gray-900 
                border-r border-gray-200 dark:border-gray-700 
                z-40 transform lg:transform-none transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 overflow-y-auto h-full">
                    {/* All categories */}
                    <button
                        onClick={() => onCategorySelect('all')}
                        className={`
                            w-full text-left px-3 py-2 rounded-lg transition-all duration-200
                            flex items-center justify-between mb-2
                            ${selectedCategory === 'all' 
                                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white font-medium' 
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
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
                            const info = categoryInfo[category] || { 
                                title: category.charAt(0).toUpperCase() + category.slice(1) // Автоматическая капитализация
                            };
                            const isSelected = selectedCategory === category;
                            
                            return (
                                <button
                                    key={category}
                                    onClick={() => onCategorySelect(category)}
                                    className={`
                                        w-full text-left px-3 py-2 rounded-lg transition-all duration-200
                                        flex items-center justify-between
                                        ${isSelected 
                                            ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white font-medium'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                        }
                                    `}
                                >
                                    <span>{info.title}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
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
    const [sortBy, setSortBy] = useState("a-z"); // "a-z" or "latest"
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header - full width */}
            <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Left side - Logo */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
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
                            <a 
                                href="https://github.com/vadim-ux/team-graphics-library-official"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                Github Library
                            </a>
                            <a 
                                href="https://github.com/vadim-ux/team-graphics-raycast-extension"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                Raycast Extension
                            </a>
                        </div>

                        {/* Right side - Theme toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {darkMode ? "🔅" : "🌙"}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main layout - 2 columns */}
            <div className="flex">
                {/* Sidebar */}
                <Sidebar 
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
                    totalAssets={assets.length}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main Content - right column */}
                <div className="flex-1 lg:ml-56">
                    <div className="p-6">
                        {/* Search */}
                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search graphics..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Sort bar */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => setSortBy(sortBy === "a-z" ? "latest" : "a-z")}
                                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                {sortBy === "a-z" ? "Sort A-Z" : "Sort by latest"}
                            </button>
                            <div></div> {/* Empty right side */}
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
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors btn-primary"
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
                                        className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden card-hover shadow-card dark:shadow-card-dark hover:shadow-card-hover dark:hover:shadow-card-dark-hover animate-scale-in"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        {/* Image Container */}
                                        <div className="relative aspect-square bg-gray-50 dark:bg-gray-700 p-6 flex items-center justify-center">
                                            <img
                                                src={asset.url}
                                                alt={asset.name}
                                                className="max-w-full max-h-full object-contain transition-transform duration-200 group-hover:scale-110"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextElementSibling.style.display = 'flex';
                                                }}
                                            />
                                            {/* Fallback when image fails */}
                                            <div className="hidden w-full h-full items-center justify-center text-gray-400 dark:text-gray-500">
                                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>

                                            {/* Action Overlay */}
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => copySvg(asset)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-all duration-200 btn-primary shadow-lg"
                                                        title="Copy SVG Code"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => copyUrl(asset)}
                                                        className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg transition-all duration-200 btn-primary shadow-lg"
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
                                                        className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition-all duration-200 btn-primary shadow-lg"
                                                        title="Open SVG"
                                                    >
                                                        <svg className="w-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
                                                {asset.name}
                                            </h3>
                                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                                <span>{asset.size}</span>
                                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                                    {categoryInfo[asset.category]?.title || asset.category}
                                                </span>
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
    );
}

// Render the app
ReactDOM.render(<TeamGraphicsLibrary />, document.getElementById('root'));