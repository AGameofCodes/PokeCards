import {createApp} from 'vue';
import {createPinia} from 'pinia';

import App from './App.vue';
import router from './router';

import './assets/main.css';
import './assets/mobile.scss';
import './assets/bootstrap.extensions.scss';
import 'bootstrap/dist/css/bootstrap.css';
// noinspection ES6UnusedImports
import * as bootstrap from 'bootstrap';
// noinspection ES6UnusedImports
import * as popper from '@popperjs/core';
import '@fortawesome/fontawesome-free/css/all.css';
import {createI18n} from '@/locale/locale';
import Vue3Toastify, {type ToastContainerOptions} from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import './stores/events'; //force event registration

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(createI18n());
app.use(Vue3Toastify, {position: 'bottom-right'} as ToastContainerOptions);

app.mount('#app');
