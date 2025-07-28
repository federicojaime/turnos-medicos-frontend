import Spinner, { PageSpinner, InlineSpinner } from '../ui/Spinner';

export default function LoadingSpinner({ 
  size = 'md', 
  className = '', 
  text = 'Cargando...',
  overlay = false,
  page = false 
}) {
  if (page) {
    return <PageSpinner text={text} />;
  }

  if (overlay) {
    return (
      <Spinner overlay={true} size={size}>
        {text}
      </Spinner>
    );
  }

  if (text) {
    return <InlineSpinner text={text} />;
  }

  return <Spinner size={size} className={className} />;
}