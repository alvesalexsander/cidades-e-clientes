const { Estado, Sexo } = require('../enums');

function validatedId(value) {
  value = value?.match?.(/(^[\w]{24}$)/)?.[1];
  if (!value) {
    return null;
  }
  return value;
}

function validatedClienteNome(value) {
  value = value?.replace?.(/_/gm, ' ')?.match?.(/(^[\.a-z_ A-ZÀ-ž]{1,200}$)/)?.[1];
  if (!value) {
    return null;
  }
  return value;
}

function validatedDataNascimento(value) {
  value = value.match?.(/(^\d{2}\/\d{2}\/\d{4}$)/)?.[1];
  if (!value) {
    return null;
  }
  return value;
}

function validatedSexo(value) {
  value = Sexo[value];
  if (!value) {
    return null;
  }
  return value;
}

function validatedEstado(value) {
  value = value?.match?.(/^([a-zA-Z]{2}$)/)?.[1];
  value = Estado[value];
  if (!value) {
    return null;
  }
  return value;
}

function validatedCidadeNome(value) {
  value = value?.match?.(/^([a-z A-ZÀ-ž]{2,100}$)/)?.[1];
  if (!value) {
    return null;
  }
  return value;
}

module.exports = {
  validatedId,
  validatedClienteNome,
  validatedDataNascimento,
  validatedSexo,
  validatedEstado,
  validatedCidadeNome,
}