import useEmitter from '@/composables/emitter';
import {UserCardsStore} from '@/stores/UserCardsStore';

useEmitter().on('authChanged', () => new UserCardsStore().reload(true));