import * as fs from "fs";
import markdownIt from "markdown-it";
import data from "./featured-repos.json" assert { type: "json" };

const md = markdownIt({
  html: true, // Enable HTML tags in source
  breaks: true, // Convert '\n' in paragraphs into <br>
  linkify: true, // Autoconvert URL-like text to links
});

import { fetchGitHubData } from "./fetch/fetchGitHubData.js";
import { fetchGistData } from "./fetch/fetchGistData.js";
import { fetchPostData } from "./fetch/fetchPostData.js";
import { fetchPinboardData } from "./fetch/fetchPinboardData.js";

const feedURL = "https://www.dgrebb.com/RSS.xml";
const featuredRepos: string[] = data.repos;

const username = "dgrebb";
const websiteUrl = "https://www.dgrebb.com";
const catchafireUrl = "https://philafound.catchafire.org/profiles/732275/";
const goodreadsUrl = "https://www.goodreads.com/user/show/4857619-dan";
const pinboardUrl = "https://pinboard.in/u:dgrebb";
const linkedinUrl = "https://linkedin.com/in/dgrebb";

async function generateMarkdown() {
  const websiteBadge = `[![Website Badge](https://img.shields.io/badge/website-Website?style=for-the-badge&logoColor=white&labelColor=1f1f1f&color=brown&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxnIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0yNCAwdjI0SDBWMHpNMTIuNTkzIDIzLjI1OGwtLjAxMS4wMDJsLS4wNzEuMDM1bC0uMDIuMDA0bC0uMDE0LS4wMDRsLS4wNzEtLjAzNWMtLjAxLS4wMDQtLjAxOS0uMDAxLS4wMjQuMDA1bC0uMDA0LjAxbC0uMDE3LjQyOGwuMDA1LjAybC4wMS4wMTNsLjEwNC4wNzRsLjAxNS4wMDRsLjAxMi0uMDA0bC4xMDQtLjA3NGwuMDEyLS4wMTZsLjAwNC0uMDE3bC0uMDE3LS40MjdjLS4wMDItLjAxLS4wMDktLjAxNy0uMDE3LS4wMThtLjI2NS0uMTEzbC0uMDEzLjAwMmwtLjE4NS4wOTNsLS4wMS4wMWwtLjAwMy4wMTFsLjAxOC40M2wuMDA1LjAxMmwuMDA4LjAwN2wuMjAxLjA5M2MuMDEyLjAwNC4wMjMgMCAuMDI5LS4wMDhsLjAwNC0uMDE0bC0uMDM0LS42MTRjLS4wMDMtLjAxMi0uMDEtLjAyLS4wMi0uMDIybS0uNzE1LjAwMmEuMDIzLjAyMyAwIDAgMC0uMDI3LjAwNmwtLjAwNi4wMTRsLS4wMzQuNjE0YzAgLjAxMi4wMDcuMDIuMDE3LjAyNGwuMDE1LS4wMDJsLjIwMS0uMDkzbC4wMS0uMDA4bC4wMDQtLjAxMWwuMDE3LS40M2wtLjAwMy0uMDEybC0uMDEtLjAxeiIvPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJtMTcuMzAzIDkuNTI0bDMuMTgyIDMuMTgyYTUuNSA1LjUgMCAxIDEtNy43NzggNy43NzhsLTEuMDYtMS4wNmExLjUgMS41IDAgMSAxIDIuMTItMi4xMjJsMS4wNjIgMS4wNjFhMi41IDIuNSAwIDAgMCAzLjUzNS0zLjUzNmwtMy4xODItMy4xODJhMi41IDIuNSAwIDAgMC0yLjY4MS0uNTZjLS4xNjIuMDY0LS4zMTIuMTMtLjQ1NC4xOTZsLS40NjQuMjE3Yy0uNjIuMjgtMS4wOTcuNC0xLjcwNC0uMjA2Yy0uODcyLS44NzItLjY0Ni0xLjY3Ny40MTctMi40MWE1LjUwMiA1LjUwMiAwIDAgMSA3LjAwNy42NDJtLTYuMDEtNi4wMWwxLjA2IDEuMDZhMS41IDEuNSAwIDAgMS0yLjEyIDIuMTIybC0xLjA2MS0xLjA2QTIuNSAyLjUgMCAxIDAgNS42MzYgOS4xN2wzLjE4MiAzLjE4MmEyLjUgMi41IDAgMCAwIDIuNjgxLjU2Yy4xNjItLjA2NC4zMTItLjEzLjQ1NC0uMTk2bC40NjQtLjIxN2MuNjItLjI4IDEuMDk4LS40IDEuNzA0LjIwNmMuODcyLjg3Mi42NDYgMS42NzctLjQxNyAyLjQxYTUuNTAyIDUuNTAyIDAgMCAxLTcuMDA3LS42NDJsLTMuMTgyLTMuMTgyYTUuNSA1LjUgMCAxIDEgNy43NzgtNy43NzgiLz48L2c+PC9zdmc+ "dgrebb.com")](${websiteUrl})`;
  const pinboardBadge = `[![Catchafire Badge](https://img.shields.io/badge/$9348-catchafire?style=for-the-badge&logoColor=white&labelColor=1f1f1f&color=A52A2A&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMyIgaGVpZ2h0PSIzMyIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSJ3aGl0ZSIgZD0iTTggMTZjMy4zMTQgMCA2LTIgNi01LjVjMC0xLjUtLjUtNC0yLjUtNmMuMjUgMS41LTEuMjUgMi0xLjI1IDJDMTEgNCA5IC41IDYgMGMuMzU3IDIgLjUgNC0yIDZjLTEuMjUgMS0yIDIuNzI5LTIgNC41QzIgMTQgNC42ODYgMTYgOCAxNm0wLTFjLTEuNjU3IDAtMy0xLTMtMi43NWMwLS43NS4yNS0yIDEuMjUtM0M2LjEyNSAxMCA3IDEwLjUgNyAxMC41Yy0uMzc1LTEuMjUuNS0zLjI1IDItMy41Yy0uMTc5IDEtLjI1IDIgMSAzYy42MjUuNSAxIDEuMzY0IDEgMi4yNUMxMSAxNCA5LjY1NyAxNSA4IDE1Ii8+PC9zdmc+ "Catchafire Impact")](${catchafireUrl})`;
  const catchafireBadge = `[![Pinboard Badge](https://img.shields.io/badge/pinboard-pinboard?style=for-the-badge&logoColor=white&labelColor=1f1f1f&color=A52A2A&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMyIgaGVpZ2h0PSIzMyIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJ3aGl0ZSIgZD0iTTE2LjcyOSA0LjI3MWExIDEgMCAwIDAtMS40MTQtLjAwNGExLjAwNCAxLjAwNCAwIDAgMC0uMjI1LjM1NWMtLjgzMiAxLjczNi0xLjc0OCAyLjcxNS0yLjkwNCAzLjI5M0MxMC44ODkgOC41NTUgOS40IDkgNyA5YTEuMDA2IDEuMDA2IDAgMCAwLS45MjMuNjE3YTEuMDAxIDEuMDAxIDAgMCAwIC4yMTcgMS4wOWwzLjI0MyAzLjI0M0w1IDIwbDYuMDUtNC41MzdsMy4yNDIgMy4yNDJhLjk3NS45NzUgMCAwIDAgLjMyNi4yMTdjLjEyMi4wNTEuMjUyLjA3OC4zODIuMDc4cy4yNi0uMDI3LjM4Mi0uMDc4QS45OTYuOTk2IDAgMCAwIDE2IDE4YzAtMi40LjQ0NC0zLjg4OSAxLjA4My01LjE2NmMuNTc3LTEuMTU2IDEuNTU2LTIuMDcyIDMuMjkzLTIuOTA0YS45ODMuOTgzIDAgMCAwIC4zNTQtLjIyNWExIDEgMCAwIDAtLjAwNC0xLjQxNHoiLz48L3N2Zz4= "Pinboard Links")](${pinboardUrl})`;
  const linkedinBadge = `[![Linkedin Badge](https://img.shields.io/badge/LinkedIn-LinkedIn?style=for-the-badge&logo=linkedin&logoColor=white&labelColor=1f1f1f&color=A52A2A "LinkedIn Profile")](${linkedinUrl})`;
  const goodreadsBadge = `[![Goodreads Badge](https://img.shields.io/badge/GoodReads-goodreads?style=for-the-badge&logo=goodreads&logoColor=white&labelColor=1f1f1f&color=A52A2A "Goodreads")](${goodreadsUrl})`;

  const githubStatsCardDark = `[![GitHub-Stats-Card-Dark](https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&hide_border=true&include_all_commits=true&card_width=600&custom_title=GitHub%20Stats&title_color=A52A2A&text_color=FFF&icon_color=A52A2A&hide=contribs&show=reviews,prs_merged,prs_merged_percentage&theme=transparent#gh-dark-mode-only)](https://github.com/${username}/${username}#gh-dark-mode-only)`;
  const githubStatsCardLight = `[![GitHub-Stats-Card-Light](https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&hide_border=true&include_all_commits=true&card_width=600&custom_title=GitHub%20Stats&title_color=A52A2A&text_color=474A4E&icon_color=A52A2A&hide=contribs&show=reviews,prs_merged,prs_merged_percentage&theme=transparent#gh-light-mode-only)](https://github.com/${username}/${username}#gh-light-mode-only)`;

  const markdownText = `<div align="center">\n

  <span>${websiteBadge} ${linkedinBadge}</span>
  <span>${goodreadsBadge} ${pinboardBadge} ${catchafireBadge}</span>\n

  ---\n

<h2>Howdy! I'm Dan.</h2>
<p>I love computers. They've been a major part of my life for over 30 years.
<p>Building websites since 1999, I never stop experimenting with new technology.</p>
<p>I currently work at <a href="https://github.com/comcast" target="_blank">Comcast</a>, and fight for the users.</p>
<p>Be excellent to each other.</p>

  ---\n

  ${githubStatsCardDark}\n
  ${githubStatsCardLight}\n

  </div>\n

  ---\n

  <div align="center">\n

    <!--START_SECTION:waka-->\n
    <!--END_SECTION:waka-->\n\n

  </div>\n

  --- \n

  <details>\n
  <summary>Recent Posts</summary>
  <br />\n  
  ${await fetchPostData(feedURL)}
  </details>

  ---\n

  <details>\n
  <summary>Recent Gists</summary>\n
  <br />\n  
  ${await fetchGistData(username, 5)}\n
  </details>

  ---\n

  <details>\n
  <summary>More Projects</summary>\n
  <br />\n  
  ${await fetchGitHubData(username, featuredRepos)}\n
  </details>

  ---\n

  <details>\n
  <summary>Recent Pins</summary>
  <br />\n  
  ${await fetchPinboardData(5)}
  </details>

  ---\n

  <div align="center">\n
   <a href="https://www.dgrebb.com" target="_blank" rel="noopener noreferrer"><img src="img/favicon.png" width="30" /></a><img style="height: 1px; width: 1px; opacity: 0;" src="https://komarev.com/ghpvc/?username=${username}" />\n
  </div>`;

  const result = md.render(markdownText);

  fs.writeFile("README.md", result, (error) => {
    if (error) throw new Error(`Something went wrong: ${error}.`);
    console.log(`✅ README.md file was succesfully generated.`);
  });
}

generateMarkdown();
