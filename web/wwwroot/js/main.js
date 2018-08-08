import '../scss/main.scss';
import Vue from 'vue';
import Hello from './components/Hello.vue';

const app = new Vue({
    el: '#app',
    data: {
        hello: 'world',
    },
    components: {
        Hello,
    },
});
