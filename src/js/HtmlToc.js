/**
 * Constructor for the html-toc
 *
 * @param element
 * @param options
 * @constructor
 */
function HtmlToc(element, options) {
	this.$toc = $(element);
	this.$root = null;
	this.options = options;
}

/**
 * Builds the table of contents
 */
HtmlToc.prototype.build = function () {
	var headerClass = this.options.headerClass || "";
	var last = this._init(),
		stack = [], // keep track of depth
		tag, // last tag processed
		newItem, newList;

	$(headerClass + ":header").each(function() {
		var el = $(this),
			title = el.text(),
			link = "#" + el.attr("id");
		// init if necessary
		tag = tag || el.prop("tagName");

		if (tag !== el.prop("tagName")) {
			if (HtmlToc._rank(tag) < HtmlToc._rank(el.prop("tagName"))) {
				// going deeper - keep track of last known item
				stack.push({ item: newItem, tag: tag });
				newList = $('<ul></ul>');
				newItem = $("<li><a href='" + link + "'>" + title + "</a></li>");
				newList.append(newItem);

				last.children().last().append(newList);
				// update last root
				last = newList;
			} else {
				// going back one (or multiple) level(s)
				var lastRoot = stack.pop();
				while (HtmlToc._rank(lastRoot.tag) !== HtmlToc._rank(el.prop("tagName"))) {
					lastRoot = stack.pop();
				}
				last = lastRoot.item.parent();

				newItem = $("<li><a href='" + link + "'>" + title + "</a></li>");
				last.append(newItem);
			}
			tag = el.prop("tagName");
		} else {
			newItem = $("<li><a href='" + link + "'>" + title + "</a></li>");
			last.append(newItem);
		}
	});
	this.$toc.append(this.$root);
	CollapsibleLists.applyTo(this.$root[0]);
};

/**
 * Builds customizable main root where the collapsible-lists tree is attached
 *
 * @private
 */
HtmlToc.prototype._init = function () {
	var title = this.options.title || "Table of contents";
	this.$root = $('<ul id="toc-menu" class="treeView"></ul>');
	var li = $('<li class="root">' + title + '</li>');
	var ul = $('<ul></ul>');
	li.append(ul);
	this.$root.append(li);
	return ul;
};

//TODO can't u just make a closure on all of this and make _* methods private
/**
 * Returns the number of the html heading
 *
 * @param header
 * @returns {Number}
 * @private
 */
HtmlToc._rank = function (header) {
	return parseInt(header.substring(1));
};
