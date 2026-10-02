import { Icon } from '@iconify/react';
import '../components/InputField.css';
const InputField = ({ label, icon, type = 'text', placeholder, value, onChange,...rest }) => {
  return (
    <div className="auth-form-group">
      <label className="auth-form-label">{label}</label>
      <div className="auth-input-wrapper">
        <Icon icon={icon} className="auth-input-icon" />
        <input
          type={type}
          className="auth-custom-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...rest}
        />
      </div>
    </div>
  );
};
export default InputField;
