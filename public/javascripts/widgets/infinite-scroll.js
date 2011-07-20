/*   Copyright (c) 2010, Diaspora Inc.  This file is
*   licensed under the Affero General Public License version 3 or later.  See
*   the COPYRIGHT file.
*/

(function() {
  var InfiniteScroll = function() {
    var self = this;
    this.options = {
      navSelector  : "#pagination",
      nextSelector : ".paginate",
      itemSelector : ".stream_element",
      pathParse    : function( pathStr, nextPage ){
        var newPath = pathStr.replace("?", "?only_posts=true&"),
        	lastTime = $('#main_stream .stream_element').last().find('.time').attr('integer');
        return newPath.replace( /max_time=\d+/, 'max_time=' + lastTime);
      },
      bufferPx: 500,
      debug: false,
      donetext: Diaspora.I18n.t("infinite_scroll.no_more"),
      loadingText: "",
      loadingImg: '/images/ajax-loader.gif'
    };

    this.subscribe("widget/ready", function() {
      self.globalSubscribe("stream/reloaded", self.reInitialize, this);
      self.initialize();
    });

    this.reInitialize = function() {
      self.clear();
      self.initialize();  
    };

    this.initialize = function() {
      if($('#main_stream').length !== 0){
				$('#main_stream').infinitescroll(this.options, function() {
	  			self.globalPublish("stream/scrolled");
				});
      } else if($('#people_stream.contacts').length !== 0){
				$("#people_stream.contacts").infinitescroll($.extend(self.options, {
	  			navSelector  : ".pagination",
	  			nextSelector : ".next_page"
				}), function() {
	  			self.globalPublish("stream/scrolled");
				});
      }
    };

    this.clear = function() {
      $("#main_stream").infinitescroll("destroy");
    };
  };

  Diaspora.Widgets.add("InfiniteScroll", InfiniteScroll);
})();

