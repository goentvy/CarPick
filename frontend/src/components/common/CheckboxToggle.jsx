import CheckboxDefault from '/src/assets/checkbox-default.svg';
import CheckboxSelect from '/src/assets/checkbox-select.svg';

const CheckboxToggle = ({ checked, onClick }) => {
  return (
    <button onClick={onClick} className="w-6 h-6 flex items-center justify-center">
      <img src={checked ? CheckboxSelect : CheckboxDefault} alt="checkbox" className="w-6 h-6 object-contain"/>
    </button>
  );
};

export default CheckboxToggle;
