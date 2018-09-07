(function (app) {
	'use strict';

	/* app.registerModule('plants');*/
	app.registerModule('plants.admin');
	app.registerModule('plants.admin.routes', ['ui.router', 'core.routes', 'plants.admin.services']);
	app.registerModule('plants.admin.services');
	/*app.registerModule('plants.admin.services');*/
	/* app.registerModule('plants.routes', ['ui.router', 'core.routes']);*/
	
}(ApplicationConfiguration));
