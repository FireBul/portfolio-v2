const urls = [
  'https://firebul.github.io/portfolio/about.html',
  'https://firebul.github.io/portfolio/projects.html',
  'https://firebul.github.io/portfolio/project-detail-ads.html',
  'https://firebul.github.io/portfolio/project-detail-coupon.html',
  'https://firebul.github.io/portfolio/leadership.html'
];

Promise.all(urls.map(url => fetch(url).then(res => res.text())))
  .then(results => {
    results.forEach((data, i) => {
      console.log('---', urls[i], '---');
      const matches = data.match(/<img[^>]+src="([^">]+)"/g);
      console.log(matches);
    });
  });
