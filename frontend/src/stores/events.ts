import useEmitter from '@/composables/emitter';
import {LabelStore} from '@/stores/LabelStore';
import {SetsStore} from '@/stores/SetsStore';
import {UserCardsStore} from '@/stores/UserCardsStore';

useEmitter().on('authChanged', () => new LabelStore().reload(true));
useEmitter().on('authChanged', () => new SetsStore().reload(true));
useEmitter().on('authChanged', () => new UserCardsStore().reload(true));