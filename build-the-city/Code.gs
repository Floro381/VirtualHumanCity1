// Google Apps Script: serves index.html as a web app, so the game runs from Google Drive.
// Setup steps are in README.md ("Run it from Google Drive").
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Build the City')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
