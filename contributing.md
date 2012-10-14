Aura Contributing Guidelines
============================

Contributing to Aura is generally the same as any other open source or github project.

### Guidelines for a pull requests:

* Made in a new branch
* Details why the feature / patch should land

    A paragraph or two should do it. Examples and proof of concepts to your proposal are encouraged. If possible, refer to issue(s) which started the PR.
* Adding / Updating Unit Tests

    New features should have new tests to ensure the functionality proposed works. If a change proposed affects the API current tests should be updated to reflect this. Tests reside in `/spec`.
* Passing QA

    Before committing, it's always best to run `npm test` to move through tests. This will run linting and jasmine tests. `./tools/web-server.js` will allow you launch your branch as a server to test in a browser. Travis will automatically run tests against new commits to the PR.
* Code commenting

    If a new function or utility is being added, code comments explaining the purpose, arguments and return object are common. Comments in other places are up to your discretion and the context.
* Code Standards

    Indentation is 2 soft spaces following the flow of current modern JS applications. Much is up to the your discretion in the context of the code being written, but we do refer to [idiomatic.js](https://github.com/rwldrn/idiomatic.js/) standards. See [Coding Standards](https://github.com/addyosmani/aura/wiki/Coding-Standards) in the wiki for more.
* Documentation

    Currently the [`README.md`](https://github.com/addyosmani/aura/blob/master/README.md) is where documentation is kept. Any changes to the code which would require updates here should be included in the PR.

### Using git:

Github provides a nice overlay to a sophisticated version control system. Since we may have any number of PR open at once, rebasing may be asked for from time to time. If you have multiple commits, `squash`ing your commits into one diff be requested before merge.

Aura's **[git guide](https://github.com/addyosmani/aura/wiki/Git-Guide)** covers common situations such as branching, rebasing and squashing. For further git resources refer to [github's git documentation](https://help.github.com/) and whatever you can google. The book [Pro Git](http://git-scm.com/book) is available online to peruse free of charge :).

When in doubt, ask!

### Bug reports and patches:

Bug reports may follow the same flow as above with some additions. The report should specifically as possible detail the expected behavior, what went wrong, environmental settings (such as browser, configs, node packages, etc) and what steps can be done to reproduce tie bug. Referring to other open source projects, [Mozilla's Bug Writing Guidelines](https://developer.mozilla.org/en-US/docs/Bug_writing_guidelines) provide pointers for making bug report more useful.

You may file a bug report by creating an issue [issues](https://github.com/addyosmani/aura/issues) or directly through a pull request.

### Ideas and feature requests:

This does not require a pull request.

Posting an idea or question can be done through [issues](https://github.com/addyosmani/aura/issues). Linking to any examples or proof of concepts is also helpful. You can use markdown to show code snippets or stage an example on your server and link to it.
