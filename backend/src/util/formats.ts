export const base64RegexString = '^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$';
export const pemRegexString = '^(-----BEGIN.*? KEY-----[\\r\\n]*([0-9a-zA-Z\\+\\/=]{64}[\\r\\n]*)*([0-9a-zA-Z\\+\\/=]{1,63}[\\r\\n]*)?-----END.*? KEY-----)$';
export const uuidFormatRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;