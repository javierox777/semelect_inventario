// ----------------------------------------------------------------------

export const codes = {
  // Email
  emailAlreadyinUse: {
    code: 'auth/email-already-in-use',
    text: 'Ya existe un vendedor registrado con este correo'
  },
  invalidEmail: {
    code: 'auth/invalid-email',
    text: 'The email address is not valid.'
  },
  userDisabled: {
    code: 'auth/user-disabled',
    text: 'The user corresponding to the given credential has been disabled.'
  },
  userNotFound: {
    code: 'auth/user-not-found',
    text: 'No existe ningún vendedor con este correo'
  },
  userSuscription: {
    code: 'auth/user-whithout-suscription',
  },

  // Password
  wrongPassword: {
    code: 'auth/wrong-password',
    text: 'Contraseña incorrecta'
  },
  weakPassword: {
    code: 'auth/weak-password',
    text: 'Password should be at least 6 characters'
  },

  // Repeated number
  stageAlreadyInUse: {
    code: 'stage/number-already-in-use',
    text: 'Ya existe una etapa creada con este número'
  },
  blockAlreadyInUse: {
    code: 'block/number-already-in-use',
    text: 'Ya existe un bloque con este número en esta etapa'
  },
  exerciseAlreadyInUse: {
    code: 'exercise/number-already-in-use',
    text: 'Ya existe un ejercicio con este número en este bloque'
  },

  //Repeated product
  skuAlreadyInUse: {
    code: 'product/sku-already-in-use',
    text: 'Ya existe una producto con el mismo SKU'
  },
  nameAlreadyInUse: {
    code: 'product/name-already-in-use',
    text: 'Ya existe una producto con el mismo nombre'
  },
};

const {
  emailAlreadyinUse,
  invalidEmail,
  userDisabled,
  userNotFound,
  wrongPassword,
  weakPassword,
  skuAlreadyInUse,
  nameAlreadyInUse
} = codes;

export function emailError(errors) {
  return {
    error:
      errors === emailAlreadyinUse.code ||
      errors === invalidEmail.code ||
      errors === userDisabled.code ||
      errors === userNotFound.code,
    helperText:
      (errors === emailAlreadyinUse.code && emailAlreadyinUse.text) ||
      (errors === invalidEmail.code && invalidEmail.text) ||
      (errors === userDisabled.code && userDisabled.text) ||
      (errors === userNotFound.code && userNotFound.text)
  };
}

export function passwordError(errors) {
  return {
    error: errors === wrongPassword.code || errors === weakPassword.code,
    helperText:
      (errors === wrongPassword.code && wrongPassword.text) ||
      (errors === weakPassword.code && weakPassword.text)
  };
}

export function skuProductError(errors) {
  return {
    error: errors === skuAlreadyInUse.code,
    helperText:
      (errors === skuAlreadyInUse.code && skuAlreadyInUse.text)
  };
}

export function nameProductError(errors) {
  return {
    error: errors === nameAlreadyInUse.code,
    helperText:
      (errors === nameAlreadyInUse.code && nameAlreadyInUse.text)
  };
}
