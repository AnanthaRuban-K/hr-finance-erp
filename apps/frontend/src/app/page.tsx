export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '32px'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#1f2937',
          marginBottom: '16px'
        }}>
          HR & Finance ERP
        </h1>
        <p style={{
          color: '#6b7280',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          Complete Human Resources and Finance Management System
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button style={{
            width: '100%',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            Sign In
          </button>
          <button style={{
            width: '100%',
            border: '1px solid #d1d5db',
            color: '#374151',
            padding: '8px 16px',
            borderRadius: '6px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            Learn More
          </button>
        </div>
      </div>
    </main>
  )
}