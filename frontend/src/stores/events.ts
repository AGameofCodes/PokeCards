import useEmitter from '@/composables/emitter';
import {CardsStore} from '@/stores/CardsStore';

useEmitter().on('authChanged', () => new CardsStore().reload(true));