(function () {
	'use strict';

	angular
	.module('users')
	.controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$scope', '$state', 'Authentication','$http'];

	function DashboardController($scope,$state,Authentication,$http) {
		var vm = this;
		vm.authentication = Authentication;

		$scope.loading=true;


		$scope.chartConfig = {

			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie'
			},

			title: {
				text: 'Recognize Request Statistics'
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
				headerFormat:'<b>{point.key}</b><br>',
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '{point.name}:<b> {point.percentage:.1f} % </b><br>(Count:<b>{point.y}</b>)',
						style: {
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || '	',
							fontWeight: 'normal',
						}
					},
					showInLegend: true
				}
			},
			series: [{
				name: 'Request',
				colorByPoint: true,
				data: []
			}],
			loading : true,

		}


		vm.drawChart=function(){

			$http.get('/api/statics/recognitions').success(function(response){
				$scope.chartConfig.series[0].data=response.data;
				$scope.loading=false;


			});

			$http.get('/api/counts/users').success(function(response){
				
				$scope.userTypesCount = response.data;
				//$scope.chartConfig.series[0].data=response.data;
			});

			

		}
	}


}());
