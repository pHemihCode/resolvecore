import Logo from '../components/ui/logo';

export default function Header() {
    return (
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4">
                <Logo size="md" />
            </div>
        </header>
    );
}