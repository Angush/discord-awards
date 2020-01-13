# The Cauldron Awards Plan

Do the nominations page first, with a votes page that just says "Voting is not open yet." Nominations will take a few weeks, which gives me time to get the vote part up-and-running.

## Nominate Page

In order to create the nominations page, we need a few elements:

1. **`DONE!`** ~~Nav bar (login optional)~~
2. **`DONE!`** ~~On-page navigation (tabs? done with nested router maybe?)~~
   - **I did a category selection screen with a search bar instead.**
3. **`IN-PROGRESS!`** Various nomination input types, which correspond to the various categories:
   1. **`DONE!`** ~~Searchable fic entry (typeahead pulling from scraped WSS data).~~
      - Still needs: **submission & scraped data to pre-fill with.**
   2. **`DONE!`** ~~Manual fic entry; `FIELDS:` title + author + links - as a fallback with a de-emphasized link below the typeahead input.~~
      - Still needs: **submission.**
   3. **`DONE!`** ~~Art entry; `FIELDS:` title + author + image/url - support URL input first.~~
      - Still needs: **submission.**
      - Maybe also support direct image uploading? Discuss with Keira.
   4. **`DONE!`** ~~Basic text entry (single-field); for stuff like "Favourite Event" and "Most Helpful Vergen"~~
      - Still needs: **submission.**
   5. ~~Discord member selection (typeahead pulling from...?)~~ - **ULTRA OPTIONAL!** (and probably not worth it tbh)
4. Add nominee preview below submit button for more complex inputs (ie. art and fic nominees).
   - `art` preview: **`DONE!`** ~~Display image, as well as title/artist (with "Untitled" fallback support), but ONLY if the image actually works.~~
   - `fic` preview: **`DONE!`** ~~Display the fic card format that we'd get in the actual voting page. Shouldn't be too hard.~~
   - `other` preview? **`DONE!`** ~~Maybe figure out a way to do it.~~
5. **`DONE!`** ~~Add verification (ie. required fields) and ensure the submit button is disabled when they aren't properly filled. Also display the "This is a required field." messages on blur if they're empty.~~
   - Submit disabling already functional for ~~art/fic~~ **ALL** input.
   - **`DONE!`** ~~Need to figure out the best way (UI-wise and code-wise) to display stuff like "This is a required field." and other validation text.~~
     - My solution: **I set up a LabelShrinkable component which takes a `valid` prop.** If that prop equates to true, it will render with the `invisible` class, thus hiding it and its `children`. It also takes an `error` prop, and if that equates to true, its text children will be coloured red.
6. On submission, change "Submit" button to a loading indicator and disable inputs until it's done. (Do some nice animations/transitions, perhaps?)
   - **`DONE!`** - ~~Also save the submission data (incl. the category) to local storage, and add a "My Nominations" page that loads and displays all of this data.~~ Not the perfect solution to this, but it'll do for the 2019 awards. Can improve it for next time.
