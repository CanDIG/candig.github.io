CanDIG website
====================

[![Build Status](https://travis-ci.org/CanDIG/candig.github.io.svg?branch=master)](https://travis-ci.org/CanDIG/candig.github.io)

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
As you edit files, jekyll will re-build periodicially for frequent updates.  The generated
pages are in the `_site` directory if you want to directly view the outputs.

Commits will trigger a travis build and deploy to our AWS-powered site 
(https://www.distributedgenomics.ca) after a few minutes.  Please feel
free to make obvious fixes directly with commits; for any more substantial changes, make
a PR and request a review.

Note: for Historical Reasons (tm), people still point to candig.github.io, and we want
them to be redirected to the real URL.  By default Jekyll builds with the Jekyll `environment`
variable set to `development`; the GitHub pages deployment builds with the variable set to
`production`.  So if environment is not `development`, a meta refresh tag is included in the
header (`_includes/head.html`) to refresh to distributedgenomics.ca (properly, `{{ site.url }}`;
otherwise it doesn't.  You can test this behaviour by setting the environment variable explicitly:

```
JEKYLL_ENV=production bundle exec jekyll serve
```
