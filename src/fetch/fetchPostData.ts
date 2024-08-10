import Parser from "rss-parser";
const parser = new Parser();

export async function fetchPostData(url: string): Promise<string> {
  const feed = await parser.parseURL(url);

  const list = feed.items.slice(0, 5).map((item) => {
    const date = new Date(item.pubDate as string);
    const publishedDate = `${date.toLocaleString("en-us", {
      month: "long",
      year: "numeric",
    })}`;

    return `<li><a href=${item.link} target="_blank" rel="noopener noreferrer" style="color: #A52A2A;">${item.title}</a> (${publishedDate})</li>`;
  });

  return `
  <ul>
    ${list.join("")}
  </ul>\n
  <!-- <p>» <a href="https://www.dgrebb.com/posts" style="color: #A52A2A;">Read more posts</a></p> -->`;
}
