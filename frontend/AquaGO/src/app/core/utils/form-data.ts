export function toFormData(obj: any): FormData{
    const formData = new FormData();

    Object.entries(obj).forEach(([key, value]) => {
    if (value == null || value == undefined) return;

    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (v instanceof File) {
          formData.append(`${key}[${i}]`, v);
        } else if (typeof v === 'object') {
          formData.append(`${key}[${i}]`, JSON.stringify(v));
        } else {
          formData.append(`${key}[${i}]`, v.toString());
        }
      });
    } else {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    }
  });
    return formData;
}