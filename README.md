# UKRIDA Steam Scraper REST API

A comprehensive Express.js REST API for scraping Steam data with ORM and database migrations. This is a pure backend service that provides JSON endpoints for frontend applications.

## Features

- 🚀 Express.js REST API server running on port 80
- 🗄️ Sequelize ORM with MySQL support
- 🔄 Database migrations and seeding
- 🕷️ Steam data scraping (games, prices, reviews)
- 📊 RESTful JSON API endpoints
- 🛡️ Security middleware (helmet, CORS)
- 📝 Comprehensive logging
- 🔧 Environment-based configuration
- 🎯 Pure backend service - no views or templates
- ⚡ Hot reload for development (nodemon)

## Prerequisites

- Node.js (v14 or higher)
- MySQL database

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd ukrida
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
# Copy the environment config
cp env.config .env

# Edit .env with your database credentials
DB_HOST=localhost
DB_PORT=3306
DB_NAME=fullstack_learning_db
DB_USER=root
DB_PASSWORD=your_password
DB_DIALECT=mysql
```

4. Create database:

```bash
npm run db:create
```

5. Run migrations:

```bash
npm run db:migrate
```

6. Start the server:

```bash
# Development with hot reload (port 3000)
npm run dev

# Production (port 80)
npm start

# Production with NODE_ENV
npm run prod
```

## Database Setup

The project uses MySQL with Sequelize ORM. Make sure you have:

- MySQL server running
- Database user with appropriate permissions
- Correct database credentials in `.env` file

## Available Scripts

- `npm start` - Start production server on port 80
- `npm run dev` - Start development server with hot reload on port 3000
- `npm run prod` - Start production server with NODE_ENV=production
- `npm run db:migrate` - Run database migrations
- `npm run db:migrate:undo` - Undo last migration
- `npm run db:seed` - Seed database with sample data
- `npm run db:seed:undo` - Undo all seeders
- `npm run db:create` - Create database
- `npm run db:drop` - Drop database
- `npm run scrape` - Run Steam data scraping

## Development with Hot Reload

The development server includes hot reload functionality using nodemon:

- **Automatic restarts**: Server restarts when you save changes to watched files
- **Watched directories**: `app.js`, `bin/`, `routes/`, `models/`, `config/`, `scripts/`
- **Watched extensions**: `.js` and `.json` files
- **Ignored files**: `node_modules/`, `public/`, `migrations/`, log files, database files
- **Manual restart**: Type `rs` and press Enter to manually restart the server
- **Delay**: 1-second delay to prevent excessive restarts

### Hot Reload Configuration

The nodemon configuration is in `nodemon.json`:

```json
{
  "watch": ["app.js", "bin/", "routes/", "models/", "config/", "scripts/"],
  "ext": "js,json",
  "ignore": ["node_modules/", "public/", "migrations/", "*.log"],
  "env": {
    "NODE_ENV": "development",
    "PORT": "3000"
  }
}
```

## API Endpoints

### Root

- `GET /` - API information and available endpoints

### Games

- `GET /api/games` - Get all games with pagination
- `GET /api/games/:id` - Get game by ID
- `GET /api/games/search/:query` - Search games

### Analytics

- `GET /api/analytics/trending` - Get trending games
- `GET /api/analytics/prices` - Get price analytics

### Scraping

- `POST /api/scrape/games` - Trigger game scraping
- `POST /api/scrape/prices` - Trigger price scraping
- `GET /api/scrape/status` - Get scraping status

## Database Models

### Game

- Steam ID, title, description
- Developer, publisher, release date
- Price information and discounts
- Categories, languages, system requirements
- Screenshots and media

### Price

- Price history tracking
- Discount information
- Currency and region support
- Sale status and end dates

### Genre

- Game categorization
- Steam genre mapping
- Active/inactive status

## Steam Scraping

The application can scrape various Steam data:

- Game information (title, description, genres, etc.)
- Price history and current prices
- User reviews and ratings
- System requirements
- Screenshots and videos

### Scraping Features

- **Respectful scraping** with configurable delays
- **Puppeteer-based** for dynamic content
- **Error handling** and retry logic
- **Data validation** before saving
- **Duplicate prevention** with upsert logic

## Project Structure

```
ukrida/
├── bin/              # Server startup script
├── config/           # Database configuration
├── migrations/       # Database migrations
├── models/           # Sequelize models
├── routes/           # API routes
├── scripts/          # Scraping scripts
├── app.js            # Main application file
├── package.json      # Dependencies and scripts
├── nodemon.json      # Hot reload configuration
└── README.md         # This file
```

## Configuration

### Environment Variables

```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=fullstack_learning_db
DB_USER=root
DB_PASSWORD=your_password
DB_DIALECT=mysql

# Server
PORT=80
NODE_ENV=development
```

### Database Configuration

The application supports multiple environments:

- **Development**: Local development with logging
- **Test**: Testing environment without logging
- **Production**: Production environment with connection pooling

## Usage Examples

### Scraping Specific Games

```bash
# Run the scraper for specific Steam IDs
npm run scrape
```

### API Usage

```bash
# Get API information
curl http://localhost:80/

# Get all games
curl http://localhost:80/api/games

# Search games
curl "http://localhost:80/api/games/search/counter-strike"

# Get trending games
curl http://localhost:80/api/analytics/trending

# Trigger scraping
curl -X POST http://localhost:80/api/scrape/games
```

### Frontend Integration

This API is designed to be consumed by frontend applications. Example JavaScript usage:

```javascript
// Fetch games
const response = await fetch("http://localhost:80/api/games");
const data = await response.json();
console.log(data.games);

// Search games
const searchResponse = await fetch("http://localhost:80/api/games/search/csgo");
const searchData = await searchResponse.json();
console.log(searchData.games);
```

## Security Features

- **Helmet.js** for security headers
- **CORS configuration** for cross-origin requests
- **Input validation** and sanitization
- **SQL injection protection** via Sequelize
- **Rate limiting** (configurable)

## Development

### Adding New Models

1. Create model file in `models/` directory
2. Define associations in the model
3. Create migration file
4. Run migration: `npm run db:migrate`

### Adding New Routes

1. Create route file in `routes/` directory
2. Add route logic
3. Include in `app.js`
4. Test endpoints

### Hot Reload Tips

- The server automatically restarts when you save changes
- Use `rs` command in terminal to manually restart
- Check the console for restart notifications
- Hot reload works with all JavaScript and JSON files in watched directories

## Troubleshooting

### Common Issues

1. **Port 80 requires elevated privileges**

   - Use `sudo npm start` on Linux/Mac
   - Run as administrator on Windows

2. **Database connection failed**

   - Check MySQL service status
   - Verify credentials in `.env`
   - Ensure database exists

3. **Scraping blocked by Steam**

   - Increase delay between requests
   - Rotate user agents
   - Use proxy servers

4. **Hot reload not working**
   - Check if nodemon is installed: `npm install`
   - Verify `nodemon.json` configuration
   - Ensure files are in watched directories
   - Check file extensions are `.js` or `.json`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

## Roadmap

- [ ] User authentication and authorization
- [ ] Advanced analytics and reporting
- [ ] Real-time price monitoring
- [ ] Email notifications for price drops
- [ ] Mobile app support
- [ ] Advanced scraping algorithms
- [ ] Data export functionality
- [ ] WebSocket support for real-time updates
- [ ] GraphQL endpoint
- [ ] API rate limiting and throttling
