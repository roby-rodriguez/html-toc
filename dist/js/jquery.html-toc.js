/**
* html-toc - version 0.0.1 - 26-08-2016
* Add easier navigation for your website with this table of contents generator
* Copyright (c) 2016 - RobyRodriguez
* Licensed under MIT 
*/
;
(function ($) {
	/*

	 CollapsibleLists.js

	 An object allowing lists to dynamically expand and collapse

	 Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
	 the terms of the CC0 1.0 Universal legal code:

	 http://creativecommons.org/publicdomain/zero/1.0/legalcode

	 */
	// create the CollapsibleLists object
	var CollapsibleLists = new function () {
		/* Makes all lists with the class 'collapsibleList' collapsible. The
		 * parameter is:
		 *
		 * doNotRecurse - true if sub-lists should not be made collapsible
		 */
		this.apply = function (doNotRecurse) {
			// loop over the unordered lists
			var uls = document.getElementsByTagName('ul');
			for (var index = 0; index < uls.length; index++) {
				// check whether this list should be made collapsible
				if (uls[index].className.match(/(^| )collapsibleList( |$)/)) {
					// make this list collapsible
					this.applyTo(uls[index], true);
					// check whether sub-lists should also be made collapsible
					if (!doNotRecurse) {
						// add the collapsibleList class to the sub-lists
						var subUls = uls[index].getElementsByTagName('ul');
						for (var subIndex = 0; subIndex < subUls.length; subIndex++) {
							subUls[subIndex].className += ' collapsibleList';
						}
					}
				}
			}
		};
		/* Makes the specified list collapsible. The parameters are:
		 *
		 * node         - the list element
		 * doNotRecurse - true if sub-lists should not be made collapsible
		 */
		this.applyTo = function (node, doNotRecurse) {
			// loop over the list items within this node
			var lis = node.getElementsByTagName('li');
			for (var index = 0; index < lis.length; index++) {
				// check whether this list item should be collapsible
				if (!doNotRecurse || node == lis[index].parentNode) {
					// prevent text from being selected unintentionally
					if (lis[index].addEventListener) {
						lis[index].addEventListener('mousedown', function (e) {
							e.preventDefault();
						}, false);
					} else {
						lis[index].attachEvent('onselectstart', function () {
							event.returnValue = false;
						});
					}
					// add the click listener
					if (lis[index].addEventListener) {
						lis[index].addEventListener('click', createClickListener(lis[index]), false);
					} else {
						lis[index].attachEvent('onclick', createClickListener(lis[index]));
					}
					// close the unordered lists within this list item
					toggle(lis[index]);
				}
			}
		};
		/* Returns a function that toggles the display status of any unordered
		 * list elements within the specified node. The parameter is:
		 *
		 * node - the node containing the unordered list elements
		 */
		function createClickListener(node) {
			// return the function
			return function (e) {
				// ensure the event object is defined
				if (!e) e = window.event;
				// find the list item containing the target of the event
				var li = (e.target ? e.target : e.srcElement);
				while (li.nodeName != 'LI') li = li.parentNode;
				// toggle the state of the node if it was the target of the event
				if (li == node) toggle(node);
			};
		}
		/* Opens or closes the unordered list elements directly within the
		 * specified node. The parameter is:
		 *
		 * node - the node containing the unordered list elements
		 */
		function toggle(node) {
			// determine whether to open or close the unordered lists
			var open = node.className.match(/(^| )collapsibleListClosed( |$)/);
			// loop over the unordered list elements with the node
			var uls = node.getElementsByTagName('ul');
			for (var index = 0; index < uls.length; index++) {
				// find the parent list item of this unordered list
				var li = uls[index];
				while (li.nodeName != 'LI') li = li.parentNode;
				// style the unordered list if it is directly within this node
				if (li == node) uls[index].style.display = (open ? 'block' : 'none');
			}
			// remove the current class from the node
			node.className = node.className.replace(/(^| )collapsibleList(Open|Closed)( |$)/, '');
			// if the node contains unordered lists, set its class
			if (uls.length > 0) {
				node.className += ' collapsibleList' + (open ? 'Open' : 'Closed');
			}
		}
	}();
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
		$(headerClass + ":header").each(function () {
			var el = $(this),
				title = el.text(),
				link = "#" + el.attr("id");
			// init if necessary
			tag = tag || el.prop("tagName");
			if (tag !== el.prop("tagName")) {
				if (HtmlToc._rank(tag) < HtmlToc._rank(el.prop("tagName"))) {
					// going deeper - keep track of last known item
					stack.push({
						item: newItem,
						tag: tag
					});
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
	/**
	 * Plugin definition
	 *
	 * @param options
	 */
	$.fn.htmlToc = function (options) {
		// if user options given apply, else use defaults
		var opts = $.extend({}, $.fn.htmlToc.defaults, options || {});
		// add css
		if ($('head > link[href="' + opts.cssFile + '"]').length == 0) {
			$('head').append('<link rel="stylesheet" type="text/css" href="' + opts.cssFile + '" /> ');
		}
		// keep chainability
		return this.each(function () {
			new HtmlToc(this, opts).build()
		});
	};
	/**
	 * Default plugin options
	 *
	 * @type {{cssFile: string}}
	 */
	$.fn.htmlToc.defaults = {
		cssFile: 'https://rawgit.com/roby-rodriguez/html-toc/master/dist/css/jquery.html-toc.min.css'
	};
})(jQuery);
