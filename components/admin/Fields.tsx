/** Small helpers for admin forms. */
export function F({ label, name, defaultValue, type = "text", required, help, rows, placeholder }: {
  label: string; name: string; defaultValue?: string | number | null; type?: string; required?: boolean; help?: string; rows?: number; placeholder?: string;
}) {
  return (
    <div className="field">
      <label className="label" htmlFor={`a-${name}`}>
        {label} {required ? <span className="req">*</span> : <span className="opt">Optional</span>}
      </label>
      {help && <p className="help">{help}</p>}
      {rows ? (
        <textarea id={`a-${name}`} name={name} className="textarea" rows={rows} defaultValue={defaultValue ?? ""} required={required} placeholder={placeholder} />
      ) : (
        <input id={`a-${name}`} name={name} type={type} className="input" defaultValue={defaultValue ?? ""} required={required} placeholder={placeholder} />
      )}
    </div>
  );
}

export function S({ label, name, options, defaultValue }: { label: string; name: string; options: { value: string; label: string }[]; defaultValue?: string }) {
  return (
    <div className="field">
      <label className="label" htmlFor={`a-${name}`}>{label}</label>
      <select id={`a-${name}`} name={name} className="select" defaultValue={defaultValue}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function Check({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="consent"><input type="checkbox" name={name} defaultChecked={defaultChecked} /> <span>{label}</span></label>
  );
}
