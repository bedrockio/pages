import Button from './Button';

export default function Trigger(props) {
  const { name, icon, onClick, onEnter } = props;
  return (
    <Button
      onClick={onClick}
      onMouseEnter={() => {
        onEnter(name);
      }}>
      {icon}
    </Button>
  );
}
