# The Cauldron Awards Plan

Do the nominations page first, with a votes page that just says "Voting is not open yet." Nominations will take a few weeks, which gives me time to get the vote part up-and-running.

In order to create the nominations page, we need a few elements:

1. **DONE!** ~~Nav bar (login optional)~~
2. **DONE!** ~~On-page navigation (tabs? done with nested router maybe?)~~ (I did a category selection screen with a search bar instead.)
3. **IN-PROGRESS!** Various nomination input types, which correspond to the various categories:
   1. **HALF-DONE!** ~~Searchable fic entry (typeahead pulling from scraped WSS data) - **DO LAST!**~~ (Still needs (a) scraped data, and (b) submission.)
   2. **HALF-DONE!** ~~Manual fic entry; `FIELDS:` title + author + links - _if typeahead is done, make this a fallback with a de-emphasized link below the typeahead input._~~ (Still needs validation & submission.)
   3. **TO-DO!** Art entry; `FIELDS:` title + author + image/url - _support URL input first, but maybe also support direct image uploading? up to Keira._
   4. **TO-DO!** Basic text entry (single-field); for stuff like "Favourite Event" and "Most Helpful Vergen"
   5. Discord member selection (typeahead pulling from...?) - **ULTRA OPTIONAL!**
4. On submission, change "Submit" button to a loading indicator and disable inputs until it's done.
5. After submission, show the user a "Thanks for nominating" screen with three options:
   1. "Nominate something else for the same category." (Takes user back to already-selected Step 2.)
   2. "Add your nominee to another category." (How to do this? Save nominee data, then return to Step 1, and filter out categories with different types?)
   3. "Go back to the start." (Basically just returns you to Step 1 as if you'd hit "Go back" a couple times.)

Perhaps use **[Bootstrap 4.4](https://getbootstrap.com/docs/4.4/getting-started/introduction/)** to get it all up-and-running as quickly as possible? (Bonus: the styling works for the `react-bootstrap-typeahead` listed below.)

If you do use Bootstrap, make sure to use a minifier like `purgecss` to keep the bundle size low. https://www.purgecss.com/guides/react

## Various Typeahead Options

### Tested

1. `react-bootstrap-typeahead` - probably best one. It's fully-featured, and if you use Bootstrap, it's pre-styled (which only needs a few tweaks; see `App.css`) https://github.com/ericgio/react-bootstrap-typeahead
2. `react-typeahead` - eh. https://github.com/fmoo/react-typeahead

### Untested

1. https://www.npmjs.com/package/ship-components-typeahead
