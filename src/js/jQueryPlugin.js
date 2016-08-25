;(function ( $ ) {

	// @import './CollapsibleLists.js';
	// @import './HtmlToc.js';

	/**
	 * Plugin definition
	 *
	 * @param options
	 */
	$.fn.htmlToc = function( options ) {
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
		cssFile: 'https://github.com/roby-rodriguez/html-toc/dist/css/jquery.html-toc.min.css'
	};
})(jQuery);
