'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/mean-dev',
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    fileLogger: {
      directoryPath: process.cwd(),
      fileName: 'app.log',
      cronLogFileName: 'custom-cron.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/facebook/callback'
  },
  twitter: {
    username: '@TWITTER_USERNAME',
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    fcmServerKey: process.env.GOOGLE_FCM_SERVER_KEY || 'AAAAxcut2xY:APA91bEgBf2PAyjnGk_ppaXpyvUk51GBuvTqKUrrLyudSkOaCHc67FalBmuhtpSoI-JZv3W62wDYhcSoy2YDZwzYRiDibfh4WP_UtznTwHu-oUayCLJM7R7IM2OC982t5zzv2sDA6MDz',
    callbackURL: '/api/auth/google/callback',
    apiServerKey: process.env.GOOGLE_SERVER_KEY || 'AIzaSyBJPUjqwcWXcAh85N_gSizmAqNAwuNz1t0',
    projectId: process.env.GOOGLE_PROJECT_ID || 'unique-cinema-152304',
    visionApiKeyFilePath:'./config/assets/VisinApiKeyFile.json'
  },
  iosCertificate : {
    certificateFilePath : './config/assets/dev-kudzu-cert.pem',
    keyFilePath:'./config/assets/development_push_notification.pem'
  },
  iosCertificateProd : {
    certificateFilePath : './config/assets/ClientAppAccCredential/prod-cert.pem',//'./config/assets/kudzu-prod-cert.pem',
    keyFilePath:'./config/assets/ClientAppAccCredential/prod-key.pem'//'./config/assets/kudzu-prod-key.pem'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/github/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: true
  },
  mailer: {
    from: process.env.MAILER_FROM || 'support@kudzuapp.com',
    /*options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'outlook.office365.com',
      auth: {
        user: process.env.MAILER_EMAIL_ID ||  'support@kudzuapp.com',//'qa1.ideavate@gmail.com',
        pass: process.env.MAILER_PASSWORD || 'Support1-'
      }
    }*/
    options :{
      host : 'smtp.office365.com',
      secureConnection : false,
      port : 587, 
      tls : {
        rejectUnauthorized : false,
        ciphers:'SSLv3'
      },
      auth : {
        user : 'support@kudzuapp.com',
        pass : 'Support1-'
      },
      debug : true
    }
  },
  livereload: true,
  seedDB: {
    seed: process.env.MONGO_SEED === 'true',
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'false',
      seedUser: {
        username: process.env.MONGO_SEED_USER_USERNAME || 'seeduser',
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL || 'user@kudzuapp.com',
        firstName: 'User',
        lastName: 'Local',
        password:'user@123',
        displayName: 'User Local',
        roles: ['user']
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME || 'kudzuadmin',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'kudzuadmin@kudzuapp.com',
        password:'kudzuadmin@123',
        firstName: 'Kudzu',
        lastName: 'Admin',
        displayName: 'Kudzu Admin',
        roles: ['user', 'hr', 'qa', 'admin', 'superadmin']
      }
    }
  }
};
