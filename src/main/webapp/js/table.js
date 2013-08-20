(function($){
     $.fn.extend({
        
        /*
            TODO: searching, filtering
        */

        rhTable: function(options) {
            return this.each(function() {

                options = $.extend({
                            query: undefined,
                            paramFunc: undefined,
                            maxColumns: 4
                        }, options);

                var Sthis = $(this);

                var oTable = Sthis.data("table");
                if (oTable === undefined) {

                    Sthis.empty();

                    // PARAMS
                    var params = '';
                    if (options.paramFunc !== undefined){
                        params = options.paramFunc();
                    }

                    // COLUMNS
                    var columns = options.query.columns();
                    var aoColumns = [];
                    var maxColumns = options.maxColumns;
                    if ( columns.length < maxColumns) maxColumns = columns.length;

                    for (var i = 0; i < maxColumns; i++) {
                        aoColumns.push( {"sTitle" : columns[i].name } );
                    }

                    // TABLE
                    var t = $('<table cellpadding="0" cellspacing="0" border="0" class="display"></table>');
                    Sthis.append(t);
                    oTable = t.dataTable( {
                        "sDom":             '<"H"lrCf>t<"F"ip>',
                        "bJQueryUI":        true,
                        "sPaginationType": "full_numbers",
                        "bProcessing":      true,
                        "bDeferRender":     true, 
                        "bServerSide":      true,
                        "bSort":            true,
                        "bFilter":          true,
                        "bStateSave":       true,
                        //"sAjaxSource": options.query.data(params).data,
                        //"aaData": options.query.data(params).data,

                        "fnServerData":     function (sSource, aoData, fnCallback) {
                                                options.query.data({
                                                    params: params, 
                                                    ppage: aoData[4].value,
                                                    page: Math.floor(aoData[3].value / aoData[4].value) + 1,
                                                    callBack: function(data){
                                                        var obj = {
                                                            iTotalDisplayRecords: data.count,
                                                            iTotalRecords: data.count, 
                                                            aaData: data.data,
                                                            sEcho: aoData[0].value,
                                                            sSearch: aoData[5 + maxColumns].value,
                                                            iDisplayStart: aoData[3].value
                                                        }
                                                        fnCallback(obj); 
                                                    }
                                            });
                                            },
                        "aoColumns": aoColumns
                    } ); 
                    
                    // ROW CLICK 
                    $('table td').live('dblclick',function(){
                        var aPos = oTable.fnGetPosition(this);
                        var aData = oTable.fnGetData(aPos[0]);
                        window.open('fillReq.html?id='+aData[0],'_self');
                    });

                    // ROW HIGHLIGHT
                    $('tbody').click(function(event) {
                        $(oTable.fnSettings().aoData).each(function (){
                            $(this.nTr).removeClass('row_selected');
                        });
                        $(event.target.parentNode).addClass('row_selected');
                    });

                    Sthis.data("table", oTable);
                } 

            });
        },

        rhTableRemove: function () {
            var Sthis = $(this);
            var oTable = Sthis.data("table");
            if (oTable !== undefined) {
                oTable.fnDestroy();
                Sthis.removeData("table");
            }
            Sthis.empty();
            return Sthis;
        }
        
        
    });
})(jQuery);
