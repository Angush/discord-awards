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
      - Still needs: **submission & url validation.**
   3. **`DONE!`** ~~Art entry; `FIELDS:` title + author + image/url - support URL input first.~~
      - Still needs: **submission.**
      - Maybe also support direct image uploading? Discuss with Keira.
   4. **`DONE!`** ~~Basic text entry (single-field); for stuff like "Favourite Event" and "Most Helpful Vergen"~~
      - Still needs: **submission & image/url validation?**
   5. ~~Discord member selection (typeahead pulling from...?)~~ - **ULTRA OPTIONAL!** (and probably not worth it tbh)
4. Add nominee preview below submit button for more complex inputs (ie. art and fic nominees).
   - `art` preview: **`FINISHED!`** ~~Display image, as well as title/artist (with "Untitled" fallback support), but ONLY if the image actually works.~~
   - `fic` preview: **`FINISHED!`** ~~Display the fic card format that we'd get in the actual voting page. Shouldn't be too hard.~~
   - `other` preview? **`FINISHED!`** ~~Maybe figure out a way to do it.~~
5. **`DONE!`** ~~Add verification (ie. required fields) and ensure the submit button is disabled when they aren't properly filled. Also display the "This is a required field." messages on blur if they're empty.~~
   - Submit disabling already functional for ~~art/fic~~ **ALL** input.
   - **`DONE!`** ~~Need to figure out the best way (UI-wise and code-wise) to display stuff like "This is a required field." and other validation text.~~
     - My solution: **I set up a LabelShrinkable component which takes a `valid` prop.** If that prop equates to true, it will render with the `invisible` class, thus hiding it and its `children`. It also takes an `error` prop, and if that equates to true, its text children will be coloured red.
6. On submission, change "Submit" button to a loading indicator and disable inputs until it's done. (Do some nice animations/transitions, perhaps?)
   - Also save the submission data (incl. the category) to local storage, and add a "My Nominations" page that loads and displays all of this data. Not the perfect solution to this, but it'll do for the 2019 awards. Can improve it for next time.
7. **`OBSOLETE!` - SEE [RESTRUCTURING](#nomination-restructuring)** - ~~After submission, show the user a "Thanks for nominating" screen with three options:~~
   1. ~~"Nominate something else for the same category." (Takes user back to already-selected Step 2.)~~
   2. ~~"Add your nominee to another category." (How to do this? Save nominee data, then return to Step 1, and filter out categories with different types?)~~
   3. ~~"Go back to the start." (Basically just returns you to Step 1 as if you'd hit "Go back" a couple times.)~~
8. **`DONE!`** - ~~Add step-skipping support via Reach-Router's location props, so `/nominate` takes us to the category selection, while `/nominate/:category-slug` will jump us straight to step 2 for the given category?~~ **(Will need tweaking/redoing after restructuring, though; see below.)**

### Nomination Restructuring

Whilst testing this, I've realised there's a better structure available, and it should be converted to utilize that.

1. **`Step 1`** - Select the nominee **TYPE** (ie. `fic`, `art`, or `other`).
2. **`Step 2`** - Depends on the nominee type.
   - `fic`/`art`: Opens relevant nomination form.
   - `other`: Opens category selection screen (pre-filtered so it only shows those with the type `other`), where user can select **ONE** category.
3. **`Step 3`** - Depends on the nominee type.
   - `fic`/`art`: Opens category selection form (pre-filtered so it only shows categories with matching types), where user can select **MULTIPLE** categories (as many as they want), thus enabling them to nominate their input for multiple categories at once.
   - `other`: Opens relevant category nomination form.
4. **`Step 4`** - Submit form to server, then show feedback ("Thanks for nominating, click here to go back and nominate something else, or click here to nominate another {fic/art/other.title} for these categories," yadda yadda).

(Note: in order to support step-skipping, category info must be fetched at the very start, when the nomination page is first mounted.)

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
