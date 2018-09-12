import './css/site.css'
import 'core-js/es6/promise'
import 'core-js/es6/array'

import { app } from './app'
import registerServiceWorker from './registerServiceWorker';

app.$mount('#app');

registerServiceWorker();
