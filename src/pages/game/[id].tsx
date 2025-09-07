import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Icons from "heroicons-react";
import clsx from "clsx";
import { gameService, Game, ApiError } from "../../services/api";
import Snackbar from "../../components/Snackbar";

const DEBUG = true;

export default function GameDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info'
  });

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchGame();
    }
  }, [id]);

  const fetchGame = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await gameService.getGame(id as string);
      setGame(data);
    } catch (err) {
      console.error('Error fetching game:', err);
      if (err instanceof ApiError) {
        setError(err);
      } else {
        setError(new ApiError('An unexpected error occurred. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    router.push('/');
  };

  const handleSteamClick = () => {
    showSnackbar("Steam integration coming soon! 🎮", "info");
  };

  const handleRetry = () => {
    fetchGame();
  };

  const showSnackbar = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setSnackbar({ show: true, message, type });
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, show: false }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={handleBackClick}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <Icons.ArrowLeft size={20} className="mr-2" />
                Back to Games
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Game Details</h1>
              <div></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              {error.code === 'NETWORK_ERROR' ? (
                <Icons.Wifi size={48} className="mx-auto mb-4 text-yellow-500" />
              ) : error.code === 'TIMEOUT' ? (
                <Icons.Clock size={48} className="mx-auto mb-4 text-orange-500" />
              ) : (
                <Icons.Exclamation size={48} className="mx-auto mb-4 text-red-500" />
              )}

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {error.code === "NETWORK_ERROR" ? "Network Error" :
                  error.code === "TIMEOUT" ? "Request Timeout" :
                    "Error Loading Game"}
              </h1>

              <p className="text-gray-600 mb-6">{error.message}</p>

              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleBackClick}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Back to Games
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={handleBackClick}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <Icons.ArrowLeft size={20} className="mr-2" />
                Back to Games
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Game Details</h1>
              <div></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <Icons.QuestionMarkCircle size={48} className="mx-auto mb-4 text-gray-400" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Game Not Found</h1>
              <p className="text-gray-600 mb-6">The game you&apos;re looking for doesn&apos;t exist or has been removed.</p>
              <button
                onClick={handleBackClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Back to Games
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: string) => {
    if (price === "0.00") return "Free";
    return `$${price}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "TBA";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBackClick}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <Icons.ArrowLeft size={20} className="mr-2" />
              Back to Games
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Game Details</h1>
            <button
              onClick={handleSteamClick}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Icons.ExternalLink size={16} className="mr-2" />
              View on Steam
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative">
            <img
              src={game.headerImage}
              alt={game.title}
              className="w-full h-96 object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/1200x400?text=No+Image";
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h1 className="text-4xl font-bold mb-2">{game.title}</h1>
              {game.shortDescription && (
                <p className="text-xl opacity-90">{game.shortDescription}</p>
              )}
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Game</h2>
                  <p className="text-gray-700 leading-relaxed">{game.description}</p>
                </div>

                {/* System Requirements */}
                {game.systemRequirements && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">System Requirements</h2>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Minimum</h3>
                      <div className="space-y-2 text-sm text-gray-700">
                        {game.systemRequirements.minimum?.os && (
                          <div><strong>OS:</strong> {game.systemRequirements.minimum.os}</div>
                        )}
                        {game.systemRequirements.minimum?.processor && (
                          <div><strong>Processor:</strong> {game.systemRequirements.minimum.processor}</div>
                        )}
                        {game.systemRequirements.minimum?.memory && (
                          <div><strong>Memory:</strong> {game.systemRequirements.minimum.memory}</div>
                        )}
                        {game.systemRequirements.minimum?.graphics && (
                          <div><strong>Graphics:</strong> {game.systemRequirements.minimum.graphics}</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Categories */}
                {game.categories && game.categories.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Categories</h2>
                    <div className="flex flex-wrap gap-2">
                      {game.categories.map((category: string, index: number) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {game.languages && game.languages.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Languages</h2>
                    <div className="flex flex-wrap gap-2">
                      {game.languages.map((language: string, index: number) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Purchase Card */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-center">
                    {game.isFree ? (
                      <div className="text-3xl font-bold text-green-600 mb-2">Free</div>
                    ) : (
                      <div className="mb-2">
                        {game.discountPercent > 0 && (
                          <div className="text-sm text-gray-500 line-through mb-1">
                            ${game.originalPrice}
                          </div>
                        )}
                        <div className="text-3xl font-bold text-orange-600">
                          {formatPrice(game.price)}
                        </div>
                        {game.discountPercent > 0 && (
                          <div className="text-sm text-green-600 font-medium">
                            {game.discountPercent}% off
                          </div>
                        )}
                      </div>
                    )}
                    <button
                      onClick={handleSteamClick}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-3"
                    >
                      {game.isFree ? 'Play Now' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={handleSteamClick}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      View on Steam Store
                    </button>
                  </div>
                </div>

                {/* Game Info */}
                <div className="bg-white border rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Game Information</h3>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Developer</div>
                      <div className="font-medium">
                        {game.developer?.replace('Developer:', '').trim() || 'Unknown'}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">Publisher</div>
                      <div className="font-medium">
                        {game.publisher?.replace('Publisher:', '').trim() || 'Unknown'}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">Release Date</div>
                      <div className="font-medium">{formatDate(game.releaseDate)}</div>
                    </div>

                    {game.metacriticScore && (
                      <div>
                        <div className="text-sm text-gray-500">Metacritic Score</div>
                        <div className="flex items-center space-x-2">
                          <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                            {game.metacriticScore}
                          </div>
                          <span className="font-medium">/ 100</span>
                        </div>
                      </div>
                    )}

                    {game.platforms && game.platforms.length > 0 && (
                      <div>
                        <div className="text-sm text-gray-500">Platforms</div>
                        <div className="flex flex-wrap gap-1">
                          {game.platforms.map((platform: string, index: number) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price History */}
                {game.prices && game.prices.length > 0 && (
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Price History</h3>
                    <div className="space-y-3">
                      {game.prices.map((price: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{price.region}</div>
                            <div className="text-sm text-gray-500">{price.currency}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatPrice(price.price)}</div>
                            {price.isOnSale && (
                              <div className="text-sm text-green-600">On Sale</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">SteamDB</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Your ultimate destination for Steam game discovery, price tracking, and gaming insights.
                Find the best deals, explore new titles, and stay updated with the latest gaming trends.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-600">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Browse Games</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Top Sellers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">New Releases</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Free Games</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Deals & Sales</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-600">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">API Documentation</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-300 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm">
              © 2024 SteamDB. All rights reserved. Not affiliated with Valve Corporation.
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-500 text-sm">Made with</span>
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-500 text-sm">by the SteamDB team</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Snackbar */}
      <Snackbar
        show={snackbar.show}
        message={snackbar.message}
        type={snackbar.type}
        onClose={hideSnackbar}
      />
    </div>
  );
}
