import CheckboxDefault from '/src/assets/checkbox-default.svg';
import CheckboxSelect from '/src/assets/checkbox-select.svg';

const CheckboxToggle = ({ checked, onClick }) => {
  return (
    <button onClick={onClick} className="w-5 h-5">
      <img src={checked ? CheckboxSelect : CheckboxDefault} alt="checkbox" />
    </button>
  );
};

export default CheckboxToggle;
