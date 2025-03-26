import useEmitter from '@/composables/emitter';
import {LabelStore} from '@/stores/LabelStore';
import {UserCardsStore} from '@/stores/UserCardsStore';

useEmitter().on('authChanged', () => new LabelStore().reload(true));
useEmitter().on('authChanged', () => new UserCardsStore().reload(true));