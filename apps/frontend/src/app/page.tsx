export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          HR Finance ERP
        </h1>
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '2rem' 
        }}>
          Welcome to your ERP system
        </p>
        
        <a 
          href="/dashboard"
          style={{
            display: 'block',
            width: '100%',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontWeight: '500',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            textDecoration: 'none',
            marginBottom: '1rem'
          }}
        >
          Go to Dashboard
        </a>
        
        <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
          <p>Version 1.0.0</p>
          <p>Status: Running ✅</p>
        </div>
      </div>
    </div>
  )
}