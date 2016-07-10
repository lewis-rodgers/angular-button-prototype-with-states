/* buttonSpinner.directive.js */

/**
 * @desc button spinner that can be used when processing something
 * @example <button spinner></button>
 */
angular
	.module('app', [])

	.controller('MainCtrl', function($scope, $q) {
		$scope.obj = {
			kind: 'upload',
			during: 'Uploading',
			end: 'Done!'
		};

		$scope.doSomething = function() {
			var deferred = $q.defer();

			/* simulated async function */
			setTimeout(function() {
				deferred.resolve('Done!');
			}, 3000);

			return deferred.promise;
		}
	})

	.directive('buttonProcess', function() {
		return {
			restrict: 'E',
			scope: {
				config: '=',
				process: '&'
			},
			link: function(scope, el, attr) {

				el.on('click', function() {

					var defaultText = el.text(),
							process = scope.process,
							kind = attr.kind || scope.config.kind,
							duringText = attr.during || scope.config.during,
							endText = attr.end || scope.config.end,
							textEl = el.find('ng-transclude'),
							spinnerEl = el.find('span');

					el.attr('disabled', 'disabled')
					spinnerEl.addClass('active');
					textEl.text(duringText);

					/*
					* If data-type is 'upload', include the progress bar markup.
					*/
					if( kind == 'upload') {
						spinnerEl.append('<div class="progress-bar"></div>');
					}

					process().then(function() {
						el.removeAttr('disabled')
						spinnerEl.removeClass('active');
						textEl.text(endText ? endText : defaultText); /* return to starting text if ending text isn't defined */
					});
				})
			},
			transclude: true,
			template: [
				'<button class="button">',
					'<span class="spinner spinner--sm">',
						'<span class="spinner--one"></span>',
						'<span class="spinner--two"></span>',
						'<span class="spinner--three"></span>',
						/* progress bar is included here */
					'</span>',
					'<ng-transclude></ng-transclude>',
				'</button>'
			].join('')
		};
	});
