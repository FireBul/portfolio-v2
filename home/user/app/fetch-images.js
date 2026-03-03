fetch('https://firebul.github.io/portfolio/index.html')
  .then(res => res.text())
  .then(data => {
    const matches = data.match(/<img[^>]+src="([^">]+)"/g);
    console.log(matches);
  });
