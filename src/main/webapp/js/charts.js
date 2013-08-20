(function($){
     $.fn.extend({

        rhChart: function(options) {
            return this.each(function() {

                options = $.extend({
                            query: undefined,
                            paramFunc: undefined,
                            chart: { type: 'bar' },
                            title: { text: 'Example' },
                            xAxis: { categories: ['xAxis1', 'xAxis2', 'xAxis3'] },
                            yAxis: { title: { text: 'yAxis' } },
                            series: [{
                                name: 'Test1',
                                data: [1, 0, 4]
                            }, {
                                name: 'Test2',
                                data: [5, 7, 3]
                            }]

                        }, options);

                 // PARAMS
                var params = '';
                if (options.paramFunc !== undefined){
                    params = options.paramFunc();
                }

                var Sthis = $(this);
                var oChart = Sthis.data("chart");

                if (oChart === undefined) {

                    Sthis.empty();

                    if (options.query !== undefined){

                        var data = options.query.data({ params: params, ppage: 10, page: 1}).data;
                        console.log(data);
                        var series = []; var array = [];
                        for ( var i = 0; i < data.length; i ++) {
                            array.push(data[i][0]);
                        }
                        series.push( {name: data[5][2], data: array});
                        series.push( {name: data[2][2], data: array});
                        console.log(series);
                        //options.series = series;
                    }

                    Sthis.highcharts(options);
                    Sthis.data("chart", oChart);
                } 

            });
        }
        
    });
})(jQuery);
