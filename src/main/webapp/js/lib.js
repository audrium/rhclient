(function( $ ) {

    $.rhServer = function(url) {
    	return {
    		url: url,
		 	query: function(sql) {
		 		return {
		 			url: this.url,
		 			sql: sql,
		 			id: undefined,
		 			refresh: function() {
		 				console.log("REFRESH: "+this.sql);
				        $.ajax({
					        type: 		 "POST",
					        url: 		 this.url + "/query",
					        data: 		 this.sql,
					        dataType: 	 "text",
					        async: 		 false,
					        success: $.proxy(
					        	function (id) {
					        		this.id = id;
					        	}, this)
					    });
				    },
				    delete: function() {
				    	if (this.id != undefined) {
					        $.ajax({
						        type: 		 "DELETE",
						        url: 		 this.url + "/query/" + this.id,
						        async: 		 false
						    });
				    	}
				    },
				    data: function(options) {
				    	options = $.extend({
				    		type: "application/json",
				    		ppage: undefined,
				    		page: undefined,
				    		forceRefresh: false,
				    		callBack: undefined,
				    		params: {}
				    	}, options);

				    	var ajx_data = undefined;

				    	if (this.id == undefined || options.forceRefresh) { 
				    		this.refresh();
				    	}

				    	var url = this.url + "/query/" + this.id;
				    	if (options.ppage != undefined && options.page != undefined) {
				    		url += '/page/' + options.ppage + '/' + options.page;
				    	}
				    	url += "/data";

				    	var async = options.callBack != undefined;

				    	$.ajax({
				    		beforeSend:  function(bs) { bs.setRequestHeader("Accept", options.type); },
					        type: 		 "GET",
					        url: 		 url,
					        async: 		 async,
					        data: 		 options.params,
					        success: function (data) {
					        		if (async) {
					        			options.callBack(data);
					        		} else {
					        			ajx_data = data;
					        		}
					        	},
							error: $.proxy(
								function (xhr, ajaxOptions, thrownError) {
							        if (!options.forceRefresh && xhr.status == '404' ) {
							        	options.forceRefresh = true;
							        	ajx_data = this.data(options);
							        }
					        }, this)
					    });

				    	return ajx_data;
				    },

				    metadata: function(options) {
				    	options = $.extend({
				    		verbose: false,
				    		forceRefresh: false,
				    		callBack: undefined
				    	}, options);

				    	var ajx_metadata = undefined;
				    	var async = options.callBack != undefined;

				    	if (this.id == undefined || options.forceRefresh) { 
				    		this.refresh();
				    	}

				    	$.ajax({
					        type: 		 "GET",
					        url: 		 this.url + "/query/" + this.id + '?v=' + options.verbose,
					        async: 		 async,
					        success: function (data) {
					        		if (async) {
					        			options.callBack(data);
					        		} else {
					        			ajx_metadata = data;
					        		}
					        	},
							error: $.proxy(
								function (xhr, ajaxOptions, thrownError) {
							        if (!options.forceRefresh && xhr.status == '404' ) {
							        		options.forceRefresh = true;
								        	ajx_metadata = this.metadata(options);
								        }
								}, this)
					    });

					    return ajx_metadata;
				    },

				    columns: function(verbose) {
				    	return this.metadata({verbose: verbose}).columns;
				    }
		    	};
		    },
    	};
 	};


		

}( jQuery ));