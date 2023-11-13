import Button from 'components/Button';

export default function Trigger(props) {
  const { name, icon, onClick, onEnter } = props;
  return (
    <Button
      className="trigger"
      onClick={onClick}
      onMouseEnter={() => {
        onEnter(name);
      }}>
      {icon}
    </Button>
  );
}
