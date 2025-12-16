import CheckboxDefault from '/images/common/checkbox-default.svg?url';
import CheckboxSelect from '/images/common/checkbox-select.svg?url';

const CheckboxToggle = ({ checked, onClick }) => {
  return (
    <button onClick={onClick} className="w-6 h-6 flex items-center justify-center">
      <img src={checked ? CheckboxSelect : CheckboxDefault} alt="checkbox" className="w-6 h-6 object-contain"/>
    </button>
  );
};

export default CheckboxToggle;
