//v-visible
import type {Directive, DirectiveBinding} from 'vue';
import type {DirectiveHook} from '@vue/runtime-core';
import type {VueI18n} from 'vue-i18n';

export type ValidatableClass = {
  attributeTypeMap: Array<{
    name: string,
    baseName: string,
    type: string,
    format: string,
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    min?: number,
    max?: number,
    pattern?: string,
  }>,
};
export type ValidateModel<T extends ValidatableClass> = { type: T, prop: keyof T, i18n: VueI18n };
export type ValidateFunction = { validator: () => boolean, i18n: VueI18n };
export type ValidateModelOrFunction = ValidateModel<any> | ValidateFunction;

function applyAttrs(el: HTMLInputElement, cls: ValidatableClass, propName: string) {
  const attrs = cls.attributeTypeMap.find((e: { name: string }) => e.name === propName);
  //required in the model means the prop has to present in json, not that that strings need length > 0
  // if (attrs?.required !== undefined) {
  //   el.ariaRequired = '' + attrs.required;
  //   el.required = attrs.required;
  // }
  if (attrs?.minLength !== undefined) {
    el.minLength = attrs.minLength;

    //also set required in order for input validation to work
    el.ariaRequired = '' + true;
    el.required = true;
  }
  if (attrs?.maxLength !== undefined) {
    el.maxLength = attrs.maxLength;
  }
  if (attrs?.min !== undefined) {
    el.ariaValueMin = '' + attrs.min;
    el.min = '' + attrs.min;
  }
  if (attrs?.max !== undefined) {
    el.ariaValueMax = '' + attrs.max;
    el.max = '' + attrs.max;
  }
  if (attrs?.pattern !== undefined) {
    el.pattern = '' + attrs.pattern;
  }
}

function validate(el: HTMLInputElement, validateEl: HTMLElement, i18n: VueI18n, validator?: () => boolean, onlyIfValid: boolean = false) {
  if (validator) {
    validator();
  }
  el.reportValidity();
  if (el.validity.valid) {
    el.classList.remove('is-invalid');
    validateEl!.innerText = '';
  } else if (!onlyIfValid) {
    el.classList.add('is-invalid');
    if (el.validity.valueMissing) {
      validateEl!.innerText = i18n.t(`validation.valueMissing`);
    } else if (el.validity.tooShort) {
      validateEl!.innerText = i18n.t(`validation.tooShort`, {minLength: el.minLength});
    } else if (el.validity.tooLong) {
      validateEl!.innerText = i18n.t(`validation.tooLong`, {maxLength: el.maxLength});
    } else if (el.validity.rangeUnderflow) {
      validateEl!.innerText = i18n.t(`validation.rangeUnderflow`, {min: el.min});
    } else if (el.validity.rangeOverflow) {
      validateEl!.innerText = i18n.t(`validation.rangeOverflow`, {max: el.max});
    } else if (el.validity.patternMismatch) {
      validateEl!.innerText = i18n.t(`validation.patternMismatch`, {pattern: el.pattern});
    } else if (el.validity.typeMismatch) {
      switch (el.type) {
        case 'email':
          validateEl!.innerText = i18n.t(`validation.typeMismatch.email`);
          break;
        default:
          validateEl!.innerText = i18n.t(`validation.typeMismatch.unknown`);
          break;
      }
    } else if (el.validity.customError) {
      validateEl!.innerText = el.validationMessage;
    } else {
      validateEl!.innerText = i18n.t(`validation.unknown`);
    }
  }
}

const update: DirectiveHook<HTMLInputElement, any, ValidateModelOrFunction> =
  (el: HTMLInputElement, binding: DirectiveBinding<ValidateModelOrFunction>) => {
    const isModel = binding.value.hasOwnProperty('type');
    const model = binding.value as ValidateModel<any>;
    const func = (binding.value as ValidateFunction).validator;
    if (isModel) {
      applyAttrs(el, model.type, model.prop as string);
    }
    const i18n = binding.value.i18n;
    if (el.parentNode) {
      let validateEl = el.parentNode.querySelector('.invalid-feedback') as HTMLElement | null;
      if (!validateEl) {
        validateEl = document.createElement('div');
        validateEl.classList.add('invalid-feedback');
        el.parentNode.appendChild(validateEl);
        el.addEventListener('blur', _ => {
          validate(el, validateEl!, i18n, func);
        });
        el.addEventListener('keydown', event => {
          if ((event.key === 'Enter' && !event.shiftKey)
            || event.key === 'Tab') {
            validate(el, validateEl!, i18n, func);
          }
        });
        el.addEventListener('input', _ => {
          validate(el, validateEl!, i18n, func, true);
        });
        el.addEventListener('change', _ => {
          validate(el, validateEl!, i18n, func, true);
        });
      }
    }
  };

export const Validate = {
  mounted: update,
  updated: update,
} as Directive<HTMLElement, ValidateModelOrFunction>;