html-toc
===
A jQuery plugin that allows to add a collapsible table of contents to your HTML page. The table is built by searching for the H1-H6 headers.

# Navigate
- [Download](#download)
- [Getting Started](#getting-started)
- [Options](#options)
- [Example](#example)
- [Contributing](#contributing)
- [License](#license)

# Download
Run one of these commands in your bash according to your needs.

`git clone https://github.com/roby-rodriguez/html-toc.git`

`npm install html-toc`

Or download the latest version from the [releases](https://github.com/roby-rodriguez/html-toc/releases) page.

# Getting Started
To make this plugin work you only need to include a reference to the source and then the `htmlToc` function be available on a jQuery object. Calling this function builds the table of contents on selected element, such as a div.

At the bottom of the web page, just before the `</body>` tag, include the **jQuery** library. Then include **HTML-toc**.

```html
<script type="text/javascript" src="//code.jquery.com/jquery-1.9.1.js"></script>
<script type="text/javascript" src="//cdn.rawgit.com/roby-rodriguez/html-toc/master/dist/js/jquery.html-toc.min.js"></script>
```

Call the html-toc plugin function and fill it with the options you need. Here is an example of some required options. Read the [Options](#options) section for further informations.

```html
<script>
    $(document).ready(function() {
        $("#sidebar-wrapper").htmlToc({
            headerClass: '.toc'
        });
    });
</script>
```

In the above example only the headers that have the class *toc* are taken into account when building the table of contents.

# Options
To customize the plugin, add the desired option in the plugin itself. These are the available options at the moment:
* **title**: give a custom title to the toc
* **headerClass**: filter only headers of interest
* **cssFile**: customize styling by using your own css

# Example
Check out [this](https://jsfiddle.net/5d51xt49/) fiddle for a working demo. As a side note, stretch out the viewport a little bit in order to see the TOC, as it uses media queries ;)

# Contributing

## Important note
Files in the `dist` directory are generated via Grunt and shouldn't be modified directly. Instead, you should modify the code in the `src` directory.

## Modifying the code
First ensure that you have the latest [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed.

Test that Grunt's CLI is installed by running `grunt --version`.  If the command isn't found, run `npm install -g grunt-cli`. For more information about installing Grunt, see the [getting started guide](http://gruntjs.com/getting-started).

1. Fork and clone the repo.
1. Run `npm install` to install all dependencies (including Grunt).
1. Run `grunt` to build the project.

If everything goes well, you're ready to go. Just be sure to run `grunt` after making any changes, to ensure that nothing is broken.

## Submitting pull requests

1. Create a new branch. You should not work in your `master` branch directly.
1. Fix stuff.
1. Test changes in actual browser using all the pages in the `example` directory.
1. Update the documentation to reflect any changes.
1. Push to your fork and submit a pull request.

# License
Copyright (c) 2016 html-toc, Roby Rodriguez.

Licensed under the [MIT](https://github.com/simple-sidebar/simpler-sidebar/blob/master/LICENSE-MIT) license.