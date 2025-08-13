/* eslint-disable @typescript-eslint/no-explicit-any */

export function toFormData(obj: any) {
  const formData = new FormData();

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (Array.isArray(value))
      value.forEach((item) => formData.append(`${key}[]`, item));
    else if (value !== null && value !== undefined) formData.append(key, value);
  });

  return formData;
}
