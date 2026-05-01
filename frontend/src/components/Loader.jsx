export const Loader = ({ text = 'Loading…' }) => (
  <div className="loader">{text}</div>
);

export const Message = ({ variant = 'info', children }) => (
  <div className={`alert alert-${variant === 'error' ? 'error' : 'info'}`}>
    {children}
  </div>
);
