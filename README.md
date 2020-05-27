# Search engine example

This app is a very basic example of a fulltext search engine for educational purposes. The goal of this project is to educate about how internet search engines work at the very basic level and to provide a working example with source codes for explanation.

There are numerous explanations that does a pretty good job of explaining the topic. You may google the question and land up [here](https://www.google.com/search/howsearchworks/) for example. But if you have a technical mind and like to see some code, this project is a working demonstration for you.

## What it does

This app aims to demonstrate three basic concepts:
- Building up an index of internet pages.
- Fulltext search catalogue.
- Searching and delivering results.

## What it does not

It does not show you any actual algorithms used in search tech companies. Those are really complex and they are private.

It does not show you how google manages to index a sizable portion of the whole internet. This is not a programming issue, but rather an architectural and IT one.

It does not go into any areas such as content management, advertising, different content types, synergies with other apps, etc.

## How to run

Install [ArangoDb](https://www.arangodb.com/) database.

Clone all three project repositories:

```
git clone https://github.com/VaclavZahradnik/search-react
git clone https://github.com/VaclavZahradnik/search-server
git clone https://github.com/VaclavZahradnik/search-crawler
```

Modify `env/development.json` in `search-server` and `search-crawler` repositories and change user name and password to access ArangoDb database.

Switch to search-crawler repository and initialize the search-example database by running:

```
npm install
npm run init-db
```

In each cloned repository run:

```
npm install
npm start
```

Optionaly, you can run search-crawler independently or not at all.

## Search engine example web crawler

This repository is the web crawler for the sample search engine. Web crawler (or web spider) is an application that visits pages and searches for outgoing links, thus creating a databaze of interlinked web pages and expanding it.

Search engine web crawler also analyzes content of the page and saves it in a form useful for fulltext search. This technique is called [web scrapping](https://en.wikipedia.org/wiki/Web_scraping). This example does only a very basic web scrapping - saving page title, favicon and all textual content.