# How to Run the Awards

This document outlines the steps I usually take to run the awards.

## Open Nominations

1. Navigate to the [phpMyAdmin dashboard](https://awards.angu.sh/admin/) to clear the `nominations`, `entries`, and `votes` tables, and to modify the award categories in the `contests` table (ie. adding new ones, removing unwanted ones, and updating the criteria to reflect the current year and any changes).

   - Updating years can be easily done with the following SQL query: `UPDATE contests SET criteria = REPLACE(criteria, '2022', '2023')` (and the same with the `description` column), changing the years as needed.

   - After deleting all the existing entries/nominations, be sure to also reset the auto increment in the `nominations` table, using the following SQL statement: `ALTER TABLE nominations AUTO_INCREMENT = 1`.

2. Shortly after January 1st, navigate to the `/frontend/scripts` directory and run `node scrape-wss.js`.

3. After WSS scraping is finished, additionally run `CLEAN=only node scrape-wss.js` to clean the titles.

4. Copy the `[year]-fic-options-cleaned.json` output file to the Awards API Server using `scp`, renaming the file to `typeahead-options.json` and placing it under `~/awards.angu.sh/json/`.

   - The command for this would be: `scp frontend/scripts/[year]-fic-options-cleaned.json angush@167.172.31.27:~/awards.angu.sh/json/typeahead-options.json` (so long as the API is hosted where it was at the time of writing). Obviously, `[year]` should be replaced with the actual year in question (eg. 2024).

5. Connect to the Awards API Server and edit the `~/awards.angu.sh/config.php` file. Change `$closedRoutes['nominate']` to `false` (as it should be true before you do this). This will open the nomination API.

   - If necessary, you may also wish to update the `adminPerms` array, adding or removing Discord IDs as needed to ensure only the appropriate persons (eg. currently active moderators) are able to access the specified vetting pages (`canVet` for vetting, `canVote` for voting when voting is closed, and `canNominate` for making nominations when nominations are closed).

6. Login to [Netlify](https://app.netlify.com) and access the cauldron-awards site. Navigate to the Site Configuration, then Environment Variables, and change the `REACT_APP_NOMINATIONS_CLOSED` variable to `false` (as it should be true before you do this).

7. Redeploy the site using Netlify. (This may need to be done using the `Trigger Deploy` dropdown button in the Deploys tab.)

## Open Voting

1. On Netlify, navigate to the Environment Variables configuration again, and change the `REACT_APP_NOMINATIONS_CLOSED` variable to `true`, and change the `REACT_APP_VOTING_CLOSED` variable to `false` (as it should be true before you do this).

2. Redeploy the site.

## Begin Vetting

1. On Netlify, navigate to the Environment Variables configuration again, and change the `REACT_APP_VOTING_CLOSED` variable to `true`.

2. Redeploy the site.

3. Direct _Vetting Assistants_ to login to the site with their Discord accounts, then navigate to the Admin Vetting page (which will appear in the navigation bar) to begin approving/rejecting nominees.

### Notes:

- If you want to add new Vetting Assistants, or remove vetting permissions from someone, connect to the Awards API Server and edit the `~awards.angu.sh/config.php` file. Specifically, update the `adminPerms` array, adding or removing Discord IDs as needed to ensure only the appropriate persons are able to access the specified vetting pages (`canVet` for vetting, `canVote` for voting when voting is closed, and `canNominate` for making nominations when nominations are closed).

- If desired, you can also set the `includeUnvetted` option to `true` to allow nominees that have not been vetted to be eligible in voting, and only excluding nominees that have been explicitly rejected.

## Tabulate Results

1. Modify the main `App.js` file (`frontend/src/App.js`) to add the new year to the _start_ of the `years` array (line 25 at time of writing), to make the year show up in the yearly results overview page.

   - Basically, if the line currently looked like `const years = ['2022', '2021']`, you should edit it to be `const years = ['2023', '2022', '2021']`.

2. Construct the vote history JSON using the provided script: `frontend/scripts/construct-vote-history.js`.

   - An SQL URL must be included as an environment variable in order to run the script, like so: `SQL_URL="urlhere" node construct-vote-history.js`

   - After constructing the vote history, rename the resulting `YEAR-vote-history-constructed.json` file to `YEAR.json` (eg. `2023.json`) and move it into the `~/awards.angu.sh/past-results` directory on the Awards API Server.

3. Construct the results JSON using the provided script: `frontend/scripts/construct-results.js`.

   - An SQL URL must be included as an environment variable in order to run the script, like so: `SQL_URL="urlhere" node construct-results.js`

   - After constructing the votes, rename the resulting `YEAR-results-constructed.json` file to `YEAR.json` (eg. `2023.json`) and move it into the `frontend/src/json/results` directory.

   - Be sure to add the header paragraphs at the top of the results JSON! Otherwise the results page will be pretty plain. (I usually just copy the text from the previous year and modify the numbers and any mentions of new categories.)

   - Also, go through all nominees that won a placement (ie. 1st/2nd/3rd) in creator categories (ie. Author of the Year, Artist of the Year, New Creator of the Year, Favorite Art Style, and any new categories that may apply), and add a `related` property with an array of up to three objects representing works created by that creator. **Example:**

   ```
   "related": [
      {
         "title": "Fic Title",
         "links": ["https://fic.links/in-an-array"]
      },
      {
         "title": "Fic Title with One Link",
         "link": "https://fic.link/if-only-one"
      },
      {
         "title": "Art Title",
         "image": "https://image.link/"
      }
   ]
   ```

4. Generate badges for the winners using the provided script: `frontend/scripts/create-badges.js`. This **must** be done after Step 2 (including the file rename and directory moving).

   - The badges will generate to the `scripts/badges` directory in a sub-folder named after the relevant year (eg. `badges/2023`). After the script is finished, to make these badges usable, move the year folder containing the badges to the `frontend/public/badges` directory.

   - **Currently, badges are mandatory.** To change this, we would want to either (a) modify the `construct-results.js` script to only add the `placement` property if directed to do so, and/or (b) modify the various `ResultsPage` components on the frontend to read some top-level property from the results JSON files (eg. a `config.showBadges` property) allowing the badges interface to be hidden for specific years.

5. If you can be bothered, generate accolades data using the `construct-accolades.js` script. This will then need to be manually modified to replace author/creator names with that person's corresponding Discord ID (if present on Cauldron), and to merge duplicate entries in the resulting JSON (eg. "AverageJoe" and "Average Joe"). Finally, that JSON needs to be manually merged into Dragon's `accolades.json` file on her server.

6. Commit new files (eg. badges, results JSON, etc.) to the frontend GitHub repository, to trigger a new automatic Netlify deployment of the site with the new content.
