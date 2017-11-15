## OnionPeeler

The Onion Peeler is a site which scrapes articles from The Onion.  The technologies used include MongoDB (using NPM package Mongoose), Express (server site is run on), Node (base technology packages run on), Handlebars (for templating output of articles), and NPM packages Request (for getting content to scrape) and Cheerio (a library which behaves like jQuery for identifying content to scrape).

Try it at http://cnjdev-onion-peeler.herokuapp.com/

![Top of Page](/schots/page-top.png)

### Home

Articles scraped from the Onion are posted here.  Each article has the headline (which links to the original story in a new tab) and a summary.  There is an option to add the article to the set of Saved Articles.

![Sample Article](/schots/sample-article.png)

### SCRAPE ARTICLES

_(Link only available from the Home page)_
When clicking this, the site will check for new content at The Onion site and reload the page with the newest articles first.

### Saved Articles

Articles that were saved on the Home Page appear here.  As on the home page, each article has the headline linking to the story and summary.  But now there are options to view Notes left on the article and to remove the article from the set of Saved Articles.

![Saved Article](/schots/sample-saved.png)

#### Article Notes

Users can view and leave notes for an article when clicking the "View Notes left on Article" button on a Saved Article.  A window like this will appear which show the notes left on the article as well as the full headline (and internal Mongo ID).

![Article Notes](/schots/article-notes.png)

#### Other Links

Application online at http://cnjdev-onion-peeler.herokuapp.com/

GitHub Repository at https://github.com/cnjdev/OnionPeeler

Headlines and summaries from articles are from The Onion at https://www.theonion.com/ 
