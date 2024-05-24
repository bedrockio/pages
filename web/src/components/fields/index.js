import Field from '../Field';

export function TextField(props) {
  return <Field {...props} type="text" />;
}

export function ImageField(props) {
  return <Field {...props} type="image" />;
}

export function UploadField(props) {
  return <Field {...props} type="upload" />;
}
