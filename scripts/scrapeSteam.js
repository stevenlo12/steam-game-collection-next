const scrapeHandler = require('../handlers/scrapeHandler');

// Main execution
async function main() {
  try {
    // Create a mock request and response object for the handler
    const req = {};
    const res = {
      json: (data) => {
        console.log('Scraping completed:', data);
      },
      status: (code) => {
        return {
          json: (data) => {
            console.log(`Error (${code}):`, data);
          }
        };
      }
    };

    // Start scraping using the handler
    await scrapeHandler.startScraping(req, res);

  } catch (error) {
    console.error('Error in main scraping process:', error);
  } finally {
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };


