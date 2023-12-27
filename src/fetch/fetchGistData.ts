interface Gist {
  html_url: string,
  description: string
}

export async function fetchGistData(username: string, count: number): Promise<string> {
  const data = await fetch(`https://api.github.com/users/${username}/gists?per_page=${count}`);

  if (!data.ok) {
    throw new Error(`"${username}/gists" not found. Check with Postman or something.`);
  }

  const gists = await data.json();

  const list = gists.map((gist: Gist) => {
    const {
      html_url: url,
      description
    } = gist;

    return `<li><a href=${url} target="_blank" rel="noopener noreferrer" style="color: #A52A2A;">${description}</a></li>`;
  })


  return `<ul>${list.join("")}</ul>`;
}
