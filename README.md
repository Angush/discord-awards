# The Cauldron Awards Plan

Do the nominations page first, with a votes page that just says "Voting is not open yet." Nominations will take a few weeks, which gives me time to get the vote part up-and-running.

In order to create the nominations page, we need a few elements:
1. Nav bar (login optional)
2. On-page navigation (tabs? done with nested router maybe?)
3. Various nomination input types, which correspond to the various categories:
   1. Searchable fic entry (typeahead pulling from scraped WSS data) - **DO LAST!**
   2. Manual fic entry; `FIELDS:` title + author + links - *if typeahead is done, make this a fallback with a de-emphasized link below the typeahead input.*
   3. Art entry; `FIELDS:` title + author + image/url - *support URL input first, but maybe also support direct image uploading? up to Keira.*
   4. Basic text entry (single-field); for stuff like "Favourite Event" and "Most Helpful Vergen"
   5. Discord member selection (typeahead pulling from...?) - **ULTRA OPTIONAL!**

Perhaps use **[Bootstrap 4.4](https://getbootstrap.com/docs/4.4/getting-started/introduction/)** to get it all up-and-running as quickly as possible? (Bonus: the styling works for the `react-bootstrap-typeahead` listed below.)

## Various Typeahead Options

### Untested

https://www.npmjs.com/package/ship-components-typeahead