7. **`OBSOLETE!` - SEE [RESTRUCTURING](#nomination-restructuring)** - ~~After submission, show the user a "Thanks for nominating" screen with three options:~~
   1. ~~"Nominate something else for the same category." (Takes user back to already-selected Step 2.)~~
   2. ~~"Add your nominee to another category." (How to do this? Save nominee data, then return to Step 1, and filter out categories with different types?)~~
   3. ~~"Go back to the start." (Basically just returns you to Step 1 as if you'd hit "Go back" a couple times.)~~
8. **`DONE!`** - ~~Add step-skipping support via Reach-Router's location props, so `/nominate` takes us to the category selection, while `/nominate/:category-slug` will jump us straight to step 2 for the given category?~~ **(Will need tweaking/redoing after restructuring, though; see below.)**

### Nomination Restructuring

Whilst testing this, I've realised there's a better structure available, and it should be converted to utilize that.

1. **`Step 1`** - **`DONE!`** ~~Select the nominee **TYPE** (ie. `fic`, `art`, or `other`).~~
2. **`Step 2`** - **`DONE!`** ~~Depends on the nominee type.~~
   - `fic`/`art`: **`DONE!`** ~~Opens relevant nomination form.~~
   - `other`: **`DONE!`** ~~Opens category selection screen (pre-filtered so it only shows those with the type `other`), where user can select **ONE** category.~~
3. **`Step 3`** - **`DONE!`** ~~Depends on the nominee type.~~
   - `fic`/`art`: **`DONE!`** ~~Opens category selection form (pre-filtered so it only shows categories with matching types), where user can select **MULTIPLE** categories (as many as they want), thus enabling them to nominate their input for multiple categories at once.~~
   - `other`: **`DONE!`** ~~Opens relevant category nomination form.~~
4. **`Step 4`** - **`TO-DO!`** Submit form to server, then show feedback ("Thanks for nominating, click here to go back and nominate something else, or click here to nominate another {fic/art/other.title} for these categories," yadda yadda).

(Note: in order to support step-skipping, category info must be fetched at the very start, when the nomination page is first mounted.)

### Other Things To Do

In rough order of priority:

1. Prep backend with keira; need both **(a)** the API endpoint (`/api/contests` or `/api/categories`), and **(b)** the actual category data drawn up and ready to be served. **Make sure to support the section groupings!** (see [CATEGORIES.md](CATEGORIES.md))
2. Add the submission feedback stuff from [point 4 here](#nomination-restructuring) and [point 6 here](#nominate-page)]
3. Scrape 2019 fic data from WSS. Then manually add NSFW specification to any NSFW fics (only gotta check those with AO3/QQ links). Data needed: `title`, `author`, `links` (shortened), and `isNSFW`.
4. Make fic/art input (step 2) button say "Proceed" or "Save" or something, instead of "Submit" (which should only be the button name for step 3).
5. Re-implement the step-skipping functionality by specifying the category name in the url as a slug. It was removed in the nomination restructuring commit.
6. Maybe tweak the SelectCategory submit button styling/placement for multiple category selection. Looks a little odd. (Maybe also change the selected card styling, since it looks pretty much identical to the submit buttons, and in that scenario might be a bit confusing.)
7. Stop input-clear elements from being tab selectable when hidden.
8. **`DONE!`** - ~~Try and implement that "My Nominations" page (see [point 6 here](#nominate-page))?~~
9. Perhaps work out a way to have the category selection section be a consistent height (ie. max height), so it doesn't jump partway down the page when there are only a few results?
10. ...?

And some other stuff:

- ~~Maybe rename 'other' type to 'community'?~~ Better: add the section groupings, then have the type selection step (and thus the category filtration step that follows) split the 'other' types up based on their section grouping.
  - NOTE: the type selection screen may need empty elements for padding purposes, once more than one option is supported.

## Vote Page

Requirements TBD. But perhaps support two display modes for voting categories:

- **Card Lists**. Default view. Basically, all nominees are displayed as cards appropriate for their content. Fic cards have fic links and data, art cards have image backdrops and dynamic sizing, and basic text cards are smaller (like pills). Hovering over a card makes it rise up slightly, and change colour slightly. Clicking it (keyboard supported) will add it to the current selection (indicated by a bright background; maybe with a Bootstrap variant?). When there is anything in the current selection, a "Lodge Votes" button is enabled, and sticks to the bottom of the screen. Clicking that button will submit all selected votes at once.
  - Clicking to select will have to be handled carefully. The cards can't be greedy about it, because fic cards will have clickable links, and art cards will have support for a lightbox mode (which should also have a "Select" button in it), so clicking on those shouldn't select the card; you'd have to click on empty space or text. Maybe add a circular checkbox thingie to the corner (like Google Photos and whatnot) that appears on hover as a specific selection tap target (as well as a secondary selection indicator)?
- **Tables**. A, uh... well, a table view. You know what this is. Hovering/selection is on a per-row basis. (Question: how to handle rows on narrow devices? Fic title + author + links might be too long to fit neatly.)

Perhaps also have a Google Docs-style outline navigation thingie that people can pull in from the side (or, on desktop, which displays to the side by default) to more easily jump to the specific categories they have an interest in?

Maybe also have categories be collapsible (and start in collapsed mode by default)?

Maybe use a virtualized list tool for performance purposes, too.

And obviously the voting interface is only actually available if you're logged in. If you aren't logged in, you can view all the nominees, but you can't select them.

## Generic Requirements / Tooling

- Bootstrap 4.4
- A CSS minifier to keep the bundle size low (incl. minifying Bootstrap itself). `purgecss`? https://www.purgecss.com/guides/react
