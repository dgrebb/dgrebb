interface Pin {
  href: string,
  description: string,
  tags?: string[]
}

export async function fetchPinboardData(count: number): Promise<string> {
  const { PINBOARD_TOKEN: token } = process.env;

  const data = await fetch(`https://api.pinboard.in/v1/posts/recent?count=${count}&format=json&auth_token=${token}`);

  if (!data.ok) {
    throw new Error(`Couldn't connect to Pinboard`);
  }

  const pins = await data.json();

  const list = pins.posts.map((pin: Pin) => {
    const {
      href,
      description,
      tags,
    } = pin;
    return `<li><a href=${href} target="_blank" rel="noopener noreferrer" style="color: #A52A2A;">${description}</a></li>`;
  });

  return `<ul>${list.join("")}</ul>`;
}
