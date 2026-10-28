CanDIG website
====================

Website for the CanDIG project; based on the [Agency Jekyll Theme](https://y7kim.github.io/agency-jekyll-theme).

This is a [Jekyll](https://jekyllrb.com) website.  To develop on your own machine, first
follow the [Jekyll install instructions](https://jekyllrb.com/docs/installation/) for your
system: that will look a little like

```
gem install bundler jekyll
```

once you have a new Ruby and ruby gems installed, but the details will differ a bit between platforms. 

You will also need a Javascript runtime installed, one way that works is to install node.js.

Once you're done, from the `candig.github.io` directory run

```
bundle install
bundle exec jekyll serve
```

If you are using ruby 3.0, you will also need to install webrick 

```
bundle add webrick 
```

And, absent any errors you'll be able to view the website at `http://localhost:4000`.  
As you edit files, jekyll will re-build periodicially for frequent updates.  The generated
pages are in the `_site` directory if you want to directly view the outputs.

The site is published at https://candig.github.io. Pushes to the `production` branch trigger the
GitHub Actions workflow in `.github/workflows/pages_deploy.yml`, which builds the site and deploys it
to GitHub Pages. For changes and updates, make a PR and request a review before merging.

The deployment builds with `JEKYLL_ENV=production`; to check a production build locally, run

```
JEKYLL_ENV=production bundle exec jekyll serve
```
