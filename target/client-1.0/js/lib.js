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
				        $.ajax({
					        type: 		 "POST",
					        url: 		 this.url + "/query",
					        data: 		 this.sql,
					        dataType: 	 "text",
					        async: 		 false,
					        success: function (id) {
					        	this.id = id;
					        },
							error: function (xhr, ajaxOptions, thrownError) {
						        console.log(thrownError.message);
					        }
					    });
				    }
		    	};
		    }
    	};
 	};


		

}( jQuery ));