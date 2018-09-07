(function (app) {
	'use strict';

	/* app.registerModule('plants');*/
	app.registerModule('recognitions.admin');
	app.registerModule('recognitions.admin.routes', ['ui.router', 'core.routes', 'recognitions.admin.services']);
	app.registerModule('recognitions.admin.services');
	/* app.registerModule('plants.routes', ['ui.router', 'core.routes']);*/
	/* app.registerModule('recognitions.services');*/
}(ApplicationConfiguration));
