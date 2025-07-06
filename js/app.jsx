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
    },
    // Add more sample data as needed...
];

// Category information with proper SVGL-style colors and icons
const categoryInfo = {
    "diagrams": { 
        emoji: "📊", 
        title: "Diagrams", 
        description: "Charts, flowcharts, and data visualizations",
        color: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
    },
    "ebees": { 
        emoji: "🐝", 
        title: "eBees", 
        description: "All versions of eBee mascot",
        color: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
    },
    "icons": { 
        emoji: "❤️", 
        title: "Icons", 
        description: "UI icons and symbols",
        color: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
    },
    "illustrations": { 
        emoji: "🎨", 
        title: "Illustrations", 
        description: "Custom illustrations and artwork",
        color: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
    },
    "logos": { 
        emoji: "🍏", 
        title: "Logos", 
        description: "Brand logos and marks",
        color: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
    },
    "stickers": { 
        emoji: "📌", 
        title: "Stickers", 
        description: "Fun stickers and decorative elements",
        color: "bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300"
    },
    "templates": { 
        emoji: "📄", 
        title: "Templates", 
        description: "Design templates and layouts",
        color: "bg-gray-50 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300"
    }
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

// Loading skeleton component
function LoadingSkeleton() {
    return (
        <div className="graphics-grid">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 shimmer"></div>
                    <div className="p-4 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded shimmer"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 shimmer"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Sidebar component
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
            
            {/* Sidebar */}
            <div className={`
                fixed lg:sticky top-0 left-0 h-screen w-72 bg-white/80 dark:bg-gray-900/80 
                backdrop-blur-xl border-r border-gray-200/80 dark:border-gray-700/80 
                z-50 transform lg:transform-none transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Categories
                        </h2>
                        <button 
                            onClick={onClose}
                            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            ✕
                        </button>
                    </div>
                </div>
                
                <div className="p-4 space-y-1 overflow-y-auto h-full pb-20">
                    {/* All categories */}
                    <button
                        onClick={() => onCategorySelect('all')}
                        className={`
                            w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200
                            flex items-center justify-between group
                            ${selectedCategory === 'all' 
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                            }
                        `}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-lg">🎨</span>
                            <span className="font-medium">All Categories</span>
                        </div>
                        <span className={`
                            text-sm px-2 py-1 rounded-full
                            ${selectedCategory === 'all' 
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-800/50 dark:text-blue-300' 
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                            }
                        `}>
                            {totalAssets}
                        </span>
                    </button>

                    {/* Individual categories */}
                    {Object.entries(categories).map(([category, count]) => {
                        const info = categoryInfo[category] || { emoji: '📁', title: category, description: '' };
                        const isSelected = selectedCategory === category;
                        
                        return (
                            <button
                                key={category}
                                onClick={() => onCategorySelect(category)}
                                className={`
                                    w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200
                                    flex items-center justify-between group
                                    ${isSelected 
                                        ? info.color || 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                    }
                                `}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-lg">{info.emoji}</span>
                                    <div>
                                        <div className="font-medium">{info.title}</div>
                                        {info.description && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {info.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span className={`
                                    text-sm px-2 py-1 rounded-full
                                    ${isSelected 
                                        ? 'bg-white/50 dark:bg-black/20' 
                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                    }
                                `}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
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

    // Filter assets
    const filteredAssets = useMemo(() => {
        return assets.filter(asset => {
            const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [assets, searchTerm, selectedCategory]);

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
            {/* Sidebar */}
            <Sidebar 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
                totalAssets={assets.length}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 lg:ml-0">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-700/80">
                    <div className="px-4 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                                
                                <div className="flex items-center space-x-3">
                                    <img 
                                        src="https://raw.githubusercontent.com/vadim-ux/team-graphics-library-official/refs/heads/main/icons/library-logo-ebeejedi.png" 
                                        alt="Team Graphics Library" 
                                        className="w-8 h-8 object-contain"
                                    />
                                    <div>
                                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                            Team Graphics Library
                                        </h1>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {assets.length} graphics available
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                {/* Search */}
                                <div className="relative">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Search graphics... (⌘K)"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-64 px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all search-focus"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Dark mode toggle */}
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors btn-primary"
                                >
                                    {darkMode ? "☀️" : "🌙"}
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="px-4 lg:px-8 py-8">
                    {/* Results Info */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {selectedCategory === 'all' 
                                        ? 'All Graphics' 
                                        : categoryInfo[selectedCategory]?.title || selectedCategory
                                    }
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    {filteredAssets.length} {filteredAssets.length === 1 ? 'graphic' : 'graphics'} found
                                    {searchTerm && ` for "${searchTerm}"`}
                                </p>
                            </div>
                            
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <LoadingSkeleton />
                    ) : filteredAssets.length === 0 ? (
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
                            {filteredAssets.map((asset, index) => (
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
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                categoryInfo[asset.category]?.color || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                            }`}>
                                                {categoryInfo[asset.category]?.emoji} {categoryInfo[asset.category]?.title || asset.category}
                                            </span>
                                        </div>
                                        
                                        {/* Tags */}
                                        {asset.tags && asset.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {asset.tags.slice(0, 2).map(tag => (
                                                    <span 
                                                        key={tag}
                                                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {asset.tags.length > 2 && (
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                                        +{asset.tags.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mt-20">
                    <div className="px-4 lg:px-8 py-8">
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            <p className="mb-2">
                                Built with ❤️ • Inspired by{' '}
                                <a 
                                    href="https://svgl.app" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                >
                                    SVGL
                                </a>
                            </p>
                            <p className="text-sm">
                                MIT License •{' '}
                                <a 
                                    href="https://github.com/vadim-ux/team-graphics-library-official" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                >
                                    GitHub Repository
                                </a>
                            </p>
                        </div>
                    </div>
                </footer>
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