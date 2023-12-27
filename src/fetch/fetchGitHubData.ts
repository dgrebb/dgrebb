export async function fetchGitHubData(username: string, repos: Array<string>): Promise<string> {
  const list = await Promise.all(
    repos.map(async (repo) => {
      const response = await fetch(`https://api.github.com/repos/${username}/${repo}`);
      if (!response.ok) {
        throw new Error(`"${username}/${repo}" not found. Kindy review your list of repositories.`);
      }
      const data = await response.json();

      const {
        html_url: url,
        full_name: name,
        stargazers_count: stars,
        forks_count: forks,
        description: desc
      } = data;

      return `<li><a href=${url} target="_blank" rel="noopener noreferrer" style="color: #A52A2A;">${name}</a>: ${desc}</li>`;
    })
  );

  return `<ul>${list.join("")}</ul>`;
}
