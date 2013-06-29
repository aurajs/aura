# Building and publishing the Aura public website

This website is built using [middleman](http://middlemanapp.com/)

To edit it, checkout the [website branch](https://github.com/aurajs/aura/tree/website)

    git checkout website

Install middleman

    bundle install

Launch middleman

    middleman

Edit your website, and when you're finish, publish it like this :

    rake publish

It will push a built version to gh-pages on your `origin` remote
