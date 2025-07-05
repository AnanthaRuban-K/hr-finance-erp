export default function Dashboard() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '1.5rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>
            Dashboard
          </h1>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            HR Finance ERP v1.0.0
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' 
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1f2937' }}>
              HR Management
            </h3>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
              Employee management, attendance, and leave tracking
            </p>
            <div style={{ marginTop: '1rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '500',
                backgroundColor: '#dcfce7',
                color: '#166534'
              }}>
                Coming Soon
              </span>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' 
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1f2937' }}>
              Finance
            </h3>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
              Accounting, ledger management, and financial reporting
            </p>
            <div style={{ marginTop: '1rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '500',
                backgroundColor: '#dcfce7',
                color: '#166534'
              }}>
                Coming Soon
              </span>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' 
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1f2937' }}>
              Payroll
            </h3>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
              Salary processing, tax calculations, and payslips
            </p>
            <div style={{ marginTop: '1rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '500',
                backgroundColor: '#dcfce7',
                color: '#166534'
              }}>
                Coming Soon
              </span>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}