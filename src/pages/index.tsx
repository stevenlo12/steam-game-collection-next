import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as Icons from "heroicons-react";
import clsx from "clsx";
import { useRouter } from "next/router";

import Loader from "../components/loader";
import Pagination from "../components/Pagination";
import Snackbar from "../components/Snackbar";
import { gameService, GamesResponse, PaginationParams, ApiError } from "../services/api";

const DEBUG = true;

export default function ThingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [gamesData, setGamesData] = useState<GamesResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Default items per page
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info'
  });

  useEffect(() => {
    fetchGames();
  }, [currentPage]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: PaginationParams = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      };

      const data = await gameService.getGames(params);
      setGamesData(data);
    } catch (err) {
      console.error('Error fetching games:', err);
      if (err instanceof ApiError) {
        setError(err);
      } else {
        setError(new ApiError('An unexpected error occurred. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reload = () => {
    fetchGames();
  };

  const showSnackbar = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setSnackbar({ show: true, message, type });
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, show: false }));
  };

  const totalPages = gamesData ? Math.ceil(gamesData.total / itemsPerPage) : 0;

  return (
    <div className="flex flex-col items-center min-h-screen text-gray-700 max-w-7xl mx-auto p-6 md:py-12">
      <div className="w-full">
        <div className="flex flex-row items-center">
          <h1 className="font-bold text-2xl flex-grow">Steam Games</h1>
          <Button onClick={() => { }} color="green">
            <Icons.Plus
              size={20}
              className={false ? "animate-spin-reverse" : undefined}
            />{" "}
            Add
          </Button>
          <Button onClick={reload} className="ml-2">
            <Icons.Refresh
              size={20}
              className={loading ? "animate-spin-reverse" : undefined}
            />{" "}
            Reload
          </Button>
        </div>
        <div className="mt-4 bg-white border rounded-xl overflow-hidden shadow-lg">
          {loading ? (
            <Loading />
          ) : error ? (
            <Error error={error} onRetry={reload} />
          ) : gamesData ? (
            <ThingsList things={gamesData} onSteamClick={() => showSnackbar("Steam integration coming soon! 🎮", "info")} />
          ) : (
            <div />
          )}
        </div>

        {/* Pagination */}
        {gamesData && gamesData.total > itemsPerPage && (
          <div className="mt-8 bg-white border rounded-lg p-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={gamesData.total}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
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
              <span className="text-gray-500 text-sm">by the ....</span>
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

const Button = ({
  onClick,
  children,
  color = "blue",
  className = null,
}: any) => {
  const button_class = clsx(
    "flex flex-row items-center font-bold px-2 py-1 rounded gap-2 cursor-pointer",
    `bg-${color}-600 hover:bg-${color}-700 text-${color}-100`,
    className
  );
  return (
    <a className={button_class} onClick={onClick}>
      {children}
    </a>
  );
};

const Loading = () => (
  <div className="p-8 bg-blue-100">
    <Loader color="bg-blue-200" />
  </div>
);

const Error = ({ error, onRetry }: { error: ApiError; onRetry: () => void }) => {
  const getErrorIcon = () => {
    if (error.code === 'NETWORK_ERROR') {
      return <Icons.Wifi size={20} className="inline-block mr-2" />;
    }
    if (error.code === 'TIMEOUT') {
      return <Icons.Clock size={20} className="inline-block mr-2" />;
    }
    return <Icons.Exclamation size={20} className="inline-block mr-2" />;
  };

  const getErrorColor = () => {
    if (error.code === 'NETWORK_ERROR') {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (error.code === 'TIMEOUT') {
      return 'bg-orange-100 text-orange-800';
    }
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-8">
      <div className={`rounded-lg p-6 ${getErrorColor()} text-center`}>
        {getErrorIcon()}
        <h3 className="text-lg font-semibold mb-2">Unable to Load Games</h3>
        <p className="mb-4">{error.message}</p>
        <button
          onClick={onRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Try Again
        </button>
      </div>
      {DEBUG && error.stack && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-600">Debug Information</summary>
          <pre className="w-full overflow-x-scroll text-xs bg-gray-100 text-gray-800 p-4 mt-2 rounded">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
};

const ThingsList = ({ things, onSteamClick }: { things: GamesResponse; onSteamClick: () => void }) => (
  <div className="p-6">
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Featured Games</h2>
      <p className="text-gray-600 mt-1">Browse our collection of Steam games</p>
    </div>

    {/* Grid Layout - Cards overflow to bottom */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {things.games && things.games.map((game) => (
        <GameCard game={game} key={game.id} onSteamClick={onSteamClick} />
      ))}
    </div>
  </div>
);

const GameCard = ({ game, onSteamClick }: { game: any; onSteamClick: () => void }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/game/${game.id}`);
  };

  const handleSteamClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    onSteamClick();
  };

  const formatPrice = (price: string) => {
    if (price === "0.00") return "Free";
    return `$${price}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "TBA";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-4 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Game Header Image */}
      <div className="relative mb-4">
        <img
          src={game.headerImage}
          alt={game.title}
          className="w-full h-48 object-cover rounded-lg"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />
        {game.isFree && (
          <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
            FREE
          </div>
        )}
        {game.discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
            -{game.discountPercent}%
          </div>
        )}
        {/* Steam button overlay */}
        <button
          onClick={handleSteamClick}
          className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
        >
          Steam
        </button>
      </div>

      {/* Game Info */}
      <div className="space-y-3">
        {/* Game Title */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
          {game.title}
        </h3>

        {/* Price Information */}
        <div className="flex items-center justify-between">
          {game.isFree ? (
            <span className="text-lg font-bold text-green-600">Free</span>
          ) : (
            <div className="text-right">
              {game.discountPercent > 0 && (
                <div className="text-sm text-gray-500 line-through">
                  ${game.originalPrice}
                </div>
              )}
              <div className="text-lg font-bold text-orange-600">
                {formatPrice(game.price)}
              </div>
            </div>
          )}
        </div>

        {/* Developer and Publisher */}
        <div className="text-sm text-gray-600">
          <div className="font-medium">
            {game.developer?.replace('Developer:', '').trim() || 'Unknown Developer'}
          </div>
          <div className="text-gray-500">
            {game.publisher?.replace('Publisher:', '').trim() || 'Unknown Publisher'}
          </div>
        </div>

        {/* Metacritic Score */}
        {game.metacriticScore && (
          <div className="flex items-center space-x-2">
            <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
              {game.metacriticScore}
            </div>
            <span className="text-sm text-gray-600">Metacritic</span>
          </div>
        )}

        {/* Release Date */}
        <div className="text-sm text-gray-500">
          Released: {formatDate(game.releaseDate)}
        </div>
      </div>
    </div>
  );
};
