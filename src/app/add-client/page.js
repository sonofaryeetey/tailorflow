import MultiStepForm from "@/components/MultiStepForm";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function AddClient() {
    return (
        <main style={{ minHeight: '100vh', padding: '2rem 0' }}>
            <HamburgerMenu />
            <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Add New Client</h1>
                <p>Enter measurements and details below</p>
            </header>
            <MultiStepForm />
        </main>
    );
}
