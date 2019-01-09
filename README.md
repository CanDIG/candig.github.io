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

Once you're done, from the `candig.github.io` directory run

```
bundle install
bundle exec jekyll serve
```

And, absent any errors you'll be able to view the website at `http://localhost:4000`.  
As you edit files, jekyll will re-build periodicially for frequent updates.  The generate
pages are in the `_site` directory if you want to directly view the files generated.

Commits will trigger travis deployments here to Github Pages (https://candig.github.io/)
and then push to our AWS-powered site (https://www.distributedgenomics.ca).  Please feel
free to make obvious fixes directly with commits; for any more substantial changes, make
a PR and request a review
