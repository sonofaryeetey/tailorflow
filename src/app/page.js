"use client"

import Link from "next/link";
import { Users, UserPlus } from "lucide-react";

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="animate-fade-in" style={{ textAlign: 'center', maxWidth: '600px', width: '100%' }}>
        <h1 style={{
          fontSize: '3.5rem',
          marginBottom: '0.5rem',
          background: 'linear-gradient(to right, #cba16e, #e0b47e)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          TailorFlow
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '4rem', color: '#a1a1aa' }}>
          Premium Bespoke Tailoring Management
        </p>

        <div className="flex flex-col gap-4">
          <Link href="/clients" style={{ textDecoration: 'none' }}>
            <div className="card" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'transform 0.2s, border-color 0.2s',
              border: '1px solid #27272a'
            }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = 'var(--primary)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.borderColor = '#27272a'
              }}
            >
              <div style={{
                background: 'rgba(203, 161, 110, 0.1)',
                padding: '1rem',
                borderRadius: '50%',
                color: 'var(--primary)'
              }}>
                <Users size={32} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: 'white' }}>View Clients</h2>
                <p style={{ margin: 0, fontSize: '1rem' }}>Manage existing clients and orders</p>
              </div>
            </div>
          </Link>

          <Link href="/add-client" style={{ textDecoration: 'none' }}>
            <div className="card" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'transform 0.2s, border-color 0.2s',
              border: '1px solid #27272a'
            }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = 'var(--primary)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.borderColor = '#27272a'
              }}
            >
              <div style={{
                background: 'rgba(203, 161, 110, 0.1)',
                padding: '1rem',
                borderRadius: '50%',
                color: 'var(--primary)'
              }}>
                <UserPlus size={32} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: 'white' }}>Add New Client</h2>
                <p style={{ margin: 0, fontSize: '1rem' }}>Start a new measurement session</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
